-- Temporarily make policies more permissive
BEGIN;

-- Drop the restrictive policies
DROP POLICY IF EXISTS "Enable read for assigned tasks" ON tasks;
DROP POLICY IF EXISTS "Enable update for assigned tasks" ON tasks;
DROP POLICY IF EXISTS "Enable delete for assigned tasks" ON tasks;

-- Create more permissive policies for development
CREATE POLICY "Enable read for all authenticated users"
    ON tasks FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for all authenticated users"
    ON tasks FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for all authenticated users"
    ON tasks FOR DELETE
    USING (auth.role() = 'authenticated');

COMMIT;
