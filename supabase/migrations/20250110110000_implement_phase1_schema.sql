-- Begin transaction
BEGIN;

-- Add template and automation support to projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS automation_config JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS template_data JSONB DEFAULT '{}'::jsonb,
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

-- Create document templates table
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category document_category NOT NULL,
    required_for service_type[] DEFAULT '{}',
    business_types business_type[] DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_template_id ON projects(template_id);
CREATE INDEX IF NOT EXISTS idx_projects_service_type ON projects(service_type);
CREATE INDEX IF NOT EXISTS idx_clients_business_type ON clients(business_type);
CREATE INDEX IF NOT EXISTS idx_documents_verification_status ON documents(verification_status);

-- Add RLS policies for new tables
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable full access for authenticated users" ON document_templates
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable full access for authenticated users" ON workflow_templates
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Add functions for template management
CREATE OR REPLACE FUNCTION clone_project_template(
    template_id UUID,
    client_id UUID,
    custom_config JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    new_project_id UUID;
BEGIN
    INSERT INTO projects (
        template_id,
        client_id,
        name,
        service_type,
        template_data,
        automation_config
    )
    SELECT
        pt.id,
        client_id,
        pt.name,
        pt.service_type,
        pt.task_template,
        custom_config
    FROM project_templates pt
    WHERE pt.id = template_id
    RETURNING id INTO new_project_id;
    
    RETURN new_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function for document validation
CREATE OR REPLACE FUNCTION validate_document_requirements(
    project_id UUID
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    WITH required_docs AS (
        SELECT pt.required_documents
        FROM projects p
        JOIN project_templates pt ON p.template_id = pt.id
        WHERE p.id = project_id
    ),
    submitted_docs AS (
        SELECT json_agg(json_build_object(
            'category', category,
            'id', id,
            'verification_status', verification_status
        )) as docs
        FROM documents
        WHERE project_id = project_id
    )
    SELECT json_build_object(
        'required', required_docs.required_documents,
        'submitted', COALESCE(submitted_docs.docs, '[]'::json),
        'missing', (
            SELECT json_agg(req)
            FROM jsonb_array_elements(required_docs.required_documents) req
            WHERE NOT EXISTS (
                SELECT 1
                FROM documents d
                WHERE d.project_id = project_id
                AND d.category::text = req->>'category'
            )
        )
    ) INTO result
    FROM required_docs, submitted_docs;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT; 