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

-- Create a policy that allows public access (if needed)
CREATE POLICY "Enable public read access"
ON tax_returns
FOR SELECT
TO public
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

-- Verify tax_returns table structure
DO $$
BEGIN
    -- Check if the table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tax_returns') THEN
        CREATE TABLE tax_returns (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            status tax_return_status NOT NULL DEFAULT 'not_started',
            client_id uuid REFERENCES clients(id),
            tax_year integer NOT NULL,
            filing_type text NOT NULL,
            due_date timestamp with time zone,
            extension_date timestamp with time zone,
            filed_date timestamp with time zone,
            assigned_to uuid REFERENCES users(id),
            notes text,
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now()
        );
    ELSE
        -- Make sure the status column exists and is of the correct type
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'tax_returns' AND column_name = 'status') THEN
            ALTER TABLE tax_returns ADD COLUMN status tax_return_status NOT NULL DEFAULT 'not_started';
        END IF;
    END IF;
END$$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tax_returns_status ON tax_returns(status);
CREATE INDEX IF NOT EXISTS idx_tax_returns_client_id ON tax_returns(client_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_assigned_to ON tax_returns(assigned_to);

-- Commit transaction
COMMIT; 