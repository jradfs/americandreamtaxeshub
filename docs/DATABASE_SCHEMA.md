# Database Schema Overview

Below is a high-level summary of our standardized schema. For full details, reference the generated `database.types.ts` file.

---

## 1. Core Tables

1. **clients**  
   - Stores primary client info (e.g., `company_name`, `email`, `full_name`, etc.).
   - `id` is a UUID (string).
   - `status` uses an enum `client_status`.

2. **projects**  
   - High-level project container; references `client_id`.
   - Fields like `due_date`, `priority`, `status`, `template_id`, etc.

3. **tasks**  
   - Represents tasks associated with a project.
   - Includes fields like `due_date`, `status`, `priority`.
   - `assigned_team` and `assignee_id` for assignment logic.

4. **activity_log_entries** / **checklist_items**  
   - Normalized from JSON fields that used to live in `tasks`.

5. **notes**, **notifications**, **owners**, **payroll_services**, etc.  
   - Additional business-related tables. Each has `created_at` and `updated_at` columns.

---

## 2. Enum Types

- **client_status**: `"active" | "inactive" | "pending" | "archived"`.
- **project_status**: `"not_started" | "on_hold" | "cancelled" | ... | "archived"`.
- **task_status**: `"todo" | "in_progress" | "review" | "completed"`.
- **user_role**: `"admin" | "team_member"`.

---

## 3. UUID Implementation

- All `id` columns in tables like `clients`, `projects`, `tasks`, etc. are of type `UUID` (represented as `string` in TypeScript).
- Foreign key relationships updated to reference these UUID columns.

---

## 4. Migration History

See [`docs/MIGRATION_HISTORY.md`](./MIGRATION_HISTORY.md) for a list of migrations and their purpose.

