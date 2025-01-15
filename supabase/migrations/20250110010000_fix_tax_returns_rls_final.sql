-- Begin transaction
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are viewable by assigned user or admin" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are insertable by admin" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are updatable by assigned user or admin" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are deletable by admin" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are viewable by assigned user or client owner" ON tax_returns;
DROP POLICY IF EXISTS "Tax returns are updatable by assigned user" ON tax_returns;

-- Enable RLS
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for tax returns
CREATE POLICY "Tax returns are viewable by assigned user or admin"
ON tax_returns FOR SELECT
USING (
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Tax returns are insertable by admin or assigned user"
ON tax_returns FOR INSERT
WITH CHECK (
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Tax returns are updatable by assigned user or admin"
ON tax_returns FOR UPDATE
USING (
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Tax returns are deletable by admin"
ON tax_returns FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tax_returns_status ON tax_returns(status);
CREATE INDEX IF NOT EXISTS idx_tax_returns_client_id ON tax_returns(client_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_assigned_to ON tax_returns(assigned_to);

-- Commit transaction
COMMIT; 