-- Add sample project templates and tasks
BEGIN;

-- Insert project templates
INSERT INTO project_templates (id, title, category, description, default_priority, estimated_total_minutes, recurring_schedule)
VALUES 
  (gen_random_uuid(), 'Annual Tax Return', 'tax_preparation', 'Complete annual tax return process including gathering documents, reviewing financials, and filing', 'high', 480, 'yearly'),
  (gen_random_uuid(), 'Quarterly Tax Planning', 'tax_planning', 'Review and plan quarterly tax strategies and estimated payments', 'medium', 240, 'quarterly'),
  (gen_random_uuid(), 'Monthly Bookkeeping', 'bookkeeping', 'Monthly reconciliation and financial statement preparation', 'medium', 180, 'monthly');

-- Insert sample projects
INSERT INTO projects (id, name, description, status, priority)
VALUES 
  (gen_random_uuid(), '2023 Tax Returns', 'Annual tax return preparation for 2023', 'in_progress', 'high'),
  (gen_random_uuid(), 'Q4 2023 Planning', 'End of year tax planning and strategy', 'todo', 'medium'),
  (gen_random_uuid(), 'December Bookkeeping', 'Monthly bookkeeping for December 2023', 'todo', 'medium');

-- Get the project IDs for the tasks
WITH project_ids AS (
  SELECT id FROM projects ORDER BY created_at DESC LIMIT 3
)
-- Insert tasks for each project
INSERT INTO tasks (id, title, description, status, priority, due_date, project_id)
SELECT 
  gen_random_uuid(),
  title,
  description,
  status,
  priority,
  (due_date || ' 00:00:00+00')::timestamptz,
  project_id
FROM (
  SELECT 
    'Gather W-2s and 1099s' as title,
    'Collect all income documents from clients' as description,
    'todo' as status,
    'high' as priority,
    '2024-01-31' as due_date,
    (SELECT id FROM project_ids LIMIT 1 OFFSET 0) as project_id
  UNION ALL
  SELECT 
    'Review Business Expenses',
    'Analyze and categorize business expenses',
    'todo',
    'medium',
    '2024-01-15',
    (SELECT id FROM project_ids LIMIT 1 OFFSET 0)
  UNION ALL
  SELECT 
    'Calculate Q4 Estimated Payments',
    'Determine Q4 estimated tax payments for clients',
    'in_progress',
    'high',
    '2023-12-15',
    (SELECT id FROM project_ids LIMIT 1 OFFSET 1)
  UNION ALL
  SELECT 
    'Review Tax Law Changes',
    'Document and analyze recent tax law changes',
    'todo',
    'medium',
    '2023-12-20',
    (SELECT id FROM project_ids LIMIT 1 OFFSET 1)
  UNION ALL
  SELECT 
    'Reconcile Bank Statements',
    'Reconcile December bank and credit card statements',
    'todo',
    'medium',
    '2024-01-05',
    (SELECT id FROM project_ids LIMIT 1 OFFSET 2)
  UNION ALL
  SELECT 
    'Prepare Financial Statements',
    'Generate December P&L and Balance Sheet',
    'todo',
    'high',
    '2024-01-10',
    (SELECT id FROM project_ids LIMIT 1 OFFSET 2)
) t;

COMMIT;
