-- Migration: Add Standard Timestamps
-- Description: Add created_at and updated_at columns with triggers to all tables

BEGIN;

-- Create or update the trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update notes table
ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_notes_updated_at ON notes;
CREATE TRIGGER trig_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Update notifications table
ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_notifications_updated_at ON notifications;
CREATE TRIGGER trig_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Update owners table
ALTER TABLE owners
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_owners_updated_at ON owners;
CREATE TRIGGER trig_owners_updated_at
    BEFORE UPDATE ON owners
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Update payroll_services table
ALTER TABLE payroll_services
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_payroll_services_updated_at ON payroll_services;
CREATE TRIGGER trig_payroll_services_updated_at
    BEFORE UPDATE ON payroll_services
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Update client_documents table
ALTER TABLE client_documents
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_client_documents_updated_at ON client_documents;
CREATE TRIGGER trig_client_documents_updated_at
    BEFORE UPDATE ON client_documents
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Update client_onboarding_workflows table
ALTER TABLE client_onboarding_workflows
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS trig_client_onboarding_workflows_updated_at ON client_onboarding_workflows;
CREATE TRIGGER trig_client_onboarding_workflows_updated_at
    BEFORE UPDATE ON client_onboarding_workflows
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

COMMIT; 