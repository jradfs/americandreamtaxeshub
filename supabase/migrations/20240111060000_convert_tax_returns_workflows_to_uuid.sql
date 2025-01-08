BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Drop all dependencies on tax_returns.id
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop identity and default constraints
    EXECUTE 'ALTER TABLE tax_returns ALTER COLUMN id DROP IDENTITY IF EXISTS';
    EXECUTE 'ALTER TABLE tax_returns ALTER COLUMN id DROP DEFAULT';
    
    -- Drop foreign key constraints
    FOR r IN (SELECT DISTINCT tc.constraint_name, tc.table_name
              FROM information_schema.table_constraints tc
              JOIN information_schema.constraint_column_usage ccu 
              ON tc.constraint_name = ccu.constraint_name
              WHERE ccu.table_name = 'tax_returns' 
              AND ccu.column_name = 'id'
              AND tc.constraint_type = 'FOREIGN KEY')
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-------------------------------------------------------------------------------
-- 2) Convert tax_returns.id from integer to UUID
-------------------------------------------------------------------------------
-- Step a: Add a temporary UUID column
ALTER TABLE tax_returns ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();

-- Step b: create a mapping table for existing data
CREATE TEMP TABLE tr_id_map AS
SELECT id AS old_id, new_id
FROM tax_returns;

-- Step c: Add a temporary UUID column to projects
ALTER TABLE projects ADD COLUMN new_tax_return_id uuid;

-- Step d: update the temporary column in projects
UPDATE projects p
SET new_tax_return_id = m.new_id
FROM tr_id_map m
WHERE p.tax_return_id::integer = m.old_id;

-- Step e: drop the old columns and rename new columns
ALTER TABLE tax_returns DROP COLUMN id CASCADE;
ALTER TABLE tax_returns RENAME COLUMN new_id TO id;
ALTER TABLE tax_returns ALTER COLUMN id SET NOT NULL;
ALTER TABLE tax_returns ADD PRIMARY KEY (id);

ALTER TABLE projects DROP COLUMN tax_return_id;
ALTER TABLE projects RENAME COLUMN new_tax_return_id TO tax_return_id;

-------------------------------------------------------------------------------
-- 3) Convert workflow_templates.id from integer to UUID
-------------------------------------------------------------------------------
-- Step a: Drop all dependencies on workflow_templates.id
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop identity and default constraints
    EXECUTE 'ALTER TABLE workflow_templates ALTER COLUMN id DROP IDENTITY IF EXISTS';
    EXECUTE 'ALTER TABLE workflow_templates ALTER COLUMN id DROP DEFAULT';
    
    -- Drop foreign key constraints
    FOR r IN (SELECT DISTINCT tc.constraint_name, tc.table_name
              FROM information_schema.table_constraints tc
              JOIN information_schema.constraint_column_usage ccu 
              ON tc.constraint_name = ccu.constraint_name
              WHERE ccu.table_name = 'workflow_templates' 
              AND ccu.column_name = 'id'
              AND tc.constraint_type = 'FOREIGN KEY')
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Step b: Add a temporary UUID column
ALTER TABLE workflow_templates ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();

-- Step c: create a mapping table for existing data
CREATE TEMP TABLE wt_id_map AS
SELECT id AS old_id, new_id
FROM workflow_templates;

-- Step d: drop the old id column and rename new_id to id
ALTER TABLE workflow_templates DROP COLUMN id CASCADE;
ALTER TABLE workflow_templates RENAME COLUMN new_id TO id;
ALTER TABLE workflow_templates ALTER COLUMN id SET NOT NULL;
ALTER TABLE workflow_templates ADD PRIMARY KEY (id);

-------------------------------------------------------------------------------
-- 4) Recreate dropped FKs
-------------------------------------------------------------------------------
ALTER TABLE projects
  ADD CONSTRAINT fk_projects_tax_return
    FOREIGN KEY (tax_return_id) REFERENCES tax_returns(id) ON DELETE SET NULL;

DROP TABLE IF EXISTS tr_id_map;
DROP TABLE IF EXISTS wt_id_map;

COMMIT; 