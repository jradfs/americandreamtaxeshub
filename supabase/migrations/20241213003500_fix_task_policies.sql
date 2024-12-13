-- Fix task policies to prevent infinite recursion
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view tasks they're assigned to or in their projects" ON tasks;
DROP POLICY IF EXISTS "Project creators can update their projects" ON projects;

-- Create new policies with EXISTS instead of IN
CREATE POLICY "Users can view assigned tasks and project tasks"
    ON tasks FOR SELECT
    USING (
        assignee_id = auth.uid() OR 
        EXISTS (
            SELECT 1
            FROM tasks as user_tasks
            WHERE user_tasks.project_id = tasks.project_id 
            AND user_tasks.assignee_id = auth.uid()
        )
    );

CREATE POLICY "Project creators can update their projects"
    ON projects FOR UPDATE
    USING (EXISTS (
        SELECT 1 
        FROM tasks 
        WHERE tasks.project_id = projects.id 
        AND tasks.assignee_id = auth.uid()
    ));

COMMIT;
