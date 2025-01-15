-- Begin transaction
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON tax_returns;

-- Enable RLS
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

-- Policy for viewing tax returns
-- Users can view tax returns if they:
-- 1. Are assigned to the tax return
-- 2. Are an admin
-- 3. Own the client that the tax return belongs to
CREATE POLICY "Tax returns are viewable by assigned user, client owner, or admin" 
ON tax_returns FOR SELECT
USING (
  auth.uid() = assigned_to 
  OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
  OR 
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_id 
    AND clients.owner_id = auth.uid()
  )
);

-- Policy for inserting tax returns
-- Only admins and assigned users can create tax returns
CREATE POLICY "Tax returns are insertable by admin or assigned user"
ON tax_returns FOR INSERT
WITH CHECK (
  auth.uid() = assigned_to
  OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy for updating tax returns
-- Users can update tax returns if they:
-- 1. Are assigned to the tax return
-- 2. Are an admin
CREATE POLICY "Tax returns are updatable by assigned user or admin"
ON tax_returns FOR UPDATE
USING (
  auth.uid() = assigned_to
  OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  auth.uid() = assigned_to
  OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy for deleting tax returns
-- Only admins can delete tax returns
CREATE POLICY "Tax returns are deletable by admin"
ON tax_returns FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tax_returns_status ON tax_returns(status);
CREATE INDEX IF NOT EXISTS idx_tax_returns_client_id ON tax_returns(client_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_assigned_to ON tax_returns(assigned_to);

-- Commit transaction
COMMIT; 