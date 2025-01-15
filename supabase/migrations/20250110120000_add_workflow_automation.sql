-- Begin transaction
BEGIN;

-- Add workflow and automation support to projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS automation_config JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS workflow_state JSONB DEFAULT '{
    "current_step": null,
    "steps_completed": [],
    "next_steps": [],
    "blockers": []
}'::jsonb;

-- Enhance client service tracking
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS service_config JSONB DEFAULT '{
    "tax_preparation": null,
    "bookkeeping": null,
    "payroll": null,
    "advisory": null
}'::jsonb,
ADD COLUMN IF NOT EXISTS document_requirements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_progress JSONB DEFAULT '{
    "status": "pending",
    "completed_steps": [],
    "next_steps": [],
    "documents_received": []
}'::jsonb;

-- Enhance document management
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS extracted_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS related_documents UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS document_timeline JSONB DEFAULT '[]'::jsonb;

-- Create workflow templates table
CREATE TABLE IF NOT EXISTS workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    service_type service_type NOT NULL,
    steps JSONB NOT NULL,
    estimated_duration INTEGER,
    required_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add workflow template functions
CREATE OR REPLACE FUNCTION clone_workflow_template(
    template_id UUID,
    project_id UUID,
    custom_config JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB AS $$
DECLARE
    workflow_data JSONB;
BEGIN
    SELECT json_build_object(
        'template_id', wt.id,
        'name', wt.name,
        'steps', wt.steps,
        'config', custom_config,
        'started_at', NOW()
    ) INTO workflow_data
    FROM workflow_templates wt
    WHERE wt.id = template_id;
    
    UPDATE projects
    SET workflow_state = workflow_data
    WHERE id = project_id;
    
    RETURN workflow_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function for workflow state updates
CREATE OR REPLACE FUNCTION update_workflow_state(
    project_id UUID,
    step_name TEXT,
    step_status TEXT,
    step_data JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB AS $$
DECLARE
    current_state JSONB;
    updated_state JSONB;
BEGIN
    SELECT workflow_state INTO current_state
    FROM projects
    WHERE id = project_id;
    
    WITH step_update AS (
        SELECT 
            CASE 
                WHEN step_status = 'completed' THEN 
                    jsonb_set(
                        current_state,
                        '{steps_completed}',
                        COALESCE(current_state->'steps_completed', '[]'::jsonb) || jsonb_build_array(step_name)
                    )
                ELSE current_state
            END as state
    )
    SELECT 
        jsonb_set(
            jsonb_set(
                state,
                '{current_step}',
                to_jsonb(step_name::text)
            ),
            '{step_data}',
            step_data
        ) INTO updated_state
    FROM step_update;
    
    UPDATE projects
    SET workflow_state = updated_state,
        updated_at = NOW()
    WHERE id = project_id;
    
    RETURN updated_state;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for new tables
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON workflow_templates;
CREATE POLICY "Enable full access for authenticated users" ON workflow_templates
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_workflow_state ON projects USING gin(workflow_state);
CREATE INDEX IF NOT EXISTS idx_documents_processing_status ON documents(processing_status);
CREATE INDEX IF NOT EXISTS idx_documents_verification_status ON documents(verification_status);

COMMIT; 