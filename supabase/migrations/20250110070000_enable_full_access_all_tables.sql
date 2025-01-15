-- Begin transaction
BEGIN;

-- Drop existing policies for all tables
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON projects;

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create full access policies for all tables
CREATE POLICY "Enable full access for authenticated users" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON tax_returns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Commit transaction
COMMIT; 