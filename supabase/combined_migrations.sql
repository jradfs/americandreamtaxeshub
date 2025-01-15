-- Begin transaction
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Enable public read access" ON tax_returns;
DROP POLICY IF EXISTS "Users can view assigned tax returns" ON tax_returns;
DROP POLICY IF EXISTS "Users can view assigned clients" ON clients;
DROP POLICY IF EXISTS "Users can view assigned projects" ON projects;
DROP POLICY IF EXISTS "Users can view assigned tasks" ON tasks;

-- Enable RLS on all tables
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for tax_returns
CREATE POLICY "tax_returns_select_policy" ON tax_returns
FOR SELECT TO authenticated
USING (
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
  )
);

CREATE POLICY "tax_returns_insert_policy" ON tax_returns
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager', 'accountant')
  )
);

CREATE POLICY "tax_returns_update_policy" ON tax_returns
FOR UPDATE TO authenticated
USING (
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
  )
);

-- Create comprehensive RLS policies for clients
CREATE POLICY "clients_select_policy" ON clients
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tax_returns
    WHERE tax_returns.client_id = clients.id
    AND (
      tax_returns.assigned_to = auth.uid() OR
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
      )
    )
  )
);

CREATE POLICY "clients_insert_policy" ON clients
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
  )
);

-- Create comprehensive RLS policies for tasks
CREATE POLICY "tasks_select_policy" ON tasks
FOR SELECT TO authenticated
USING (
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
  )
);

CREATE POLICY "tasks_insert_policy" ON tasks
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager', 'accountant')
  )
);

CREATE POLICY "tasks_update_policy" ON tasks
FOR UPDATE TO authenticated
USING (
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
  )
);

-- Create profile policies
CREATE POLICY "profiles_select_policy" ON profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
FOR UPDATE TO authenticated
USING (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Grant necessary permissions
GRANT ALL ON tax_returns TO authenticated;
GRANT ALL ON clients TO authenticated;
GRANT ALL ON projects TO authenticated;
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Commit transaction
COMMIT;

-- Add workflows table migration
\i supabase/migrations/20240101000000_create_workflows_table.sql
