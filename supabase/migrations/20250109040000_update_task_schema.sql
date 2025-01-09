-- Update task status enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'completed');
    END IF;
END $$;

-- Update task priority enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
    END IF;
END $$;

-- Update tasks table
ALTER TABLE tasks
    ALTER COLUMN status TYPE task_status USING status::task_status,
    ALTER COLUMN priority TYPE task_priority USING priority::task_priority,
    ALTER COLUMN project_id DROP NOT NULL,
    ALTER COLUMN assignee_id DROP NOT NULL,
    ALTER COLUMN due_date DROP NOT NULL,
    ALTER COLUMN start_date DROP NOT NULL,
    ALTER COLUMN tax_form_type DROP NOT NULL,
    ALTER COLUMN category DROP NOT NULL;

-- Add foreign key constraints with ON DELETE SET NULL
ALTER TABLE tasks
    DROP CONSTRAINT IF EXISTS fk_tasks_project_id,
    DROP CONSTRAINT IF EXISTS fk_tasks_assignee_id,
    DROP CONSTRAINT IF EXISTS fk_tasks_parent_task_id,
    ADD CONSTRAINT fk_tasks_project_id
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,
    ADD CONSTRAINT fk_tasks_assignee_id
        FOREIGN KEY (assignee_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    ADD CONSTRAINT fk_tasks_parent_task_id
        FOREIGN KEY (parent_task_id)
        REFERENCES tasks(id)
        ON DELETE SET NULL;

-- Update checklist_items table
ALTER TABLE checklist_items
    ALTER COLUMN description DROP NOT NULL,
    ADD CONSTRAINT fk_checklist_items_task_id
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE;

-- Update activity_log_entries table
ALTER TABLE activity_log_entries
    ALTER COLUMN details DROP NOT NULL,
    ALTER COLUMN created_at DROP NOT NULL,
    ADD CONSTRAINT fk_activity_log_entries_task_id
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,
    ADD CONSTRAINT fk_activity_log_entries_performed_by
        FOREIGN KEY (performed_by)
        REFERENCES users(id)
        ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_checklist_items_task_id ON checklist_items(task_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entries_task_id ON activity_log_entries(task_id);

-- Add RLS policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks are viewable by authenticated users"
    ON tasks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Tasks are insertable by authenticated users"
    ON tasks FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Tasks are updatable by assignee or project members"
    ON tasks FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = assignee_id
        OR EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = tasks.project_id
            AND (
                p.primary_manager = auth.uid()
                OR auth.uid() = ANY(p.team_members)
            )
        )
    );

CREATE POLICY "Tasks are deletable by project managers"
    ON tasks FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = tasks.project_id
            AND p.primary_manager = auth.uid()
        )
    ); 