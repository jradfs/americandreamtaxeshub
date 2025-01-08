-- Combined Migrations
-- Description: All schema changes in a single transaction for manual execution

BEGIN;

-- Migration 1: Convert IDs to UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- client_documents
ALTER TABLE client_documents
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- client_onboarding_workflows
ALTER TABLE client_onboarding_workflows
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- notes
ALTER TABLE notes
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- notifications
ALTER TABLE notifications
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- owners
ALTER TABLE owners
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- payroll_services
ALTER TABLE payroll_services
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- tax_returns
ALTER TABLE tax_returns
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Migration 2: Remove Old Task JSON Fields
INSERT INTO checklist_items (task_id, title, description, completed)
SELECT 
    id as task_id,
    item->>'title' as title,
    item->>'description' as description,
    (item->>'completed')::boolean as completed
FROM tasks, jsonb_array_elements(checklist::jsonb) as item
WHERE checklist IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO activity_log_entries (task_id, action, details, performed_by, created_at)
SELECT 
    id as task_id,
    entry->>'action' as action,
    (entry->>'details')::jsonb as details,
    (entry->>'performed_by')::uuid as performed_by,
    COALESCE((entry->>'timestamp')::timestamptz, now()) as created_at
FROM tasks, jsonb_array_elements(activity_log::jsonb) as entry
WHERE activity_log IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE tasks
    DROP COLUMN IF EXISTS checklist,
    DROP COLUMN IF EXISTS activity_log;

-- Migration 3: Normalize Contact Info
CREATE TABLE IF NOT EXISTS client_contact_details (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    phone text,
    address text,
    city text,
    state text,
    zip text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_client_contact_details_updated_at ON client_contact_details;
CREATE TRIGGER trig_client_contact_details_updated_at
    BEFORE UPDATE ON client_contact_details
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

INSERT INTO client_contact_details (client_id, phone, address, city, state, zip)
SELECT 
    c.id::uuid, 
    (c.contact_info->>'phone')::text,
    (c.contact_info->>'address')::text,
    (c.contact_info->>'city')::text,
    (c.contact_info->>'state')::text,
    (c.contact_info->>'zip')::text
FROM clients c
WHERE c.contact_info IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE clients
    DROP COLUMN IF EXISTS contact_info;

-- Migration 4: Add Standard Timestamps
ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_notes_updated_at ON notes;
CREATE TRIGGER trig_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_notifications_updated_at ON notifications;
CREATE TRIGGER trig_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

ALTER TABLE owners
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_owners_updated_at ON owners;
CREATE TRIGGER trig_owners_updated_at
    BEFORE UPDATE ON owners
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

ALTER TABLE payroll_services
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_payroll_services_updated_at ON payroll_services;
CREATE TRIGGER trig_payroll_services_updated_at
    BEFORE UPDATE ON payroll_services
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

ALTER TABLE client_documents
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_client_documents_updated_at ON client_documents;
CREATE TRIGGER trig_client_documents_updated_at
    BEFORE UPDATE ON client_documents
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

ALTER TABLE client_onboarding_workflows
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_client_onboarding_workflows_updated_at ON client_onboarding_workflows;
CREATE TRIGGER trig_client_onboarding_workflows_updated_at
    BEFORE UPDATE ON client_onboarding_workflows
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Migration 5: Fix Foreign Keys and Add Indexes
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