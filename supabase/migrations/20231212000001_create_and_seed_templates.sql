-- Create project_templates table
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    default_priority TEXT NOT NULL,
    estimated_total_minutes INTEGER NOT NULL,
    recurring_schedule TEXT NOT NULL,
    seasonal_priority JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create template_tasks table
CREATE TABLE IF NOT EXISTS template_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    estimated_minutes INTEGER NOT NULL,
    priority TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    dependencies UUID[] DEFAULT ARRAY[]::UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_template_tasks_template_id ON template_tasks(template_id);
CREATE INDEX IF NOT EXISTS idx_project_templates_category ON project_templates(category);

-- Add RLS policies
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for project_templates
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'project_templates' 
        AND policyname = 'Enable read access for authenticated users'
    ) THEN
        CREATE POLICY "Enable read access for authenticated users" ON project_templates
            FOR SELECT TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'project_templates' 
        AND policyname = 'Enable insert access for authenticated users'
    ) THEN
        CREATE POLICY "Enable insert access for authenticated users" ON project_templates
            FOR INSERT TO authenticated WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'project_templates' 
        AND policyname = 'Enable update access for authenticated users'
    ) THEN
        CREATE POLICY "Enable update access for authenticated users" ON project_templates
            FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'project_templates' 
        AND policyname = 'Enable delete access for authenticated users'
    ) THEN
        CREATE POLICY "Enable delete access for authenticated users" ON project_templates
            FOR DELETE TO authenticated USING (true);
    END IF;
END $$;

-- Create policies for template_tasks
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'template_tasks' 
        AND policyname = 'Enable read access for authenticated users'
    ) THEN
        CREATE POLICY "Enable read access for authenticated users" ON template_tasks
            FOR SELECT TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'template_tasks' 
        AND policyname = 'Enable insert access for authenticated users'
    ) THEN
        CREATE POLICY "Enable insert access for authenticated users" ON template_tasks
            FOR INSERT TO authenticated WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'template_tasks' 
        AND policyname = 'Enable update access for authenticated users'
    ) THEN
        CREATE POLICY "Enable update access for authenticated users" ON template_tasks
            FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'template_tasks' 
        AND policyname = 'Enable delete access for authenticated users'
    ) THEN
        CREATE POLICY "Enable delete access for authenticated users" ON template_tasks
            FOR DELETE TO authenticated USING (true);
    END IF;
END $$;

-- Seed initial project templates and their tasks

-- Monthly Bookkeeping Template
WITH monthly_bookkeeping AS (
  INSERT INTO project_templates (title, description, category, default_priority, estimated_total_minutes, recurring_schedule, seasonal_priority)
  VALUES (
    'Regular Monthly Bookkeeping',
    'Standard monthly bookkeeping process including bank reconciliation and financial reporting',
    'bookkeeping',
    'high',
    330,
    'monthly',
    '{"Q1": "high", "Q2": "medium", "Q3": "medium", "Q4": "high"}'::jsonb
  )
  RETURNING id
)
INSERT INTO template_tasks (template_id, title, description, estimated_minutes, priority, order_index)
SELECT id, title, description, estimated_minutes, priority, order_index
FROM monthly_bookkeeping,
(VALUES 
  ('Download Bank Statements', 'Download latest bank statements from all accounts', 30, 'high', 0),
  ('Process QB Transactions', 'Categorize and process all QuickBooks transactions', 180, 'high', 1),
  ('Reconcile Accounts', 'Reconcile all bank and credit card accounts', 60, 'high', 2),
  ('Generate Reports', 'Generate monthly P&L and Balance Sheet', 30, 'medium', 3),
  ('Quality Review', 'Review all work for accuracy and completeness', 30, 'high', 4)
) AS tasks(title, description, estimated_minutes, priority, order_index);

-- Cleanup Bookkeeping Template
WITH cleanup_bookkeeping AS (
  INSERT INTO project_templates (title, description, category, default_priority, estimated_total_minutes, recurring_schedule, seasonal_priority)
  VALUES (
    'Cleanup Bookkeeping',
    'Complete bookkeeping cleanup and catch-up for past periods',
    'bookkeeping',
    'medium',
    1380,
    'one-time',
    '{"Q1": "medium", "Q2": "medium", "Q3": "medium", "Q4": "medium"}'::jsonb
  )
  RETURNING id
)
INSERT INTO template_tasks (template_id, title, description, estimated_minutes, priority, order_index)
SELECT id, title, description, estimated_minutes, priority, order_index
FROM cleanup_bookkeeping,
(VALUES 
  ('Initial Assessment', 'Review current books and identify issues', 120, 'high', 0),
  ('Data Collection', 'Gather all necessary statements and documents', 240, 'high', 1),
  ('QB Setup/Review', 'Set up or review QuickBooks file structure', 180, 'high', 2),
  ('Historical Entry', 'Enter historical transactions and adjustments', 480, 'medium', 3),
  ('Reconciliation', 'Reconcile all accounts for cleanup period', 240, 'high', 4),
  ('Final Review', 'Final review and verification of cleanup work', 120, 'high', 5)
) AS tasks(title, description, estimated_minutes, priority, order_index);

-- Individual Tax Return Template
WITH individual_tax AS (
  INSERT INTO project_templates (title, description, category, default_priority, estimated_total_minutes, recurring_schedule, seasonal_priority)
  VALUES (
    'Individual Tax Return',
    'Complete individual tax return preparation process',
    'tax-return',
    'high',
    285,
    'annually',
    '{"Q1": "critical", "Q2": "high", "Q3": "medium", "Q4": "high"}'::jsonb
  )
  RETURNING id
)
INSERT INTO template_tasks (template_id, title, description, estimated_minutes, priority, order_index)
SELECT id, title, description, estimated_minutes, priority, order_index
FROM individual_tax,
(VALUES 
  ('Document Collection', 'Collect and organize all tax documents', 60, 'high', 0),
  ('Initial Review', 'Review prior year return and current documents', 30, 'high', 1),
  ('Tax Return Preparation', 'Prepare current year tax return', 120, 'high', 2),
  ('Quality Review', 'Complete quality review checklist', 45, 'high', 3),
  ('Client Review', 'Review completed return with client', 30, 'high', 4)
) AS tasks(title, description, estimated_minutes, priority, order_index);

-- Business Tax Return Template
WITH business_tax AS (
  INSERT INTO project_templates (title, description, category, default_priority, estimated_total_minutes, recurring_schedule, seasonal_priority)
  VALUES (
    'Business Tax Return',
    'Complete business tax return preparation process',
    'tax-return',
    'high',
    690,
    'annually',
    '{"Q1": "critical", "Q2": "high", "Q3": "medium", "Q4": "high"}'::jsonb
  )
  RETURNING id
)
INSERT INTO template_tasks (template_id, title, description, estimated_minutes, priority, order_index)
SELECT id, title, description, estimated_minutes, priority, order_index
FROM business_tax,
(VALUES 
  ('Document Collection', 'Collect and organize all business documents', 120, 'high', 0),
  ('Financial Review', 'Review financial statements and adjustments', 180, 'high', 1),
  ('Tax Return Preparation', 'Prepare business tax return', 240, 'high', 2),
  ('Quality Review', 'Complete quality review process', 90, 'high', 3),
  ('Client Review', 'Review completed return with client', 60, 'high', 4)
) AS tasks(title, description, estimated_minutes, priority, order_index);

-- Payroll Setup Template
WITH payroll_setup AS (
  INSERT INTO project_templates (title, description, category, default_priority, estimated_total_minutes, recurring_schedule, seasonal_priority)
  VALUES (
    'Payroll Setup',
    'Complete payroll system setup and configuration',
    'payroll',
    'high',
    420,
    'one-time',
    '{"Q1": "high", "Q2": "high", "Q3": "high", "Q4": "high"}'::jsonb
  )
  RETURNING id
)
INSERT INTO template_tasks (template_id, title, description, estimated_minutes, priority, order_index)
SELECT id, title, description, estimated_minutes, priority, order_index
FROM payroll_setup,
(VALUES 
  ('Initial Setup', 'Gather company and employee information', 60, 'high', 0),
  ('System Configuration', 'Configure payroll system settings', 120, 'high', 1),
  ('Employee Setup', 'Set up employee profiles and tax information', 120, 'high', 2),
  ('Testing', 'Run test payroll and verify calculations', 60, 'high', 3),
  ('Training', 'Train client on payroll system usage', 60, 'medium', 4)
) AS tasks(title, description, estimated_minutes, priority, order_index);
