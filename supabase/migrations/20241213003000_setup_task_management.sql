-- Setup task management system
BEGIN;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'todo',
    priority text DEFAULT 'medium',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'todo',
    priority text DEFAULT 'medium',
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date timestamptz,
    progress integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Everyone can view projects"
    ON projects FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create projects"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Project creators can update their projects"
    ON projects FOR UPDATE
    USING (EXISTS (
        SELECT 1 
        FROM tasks 
        WHERE tasks.project_id = projects.id 
        AND tasks.assignee_id = auth.uid()
    ));

-- Tasks policies
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

CREATE POLICY "Authenticated users can create tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Task assignees can update their tasks"
    ON tasks FOR UPDATE
    USING (assignee_id = auth.uid());

CREATE POLICY "Task assignees can delete their tasks"
    ON tasks FOR DELETE
    USING (assignee_id = auth.uid());

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

COMMIT;
