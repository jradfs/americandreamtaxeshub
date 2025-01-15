-- Begin transaction
BEGIN;

-- Update projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS team_members UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Update clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Update task status enum
DROP TYPE IF EXISTS task_status CASCADE;
CREATE TYPE task_status AS ENUM (
    'not_started',
    'in_progress',
    'review',
    'completed'
);

-- Update tax return status enum
DROP TYPE IF EXISTS tax_return_status CASCADE;
CREATE TYPE tax_return_status AS ENUM (
    'not_started',
    'gathering_documents',
    'in_progress',
    'review',
    'filed',
    'amended'
);

-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Tasks are viewable by assignee or project members" ON tasks;
DROP POLICY IF EXISTS "Tasks are insertable by project members" ON tasks;
DROP POLICY IF EXISTS "Tasks are updatable by assignee or project members" ON tasks;
DROP POLICY IF EXISTS "Tasks are deletable by project members" ON tasks;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are viewable by assigned user or client owner" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are updatable by assigned user" ON tax_returns;

-- Create task policies
CREATE POLICY "Tasks are viewable by assignee or project members"
ON tasks FOR SELECT
USING (
  auth.uid() = assignee_id OR
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = tasks.project_id
    AND (
      auth.uid() = ANY(p.team_members) OR
      auth.uid() = p.owner_id
    )
  )
);

CREATE POLICY "Tasks are insertable by project members"
ON tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_id
    AND (
      auth.uid() = ANY(p.team_members) OR
      auth.uid() = p.owner_id
    )
  )
);

CREATE POLICY "Tasks are updatable by assignee or project members"
ON tasks FOR UPDATE
USING (
  auth.uid() = assignee_id OR
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = tasks.project_id
    AND (
      auth.uid() = ANY(p.team_members) OR
      auth.uid() = p.owner_id
    )
  )
)
WITH CHECK (
  auth.uid() = assignee_id OR
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = tasks.project_id
    AND (
      auth.uid() = ANY(p.team_members) OR
      auth.uid() = p.owner_id
    )
  )
);

CREATE POLICY "Tasks are deletable by project members"
ON tasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = tasks.project_id
    AND (
      auth.uid() = ANY(p.team_members) OR
      auth.uid() = p.owner_id
    )
  )
);

-- Create tax returns policies
CREATE POLICY "Tax returns are viewable by assigned user or client owner"
ON tax_returns FOR SELECT
USING (
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = tax_returns.client_id
    AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "Tax returns are updatable by assigned user"
ON tax_returns FOR UPDATE
USING (
  auth.uid() = assigned_to
)
WITH CHECK (
  auth.uid() = assigned_to
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tax_returns_status ON tax_returns(status);
CREATE INDEX IF NOT EXISTS idx_tax_returns_client_id ON tax_returns(client_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_assigned_to ON tax_returns(assigned_to);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Commit transaction
COMMIT; 