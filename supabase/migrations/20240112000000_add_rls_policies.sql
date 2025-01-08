-- Enable RLS on tables
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for tax_returns: authenticated users can read all tax returns
CREATE POLICY "Enable read access for authenticated users"
ON tax_returns
FOR SELECT
TO authenticated
USING (true);

-- Policy for clients: authenticated users can read all clients
CREATE POLICY "Enable read access for authenticated users"
ON clients
FOR SELECT
TO authenticated
USING (true);

-- Policy for projects: authenticated users can read all projects
CREATE POLICY "Enable read access for authenticated users"
ON projects
FOR SELECT
TO authenticated
USING (true);

-- Policy for tasks: authenticated users can read all tasks
CREATE POLICY "Enable read access for authenticated users"
ON tasks
FOR SELECT
TO authenticated
USING (true); 