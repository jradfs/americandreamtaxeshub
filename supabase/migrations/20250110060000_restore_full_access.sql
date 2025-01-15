-- Begin transaction
BEGIN;

-- Drop all existing policies
DROP POLICY IF EXISTS "Tax returns are viewable by assigned user, client owner, or admin" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are insertable by admin or assigned user" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are updatable by assigned user or admin" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are deletable by admin" ON tax_returns;

-- Enable RLS
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

-- Create simple full access policy for all authenticated users
CREATE POLICY "Enable full access for authenticated users" ON tax_returns
FOR ALL USING (auth.role() = 'authenticated');

-- Commit transaction
COMMIT; 