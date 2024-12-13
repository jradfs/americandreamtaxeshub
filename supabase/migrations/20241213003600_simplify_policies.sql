-- Simplify policies to avoid recursion
BEGIN;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view assigned tasks and project tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view tasks they're assigned to or in their projects" ON tasks;
DROP POLICY IF EXISTS "Task assignees can update their tasks" ON tasks;
DROP POLICY IF EXISTS "Task assignees can delete their tasks" ON tasks;
DROP POLICY IF EXISTS "Authenticated users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Project creators can update their projects" ON projects;
DROP POLICY IF EXISTS "Everyone can view projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;

-- Simpler project policies
CREATE POLICY "Enable read access for all users"
    ON projects FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON projects FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Simpler task policies
CREATE POLICY "Enable read for assigned tasks"
    ON tasks FOR SELECT
    USING (assignee_id = auth.uid());

CREATE POLICY "Enable insert for authenticated users"
    ON tasks FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for assigned tasks"
    ON tasks FOR UPDATE
    USING (assignee_id = auth.uid());

CREATE POLICY "Enable delete for assigned tasks"
    ON tasks FOR DELETE
    USING (assignee_id = auth.uid());

COMMIT;
