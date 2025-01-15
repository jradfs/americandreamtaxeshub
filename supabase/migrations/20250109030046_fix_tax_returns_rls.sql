-- Begin transaction
BEGIN;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tax_returns;

-- Enable RLS on tax_returns table if not already enabled
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read all tax returns
CREATE POLICY "Enable read access for authenticated users"
ON tax_returns
FOR SELECT
TO authenticated
USING (true);

-- Verify the tax_return_status enum has all required values
DO $$
BEGIN
    -- Check if the enum exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tax_return_status') THEN
        CREATE TYPE tax_return_status AS ENUM (
            'not_started',
            'gathering_documents',
            'in_progress',
            'review',
            'filed',
            'amended'
        );
    ELSE
        -- Add missing values if they don't exist
        BEGIN
            ALTER TYPE tax_return_status ADD VALUE IF NOT EXISTS 'not_started';
            EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE tax_return_status ADD VALUE IF NOT EXISTS 'gathering_documents';
            EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END$$;

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_tax_returns_status ON tax_returns(status);
CREATE INDEX IF NOT EXISTS idx_tax_returns_client_id ON tax_returns(client_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_assigned_to ON tax_returns(assigned_to);

-- Commit transaction
COMMIT;
