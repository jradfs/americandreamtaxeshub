-- Begin transaction
BEGIN;

-- Create service types enum if not exists
DO $$ BEGIN
    CREATE TYPE service_type AS ENUM (
        'tax_preparation',
        'bookkeeping',
        'payroll',
        'advisory'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create business types enum if not exists
DO $$ BEGIN
    CREATE TYPE business_type AS ENUM (
        'individual',
        'sole_proprietorship',
        'partnership',
        'llc',
        's_corporation',
        'c_corporation'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create document categories enum if not exists
DO $$ BEGIN
    CREATE TYPE document_category AS ENUM (
        'tax_return',
        'financial_statement',
        'payroll',
        'corporate',
        'supporting'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS business_type business_type,
ADD COLUMN IF NOT EXISTS active_services service_type[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ein VARCHAR(10),
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS service_history JSONB DEFAULT '[]'::jsonb;

-- Create project templates table
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    service_type service_type NOT NULL,
    business_type business_type,
    required_documents JSONB DEFAULT '[]'::jsonb,
    task_template JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES project_templates(id),
ADD COLUMN IF NOT EXISTS service_type service_type,
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;

-- Create documents table if not exists
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    project_id UUID REFERENCES projects(id),
    category document_category NOT NULL,
    tax_year INTEGER,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Update RLS policies to allow full team access
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON clients;
CREATE POLICY "Enable full access for authenticated users" ON clients
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable full access for authenticated users" ON projects;
CREATE POLICY "Enable full access for authenticated users" ON projects
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable full access for authenticated users" ON tasks;
CREATE POLICY "Enable full access for authenticated users" ON tasks
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable full access for authenticated users" ON documents;
CREATE POLICY "Enable full access for authenticated users" ON documents
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_tax_year ON documents(tax_year);

-- Add text search capabilities
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS fts_search tsvector 
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(ein, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(contact_info::text, '')), 'C')
) STORED;

CREATE INDEX IF NOT EXISTS clients_fts_search_idx ON clients USING gin(fts_search);

-- Commit transaction
COMMIT;