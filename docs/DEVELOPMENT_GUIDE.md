# Development Guide

This file summarizes all guidelines and best practices we've established, along with interview insights regarding how the firm wants to use the practice management tool.

---

## 1. Interviews & Requirements

### 1.1 End User Needs (CEO Perspective)

- **Simplicity**: Minimal friction to add notes, tasks, or project updates.
- **Automation**: Standardized workflows to reduce repetitive manual tasks.
- **Scalability**: Must handle large client/staff counts.
- **Role-Based Access**: Admin vs. team members; potential future expansions for more granular roles.
- **Integrations**:
  - **QuickBooks** for bookkeeping
  - **TaxSlayer** for tax returns
  - **Google Workspace** for file management
  - **Gmail** for client communication

### 1.2 AI & Automation Plans

- Automate detection of missing documents.
- Proactive reminders for deadlines or client follow-ups.
- Potential machine learning analytics on recurring tasks or project durations.

### 1.3 Future Steps

- Audit & refactor code to align with the new database schema.
- Implement advanced AI-driven functionalities.
- Evaluate row-level security (RLS) once roles/ACL are refined.

---

## 2. Coding & Contribution Rules

1. **Use Migrations**  
   - All schema changes go through timestamped migration files in `/migrations`.
   - Example: `YYYYMMDDHHmmss_add_new_table.sql`.
   - Avoid direct SQL changes in production.

2. **After Migrations**  
   - Run `supabase gen types typescript --local > src/types/database.types.ts`.
   - Commit the updated `database.types.ts` to version control.

3. **Pull Requests & Code Reviews**  
   - All changes related to schema or code must be reviewed by at least one developer.
   - Ensure linting, tests, and type checks pass before merging.

4. **Testing**  
   - Use local or staging environments with real data (sanitized if necessary).
   - Perform integration tests to confirm foreign key references, timestamps, and UI forms.

---

## 3. Codebase Organization

- **`/migrations`**: SQL migration files, sorted by timestamp.
- **`/docs`**: Documentation (this folder).
- **`/src`**: Application code (front-end, back-end).
  - **`/types`**: Contains `database.types.ts`.
- **`/scripts`**: Utility scripts for building, testing, or local dev tasks.

---

## 4. Database Schema Guidelines

1. **ID Usage**:  
   - All tables use string-based UUIDs for primary keys (`id: string`).
   - Foreign keys must reference UUIDs, not numeric IDs.
   - Example: `project_id: string references projects(id)`.

2. **Relational Structure**:  
   - Tasks have related items in separate tables:
     - `checklist_items`: Individual checklist entries for tasks
     - `activity_log_entries`: Task activity history
   - No JSON fields for structured data that can be normalized.

3. **Timestamps**:  
   - All tables include `created_at` and `updated_at`.
   - Use timestamptz for all date/time fields.

4. **Constraints**:  
   - Foreign keys must have appropriate ON DELETE actions.
   - Use enums for fixed-value columns (status, priority, etc.).

---

## 5. Next Development Milestones

1. **Enhance AI Features**:  
   - Implement document analysis for missing items.
   - Add predictive analytics for task completion.
   - Automate client communication based on status changes.

2. **Improve Workflow Automation**:  
   - Build templates for common task sequences.
   - Add smart task assignment based on workload.
   - Implement deadline prediction using historical data.

3. **Security & Performance**:  
   - Implement row-level security (RLS).
   - Add caching for frequently accessed data.
   - Optimize queries for large datasets.

4. **UI/UX Improvements**:  
   - Add bulk operations for tasks and projects.
   - Enhance filtering and search capabilities.
   - Improve mobile responsiveness.

---

## 6. Questions or Feedback?

Reach out in the dev channel or open a discussion issue if clarifications are needed.
