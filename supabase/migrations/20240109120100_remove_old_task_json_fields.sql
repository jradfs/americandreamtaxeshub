-- Migration: Remove Old Task JSON Fields
-- Description: Remove JSON fields from tasks table after data migration

BEGIN;

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    completed boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create activity_log_entries table
CREATE TABLE IF NOT EXISTS activity_log_entries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    action text NOT NULL,
    details jsonb,
    performed_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now()
);

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

-- Drop the old JSON columns
ALTER TABLE tasks
    DROP COLUMN IF EXISTS checklist,
    DROP COLUMN IF EXISTS activity_log;

COMMIT; 