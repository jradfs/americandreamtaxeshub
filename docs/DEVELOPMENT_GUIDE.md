# Development Guide

This file summarizes all guidelines and best practices we’ve established, along with interview insights regarding how the firm wants to use the practice management tool.

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

## 4. Next Development Milestones

1. **Finalize UUID Usage**:  
   - Verify all references to IDs are updated (no leftover numeric type usage).
2. **Refactor Old JSON**:  
   - Remove references to old JSON fields replaced by `activity_log_entries`, `checklist_items`, etc.
3. **Implement Basic AI**:  
   - Possibly start with a feature to identify missing documents based on client status & `client_documents`.
4. **Plan RLS**:  
   - Outline role-based constraints to secure client data as the user base grows.

---

## 5. Questions or Feedback?

Reach out in the dev channel or open a discussion issue if clarifications are needed.
