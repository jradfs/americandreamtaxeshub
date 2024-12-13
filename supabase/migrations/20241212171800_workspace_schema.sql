-- Create workspace tables
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{"defaultView": "list", "defaultGrouping": "Stage"}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES workspace_projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  section TEXT NOT NULL DEFAULT 'strategy',
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  duration INTEGER,
  start_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  assignees UUID[] NOT NULL DEFAULT '{}',
  dependencies UUID[] NOT NULL DEFAULT '{}',
  labels TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own workspaces"
ON workspaces FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own workspaces"
ON workspaces FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own workspaces"
ON workspaces FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own workspaces"
ON workspaces FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Workspace projects policies
CREATE POLICY "Users can view projects in their workspaces"
ON workspace_projects FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_projects.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create projects in their workspaces"
ON workspace_projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_projects.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update projects in their workspaces"
ON workspace_projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_projects.workspace_id
    AND workspaces.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_projects.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete projects in their workspaces"
ON workspace_projects FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_projects.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

-- Workspace tasks policies
CREATE POLICY "Users can view tasks in their workspaces"
ON workspace_tasks FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_tasks.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tasks in their workspaces"
ON workspace_tasks FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_tasks.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update tasks in their workspaces"
ON workspace_tasks FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_tasks.workspace_id
    AND workspaces.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_tasks.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete tasks in their workspaces"
ON workspace_tasks FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM workspaces
    WHERE workspaces.id = workspace_tasks.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);
