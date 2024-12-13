-- Remove workspace-specific tables as they're redundant
BEGIN;

-- Drop workspace-related tables if they exist
DROP TABLE IF EXISTS workspace_tasks CASCADE;
DROP TABLE IF EXISTS workspace_projects CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;

COMMIT;
