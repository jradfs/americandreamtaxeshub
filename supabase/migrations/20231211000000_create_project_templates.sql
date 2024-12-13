-- Create project templates table
CREATE TABLE project_templates (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    default_priority text CHECK (default_priority IN ('low', 'medium', 'high')),
    estimated_total_minutes integer,
    recurring_schedule text,
    seasonal_priority jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create template tasks table
CREATE TABLE template_tasks (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id uuid REFERENCES project_templates(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    estimated_minutes integer,
    priority text CHECK (priority IN ('low', 'medium', 'high')),
    dependencies uuid[] DEFAULT ARRAY[]::uuid[],
    order_index integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_template_tasks_template_id ON template_tasks(template_id);
CREATE INDEX idx_project_templates_category ON project_templates(category);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_templates_updated_at
    BEFORE UPDATE ON project_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_tasks_updated_at
    BEFORE UPDATE ON template_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE project_templates IS 'Project templates for common business processes';
COMMENT ON TABLE template_tasks IS 'Task templates associated with project templates';
COMMENT ON COLUMN project_templates.category IS 'Type of project (e.g., Bookkeeping, Tax Return, Payroll)';
COMMENT ON COLUMN project_templates.seasonal_priority IS 'JSON object defining priority levels for different seasons';
COMMENT ON COLUMN template_tasks.order_index IS 'Order of tasks within the template';
COMMENT ON COLUMN template_tasks.dependencies IS 'Array of task IDs that must be completed before this task';
