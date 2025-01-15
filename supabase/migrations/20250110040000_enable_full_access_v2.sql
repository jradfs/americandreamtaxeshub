-- Begin transaction
BEGIN;

-- Enable RLS on existing tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON clients;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON tax_returns;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON users;

-- Create simple full access policies for all authenticated users
CREATE POLICY "Enable full access for authenticated users" ON clients
FOR ALL USING (true);

CREATE POLICY "Enable full access for authenticated users" ON tax_returns
FOR ALL USING (true);

CREATE POLICY "Enable full access for authenticated users" ON users
FOR ALL USING (true);

-- Commit transaction
COMMIT; 