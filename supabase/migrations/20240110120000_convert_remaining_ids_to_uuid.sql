-- Migration: Convert Remaining Numeric IDs to UUID
-- Description: Convert remaining tables that still use numeric IDs to UUID

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, drop all foreign key constraints
ALTER TABLE owners DROP CONSTRAINT IF EXISTS owners_individual_id_fkey;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_project_id_fkey;

-- Create a mapping table for projects
CREATE TEMP TABLE project_id_map AS
SELECT id as uuid_id FROM projects;

-- individuals
ALTER TABLE individuals ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
UPDATE individuals SET new_id = uuid_generate_v4();

-- Update owners.individual_id references
ALTER TABLE owners ADD COLUMN new_individual_id uuid;
UPDATE owners o 
SET new_individual_id = i.new_id 
FROM individuals i 
WHERE o.individual_id::bigint = i.id::bigint;

-- owners
ALTER TABLE owners ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
UPDATE owners SET new_id = uuid_generate_v4();

-- notes
ALTER TABLE notes ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
UPDATE notes SET new_id = uuid_generate_v4();

-- Also handle project_id in notes table
ALTER TABLE notes ADD COLUMN new_project_id uuid;
UPDATE notes n
SET new_project_id = p.uuid_id
FROM project_id_map p
WHERE n.project_id::text = p.uuid_id::text;

-- client_documents
ALTER TABLE client_documents ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
UPDATE client_documents SET new_id = uuid_generate_v4();

-- client_onboarding_workflows
ALTER TABLE client_onboarding_workflows ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
UPDATE client_onboarding_workflows SET new_id = uuid_generate_v4();

-- notifications
ALTER TABLE notifications ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
UPDATE notifications SET new_id = uuid_generate_v4();

-- payroll_services
ALTER TABLE payroll_services ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
UPDATE payroll_services SET new_id = uuid_generate_v4();

-- Drop old columns and rename new ones
ALTER TABLE individuals DROP COLUMN id;
ALTER TABLE individuals ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE individuals ALTER COLUMN new_id SET DEFAULT uuid_generate_v4();
ALTER TABLE individuals RENAME COLUMN new_id TO id;
ALTER TABLE individuals ADD PRIMARY KEY (id);

ALTER TABLE owners DROP COLUMN individual_id;
ALTER TABLE owners DROP COLUMN id;
ALTER TABLE owners ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE owners ALTER COLUMN new_id SET DEFAULT uuid_generate_v4();
ALTER TABLE owners RENAME COLUMN new_id TO id;
ALTER TABLE owners RENAME COLUMN new_individual_id TO individual_id;
ALTER TABLE owners ADD PRIMARY KEY (id);

ALTER TABLE notes DROP COLUMN project_id;
ALTER TABLE notes DROP COLUMN id;
ALTER TABLE notes ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE notes ALTER COLUMN new_id SET DEFAULT uuid_generate_v4();
ALTER TABLE notes RENAME COLUMN new_id TO id;
ALTER TABLE notes RENAME COLUMN new_project_id TO project_id;
ALTER TABLE notes ADD PRIMARY KEY (id);

ALTER TABLE client_documents DROP COLUMN id;
ALTER TABLE client_documents ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE client_documents ALTER COLUMN new_id SET DEFAULT uuid_generate_v4();
ALTER TABLE client_documents RENAME COLUMN new_id TO id;
ALTER TABLE client_documents ADD PRIMARY KEY (id);

ALTER TABLE client_onboarding_workflows DROP COLUMN id;
ALTER TABLE client_onboarding_workflows ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE client_onboarding_workflows ALTER COLUMN new_id SET DEFAULT uuid_generate_v4();
ALTER TABLE client_onboarding_workflows RENAME COLUMN new_id TO id;
ALTER TABLE client_onboarding_workflows ADD PRIMARY KEY (id);

ALTER TABLE notifications DROP COLUMN id;
ALTER TABLE notifications ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE notifications ALTER COLUMN new_id SET DEFAULT uuid_generate_v4();
ALTER TABLE notifications RENAME COLUMN new_id TO id;
ALTER TABLE notifications ADD PRIMARY KEY (id);

ALTER TABLE payroll_services DROP COLUMN id;
ALTER TABLE payroll_services ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE payroll_services ALTER COLUMN new_id SET DEFAULT uuid_generate_v4();
ALTER TABLE payroll_services RENAME COLUMN new_id TO id;
ALTER TABLE payroll_services ADD PRIMARY KEY (id);

-- Re-add foreign key constraints
ALTER TABLE owners
    ADD CONSTRAINT owners_individual_id_fkey
        FOREIGN KEY (individual_id) REFERENCES individuals(id) ON DELETE SET NULL;

ALTER TABLE notes
    ADD CONSTRAINT notes_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- Drop temporary tables
DROP TABLE project_id_map;

COMMIT; 