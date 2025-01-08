-- Migration: Normalize Contact Info
-- Description: Break out clients.contact_info into a dedicated table

BEGIN;

-- Create the new table for client contact details
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to client_contact_details
DROP TRIGGER IF EXISTS trig_client_contact_details_updated_at ON client_contact_details;
CREATE TRIGGER trig_client_contact_details_updated_at
    BEFORE UPDATE ON client_contact_details
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Migrate data from the JSON field
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

-- Drop the old JSON column
ALTER TABLE clients
    DROP COLUMN IF EXISTS contact_info;

COMMIT; 