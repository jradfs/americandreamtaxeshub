# Database Schema Documentation

## Tables Overview

### clients
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  company_name TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'active',
  type TEXT,
  tax_info JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id)
);
```

### tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  template_id UUID,
  project_id UUID,
  assignee_id UUID,
  tax_return_id UUID,
  parent_task_id UUID,
  tax_form_type TEXT,
  activity_log JSONB DEFAULT '[]',
  checklist JSONB DEFAULT '[]',
  recurring_config JSONB DEFAULT '{}'
);
```

### templates
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  estimated_hours INTEGER,
  checklist JSONB DEFAULT '[]',
  task_config JSONB DEFAULT '{}'
);
```

## JSONB Fields

### clients.tax_info
```json
{
  "tax_id": "string",
  "filing_status": "string",
  "tax_year": "number",
  "previous_returns": []
}
```

### clients.contact_info
```json
{
  "phone": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string"
}
```

### tasks.activity_log
```json
[
  {
    "timestamp": "datetime",
    "action": "string",
    "user_id": "uuid",
    "details": {}
  }
]
```

### tasks.checklist
```json
[
  {
    "id": "uuid",
    "title": "string",
    "completed": "boolean",
    "due_date": "datetime"
  }
]
```

## Relationships

### Tasks
- `template_id` → templates.id
- `project_id` → projects.id
- `assignee_id` → auth.users.id
- `parent_task_id` → tasks.id (self-reference)

### Clients
- `user_id` → auth.users.id

## Indexes

### clients
```sql
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
```

### tasks
```sql
CREATE INDEX idx_tasks_template_id ON tasks(template_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

## Row Level Security (RLS)

### clients
```sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);
```

### tasks
```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assigned tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = assignee_id);
```