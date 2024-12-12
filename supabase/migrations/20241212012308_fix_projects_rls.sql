-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
DROP POLICY IF EXISTS "Users can insert projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;

-- Re-create policies for projects with proper permissions
CREATE POLICY "Enable read access for authenticated users"
ON projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON projects FOR DELETE
TO authenticated
USING (true);

-- Re-grant permissions explicitly
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT USAGE ON SEQUENCE projects_id_seq TO authenticated;