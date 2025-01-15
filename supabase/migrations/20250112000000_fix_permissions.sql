-- Begin transaction
BEGIN;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON tax_returns;

-- Create comprehensive RLS policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tax_returns' 
    AND policyname = 'Enable full access for authenticated users'
  ) THEN
    CREATE POLICY "Enable full access for authenticated users" ON tax_returns
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Enable RLS
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON tax_returns TO authenticated;

-- Only grant sequence usage if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_sequences WHERE sequencename = 'tax_returns_id_seq'
  ) THEN
    EXECUTE 'GRANT USAGE ON SEQUENCE tax_returns_id_seq TO authenticated';
  END IF;
END $$;

-- Commit transaction
COMMIT; 