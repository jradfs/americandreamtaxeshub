-- Begin transaction
BEGIN;

-- Drop all existing policies
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('clients', 'tax_returns', 'users', 'projects'))
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Enable full access for authenticated users" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow read access to authenticated users" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow write access to admin users" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow users to read all profiles" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow users to update their own profile" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow admin to manage all profiles" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow read access to team members" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow write access to project managers" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Allow write access to assigned users" ON %I', table_name);
  END LOOP;
END $$;

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create full access policies for all tables
CREATE POLICY "Enable full access for authenticated users" ON clients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable full access for authenticated users" ON tax_returns
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable full access for authenticated users" ON users
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable full access for authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Commit transaction
COMMIT; 