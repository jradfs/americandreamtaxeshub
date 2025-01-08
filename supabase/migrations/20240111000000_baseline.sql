-- Migration: Baseline Schema
-- Description: Initial schema baseline from current database state

BEGIN;

-- Create extension for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. Drop existing foreign key constraints
--------------------------------------------------------------------------------
ALTER TABLE owners DROP CONSTRAINT IF EXISTS owners_individual_id_fkey;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_project_id_fkey;

--------------------------------------------------------------------------------
-- 2. Create temporary mapping tables
--------------------------------------------------------------------------------
CREATE TEMP TABLE individual_id_map AS
SELECT id::bigint as old_id, uuid_generate_v4() as new_id
FROM individuals;

CREATE TEMP TABLE project_id_map AS
SELECT id::bigint as old_id, uuid_generate_v4() as new_id
FROM projects;

--------------------------------------------------------------------------------
-- 3. Convert tables to use UUID
--------------------------------------------------------------------------------

-- individuals
ALTER TABLE individuals 
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

UPDATE individuals i
SET id = m.new_id::uuid
FROM individual_id_map m
WHERE i.id::bigint = m.old_id;

ALTER TABLE individuals 
    ALTER COLUMN id TYPE uuid USING id::uuid,
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Update owners.individual_id references
UPDATE owners o
SET individual_id = m.new_id::uuid
FROM individual_id_map m
WHERE o.individual_id::bigint = m.old_id;

-- owners
ALTER TABLE owners 
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

ALTER TABLE owners 
    ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
    ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
    ALTER COLUMN individual_id TYPE uuid USING individual_id::uuid;

-- Update notes.project_id references
UPDATE notes n
SET project_id = m.new_id::uuid
FROM project_id_map m
WHERE n.project_id::bigint = m.old_id;

-- notes
ALTER TABLE notes 
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

ALTER TABLE notes 
    ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
    ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
    ALTER COLUMN project_id TYPE uuid USING project_id::uuid;

-- client_documents
ALTER TABLE client_documents 
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

ALTER TABLE client_documents 
    ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- client_onboarding_workflows
ALTER TABLE client_onboarding_workflows 
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

ALTER TABLE client_onboarding_workflows 
    ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- notifications
ALTER TABLE notifications 
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

ALTER TABLE notifications 
    ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- payroll_services
ALTER TABLE payroll_services 
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

ALTER TABLE payroll_services 
    ALTER COLUMN id TYPE uuid USING uuid_generate_v4(),
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();

--------------------------------------------------------------------------------
-- 4. Restore foreign key constraints
--------------------------------------------------------------------------------
ALTER TABLE owners
    ADD CONSTRAINT owners_individual_id_fkey
        FOREIGN KEY (individual_id) REFERENCES individuals(id) ON DELETE SET NULL;

ALTER TABLE notes
    ADD CONSTRAINT notes_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

--------------------------------------------------------------------------------
-- 5. Cleanup
--------------------------------------------------------------------------------
DROP TABLE individual_id_map;
DROP TABLE project_id_map;

COMMIT; 