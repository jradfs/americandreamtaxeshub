# Supabase Server MCP Tool - SQL Query Documentation

## Overview
This document provides comprehensive guidance for working with the Supabase database using SQL queries and custom functions through the MCP tool.

## Basic SQL Operations

### SELECT Queries
```sql
-- Basic SELECT
SELECT * FROM template_categories LIMIT 1;

-- Filtered SELECT with conditions
SELECT * FROM template_categories WHERE name LIKE 'Tax%';

-- Complex SELECT with joins
SELECT tc.*, pt.title as template_title 
FROM template_categories tc
LEFT JOIN project_templates pt ON pt.category_id = tc.id;
```

## Custom Functions

### Template Categories Management

1. Create Template Category
```sql
-- Create a new template category
SELECT create_template_category(
  'Tax Returns',
  'Templates for tax return processing'
);
-- Returns: UUID of the new category

-- Verify creation
SELECT * FROM template_categories WHERE name = 'Tax Returns';
```

2. Update Template Category
```sql
-- Update an existing category
SELECT update_template_category(
  '9916c0e4-8cc7-4a06-a625-c02f34060f46',  -- category UUID
  'Tax Returns 2024',                        -- new name
  'Updated description for tax templates'     -- new description
);
-- Returns: boolean indicating success

-- Verify update
SELECT * FROM template_categories 
WHERE id = '9916c0e4-8cc7-4a06-a625-c02f34060f46';
```

### General Data Management

1. Using insert_data Function
```sql
-- Insert single record
SELECT insert_data('template_categories', 
  '[{
    "name": "New Category",
    "description": "Category description"
  }]'
);

-- Insert multiple records
SELECT insert_data('template_categories', 
  '[
    {"name": "Category 1", "description": "Description 1"},
    {"name": "Category 2", "description": "Description 2"}
  ]'
);
```

2. Using execute_dml Function
```sql
-- Execute complex DML operations
SELECT execute_dml('
  UPDATE template_categories 
  SET updated_at = NOW() 
  WHERE name LIKE ''Tax%''
');
```

## Best Practices

1. Data Validation
   - Always check return values from functions
   - Verify data after insertions/updates
   - Use proper data types in JSON for insert_data

2. Error Handling
   - Functions will return NULL or false on failure
   - Check for existing records before updates
   - Use transactions for multiple operations

3. Performance
   - Use indexes for frequently queried columns
   - Batch operations when possible
   - Limit result sets appropriately

## Common Patterns

### Category Management Workflow
```sql
-- 1. Create new category
SELECT create_template_category('Tax Returns 2024', 'Description') as category_id;

-- 2. Update category if needed
SELECT update_template_category(category_id, 'New Name', 'New Description');

-- 3. Link to templates
SELECT execute_dml(format('
  UPDATE project_templates 
  SET category_id = %L 
  WHERE title LIKE ''Tax%''', 
  category_id
));
```

### Bulk Operations
```sql
-- Insert multiple categories
SELECT insert_data('template_categories', 
  '[
    {"name": "Personal Tax", "description": "Personal tax templates"},
    {"name": "Business Tax", "description": "Business tax templates"},
    {"name": "Payroll", "description": "Payroll processing templates"}
  ]'
);
```

## Function Reference

1. create_template_category
   - Parameters: name (text), description (text)
   - Returns: UUID
   - Purpose: Create new template category

2. update_template_category
   - Parameters: id (UUID), name (text), description (text)
   - Returns: boolean
   - Purpose: Update existing template category

3. insert_data
   - Parameters: target_table (text), data (jsonb)
   - Returns: text
   - Purpose: Generic data insertion

4. execute_dml
   - Parameters: dml_command (text)
   - Returns: text
   - Purpose: Execute custom DML operations

## Next Steps
1. Add delete functions for each entity
2. Implement transaction support
3. Add batch operation functions
4. Create reporting functions

## Notes
- All timestamps are handled automatically
- UUIDs are generated server-side
- RLS policies are enforced for all operations