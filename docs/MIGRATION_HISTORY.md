# Migration History

This file briefly documents the main migrations and their rationale.

1. **`2025xxxxxx_convert_ids_to_uuid.sql`**  
   - Converted numeric IDs to UUID in tables: `tasks`, `projects`, `tax_returns`, etc.

2. **`2025xxxxxx_unify_task_status_enums.sql`**  
   - Ensured `task_status` and `project_status` use consistent enum definitions.

3. **`2025xxxxxx_remove_view_foreignkeys.sql`**  
   - Cleaned up foreign key references to views (switching them to table references).

4. **`2025xxxxxx_json_field_refinements.sql`**  
   - Moved JSON data from `tasks.checklist` / `tasks.activity_log` into new relational tables:
     - `checklist_items`
     - `activity_log_entries`

5. **`2025xxxxxx_more_uuid_conversions.sql`**  
   - Additional ID conversions in tables like `client_documents`, `owners`, etc.

---

**Ongoing**:  
- Always generate new migration files with a timestamp prefix.
- Reference this file to understand each migration’s goals.

