-- Create template categories table
CREATE TABLE IF NOT EXISTS template_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT template_categories_name_key UNIQUE (name)
);

-- Add category support to project_templates
ALTER TABLE project_templates
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES template_categories(id);

-- Create index for faster category lookups
CREATE INDEX IF NOT EXISTS idx_project_templates_category_id 
ON project_templates(category_id);

-- Enable RLS
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON template_categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON template_categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON template_categories
    FOR UPDATE USING (auth.role() = 'authenticated');
