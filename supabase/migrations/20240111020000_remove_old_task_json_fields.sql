-- Migration: Remove Old Task JSON Fields
-- Description: Remove JSON fields from tasks table after data migration

BEGIN;

-- Create checklist_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS checklist_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    completed boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create activity_log_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_log_entries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    action text NOT NULL,
    details jsonb,
    performed_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to checklist_items
DROP TRIGGER IF EXISTS trig_checklist_items_updated_at ON checklist_items;
CREATE TRIGGER trig_checklist_items_updated_at
    BEFORE UPDATE ON checklist_items
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Check if the columns exist before trying to migrate data
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'checklist') THEN
        -- Migrate checklist data if not already done
        INSERT INTO checklist_items (task_id, title, description, completed)
        SELECT 
            id as task_id,
            item->>'title' as title,
            item->>'description' as description,
            (item->>'completed')::boolean as completed
        FROM tasks, jsonb_array_elements(checklist::jsonb) as item
        WHERE checklist IS NOT NULL
        ON CONFLICT DO NOTHING;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'activity_log') THEN
        -- Migrate activity log data if not already done
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
    END IF;
END $$;

-- Drop the old JSON columns if they exist
ALTER TABLE tasks
    DROP COLUMN IF EXISTS checklist,
    DROP COLUMN IF EXISTS activity_log;

COMMIT; 