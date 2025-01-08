-- Migration: Fix Foreign Keys and Add Indexes
-- Description: Clean up foreign key constraints and add performance indexes

BEGIN;

-- Fix references to any "view" tables
ALTER TABLE document_tracking
    DROP CONSTRAINT IF EXISTS document_tracking_project_id_fkey,
    ADD CONSTRAINT document_tracking_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE tasks
    DROP CONSTRAINT IF EXISTS tasks_project_id_fkey,
    ADD CONSTRAINT tasks_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    DROP CONSTRAINT IF EXISTS tasks_parent_task_id_fkey,
    ADD CONSTRAINT tasks_parent_task_id_fkey
        FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE SET NULL;

ALTER TABLE project_team_members
    DROP CONSTRAINT IF EXISTS project_team_members_project_id_fkey,
    ADD CONSTRAINT project_team_members_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    DROP CONSTRAINT IF EXISTS project_team_members_user_id_fkey,
    ADD CONSTRAINT project_team_members_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_document_tracking_status ON document_tracking(status);
CREATE INDEX IF NOT EXISTS idx_document_tracking_project_id ON document_tracking(project_id);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_client_contact_details_client_id ON client_contact_details(client_id);

COMMIT; 