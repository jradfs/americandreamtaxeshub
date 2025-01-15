```md
# Phase 1: American Dream Taxes Hub – Detailed Vision Document

> **Important Note**  
> This document is derived from our initial consultation and architecture discussions for creating an all-in-one tax practice management application, with a strong focus on streamlined task management, form consistency, type safety, and AI-assisted workflows. It aims to describe the **vision**, **requirements**, and **user experience** for Phase 1 in a clear, non-technical manner.

---

## 1. End Users & Their Needs

### 1.1. Primary Users

1. **Tax Preparers**  
   - Prepare tax returns for individuals and businesses.  
   - Need to manage multiple client documents, tasks, and deadlines.
   
2. **Admin Staff**  
   - Handle new client onboarding (gathering data, ensuring proper documentation).  
   - Often coordinate tasks among the preparers and managers.
   
3. **Managers**  
   - Oversee all active projects and tasks.  
   - Need visibility into deadlines, staff workloads, and progress metrics.

### 1.2. Daily Workflows

- **Tax Preparers**: 
  - Start the day reviewing assigned tasks in a Task List.  
  - Check for new client documents.  
  - Prepare and update tax returns.  
  - Mark tasks as completed or request manager review.
  
- **Admin Staff**: 
  - Onboard new clients by entering details, scanning documents, and creating the initial tasks.  
  - Keep track of document requests and ensure compliance.  
  - Update deadlines and reminders if new info arises.
  
- **Managers**: 
  - Review overall pipeline in a dashboard (number of returns in-progress, overdue tasks, etc.).  
  - Reassign tasks if certain preparers are overloaded.  
  - Approve tasks or returns that are pending manager review.

### 1.3. Biggest Pain Points

- Manually tracking deadlines using spreadsheets or external calendars.  
- Unclear status of a client’s tax return or missing documents.  
- Inconsistent approaches to receiving and storing documents.  
- Limited visibility into which tasks are blocking progress.

### 1.4. Desired Efficiency Boosts

- A **single interface** to view urgent tasks, client status, next deadlines.  
- Automated reminders and notifications to ensure no deadlines slip.  
- Quick assignment and re-assignment of tasks with real-time updates.  
- AI-driven suggestions for missing forms or potential next steps.

---

## 2. Core Features & User Experience

### 2.1. Client Onboarding

- **New Client Wizard**:  
  - Guides Admin Staff through capturing client’s basic info (name, company, tax ID).  
  - Creates initial tasks, such as “Request prior-year returns,” “Collect W-2/1099 forms.”

- **AI Suggestions** (Optional in Phase 1 but planned):  
  - GPT-based classification of the client’s situation (individual vs. business).  
  - Recommends standard tasks (e.g., document checklists) based on client type.

### 2.2. Task Tracking & Assignments

- **Task List**:  
  - Each user sees a prioritized list of tasks for the day/week.  
  - Tasks have statuses (`todo`, `in_progress`, `review`, `completed`) and priorities (`low`, `medium`, `high`, `urgent`).
- **Assignments**:  
  - Managers can reassign tasks from one staff member to another.  
  - Admin staff can create tasks and assign them to Tax Preparers.

### 2.3. Deadline Management

- **Due Dates** at the project, client, or task level.  
- Automatic or manual reminders (e.g., a daily email of tasks due soon).  
- **Overdue Indicators**: tasks and returns appear in red if past their due date.

### 2.4. Collaboration & Document Handling

- **Comments or Notes** on tasks, e.g., “Need client’s signature.”  
- **Document Uploads**: store scanned forms, prior returns, etc.  
- Basic versioning: show who uploaded the doc and when.

### 2.5. Notifications/Reminders

- Email or in-app alerts:
  - “A new client onboarding form was completed—review required.”  
  - “Task X is due tomorrow—please finalize.”  
- Optionally, push notifications in the future for mobile usage.

### 2.6. Daily/Weekly Task Overviews

- Summaries of upcoming deadlines, blocked tasks, or tasks awaiting your input.  
- Filter tasks by status, user, or due date.

---

## 3. Page-by-Page Breakdown

### 3.1. **Dashboard**

- **Overview**: Quick summary of active clients, number of tasks due this week, and potential overdue items.  
- **Key Metrics**: 
  - “Active Projects,” “Pending Tax Returns,” “Upcoming Deadlines.”  
- **Shortcuts**: “Add New Client,” “Create New Task,” “View Overdue Items.”

### 3.2. **Clients Page**

- **Client List**: 
  - Table with client name, type (individual/business), contact info, status.  
  - Filters for active/inactive/pending clients.
- **Actions**: 
  - “View Client Details,” “Edit Info,” “Create New Project for this Client.”
- **Onboarding Status**:  
  - Label or progress bar showing how far along the client’s initial setup is.

### 3.3. **Projects Page**

- **Project List**: 
  - Each row shows project name (e.g., “2023 Tax Return for John Smith”), due date, status.  
  - Optionally link to client’s info.
- **Actions**: 
  - “View Tasks,” “Add Task,” “Assign Team Members.”

### 3.4. **Tasks Page** (or within Projects)

- **Task Board / List**:
  - Kanban or simple list with statuses.  
  - Filters by assigned user, due date, status.
- **Quick Edit**:
  - Right-click or inline editing to change status, priority, or assignee.

### 3.5. **Document Management**

- Possibly integrated into each project or client details page.  
- **Upload/Download** files.  
- **Preview** certain doc types (PDF, images).  
- **Checklists** for required documents.

### 3.6. **Notifications/Reminders Page** (Optional)

- List of triggered alerts.  
- Mark notifications as read.  
- Resend or skip certain reminders.

---

## 4. Data Structure & Relationships

### 4.1. Database Tables

1. **Clients**  
   - `id`, `full_name`, `company_name`, `status`, `email`, etc.  
   - Potential fields for phone, address, type (`business`, `individual`), and more.

2. **Projects**  
   - `id`, `client_id`, `name`, `status`, `service_type`, `due_date`, `priority`.  
   - Relationship: `client_id → Clients.id`.

3. **Tasks**  
   - `id`, `project_id`, `title`, `description`, `status`, `priority`, `assignee_id`, `due_date`.  
   - Relationship: `project_id → Projects.id`.  
   - Relationship: `assignee_id → Users.id`.

4. **Users**  
   - `id`, `full_name`, `role` (admin, preparer, manager).  
   - Could store email, phone, etc.

5. **Documents**  
   - `id`, `project_id`, `client_id`, `file_path`, `uploaded_at`, `category`.  
   - Relationship: optional `project_id → Projects.id` or `client_id → Clients.id`.

6. **Activity Log**  
   - `id`, `task_id`, `action`, `details (JSON)`, `performed_by`, `created_at`.  
   - Relationship: `task_id → Tasks.id`.

### 4.2. Required Validations

- **Tasks**: 
  - `title` must not be empty.  
  - `status` must be one of the enumerated values (`todo`, `in_progress`, etc.).
- **Clients**: 
  - `full_name` or `company_name` must exist.  
  - Email in valid format if provided.
- **Projects**: 
  - `name` required, must reference a valid `client_id`.  
  - `service_type` (tax_return, bookkeeping, etc.).

### 4.3. Access Patterns

- Common queries:
  - “Find tasks assigned to me.”  
  - “Show all tasks for project X.”  
  - “List all active clients or all archived clients.”

---

## 5. Workflows & Processes

### 5.1. New Client Onboarding

1. **Admin Staff** clicks “Add New Client.”  
2. Fills out basic info: name, contact details, type.  
3. System automatically creates an Onboarding Project with tasks: “Collect prior returns,” “Gather personal details,” etc.  
4. Admin staff assigns tasks to appropriate Tax Preparers.  
5. Tax Preparers update tasks as completed, manager sees progress in real time.

### 5.2. Tax Return Lifecycle

1. **Project** created: e.g., “2023 Return for John Smith.”  
2. **Tasks**: “Data entry,” “Verify forms,” “Manager review,” “File return.”  
3. As tasks are checked off, the status moves from `todo` → `in_progress` → `review` → `completed`.  
4. **Document** uploads happen at various steps (W-2, 1099, prior returns).

### 5.3. Document Collection

1. The system notifies the client to upload docs or staff scans them into the system.  
2. Documents get linked to the relevant client and project.  
3. Admin staff checks off each required doc in a “Document Checklist” task.

### 5.4. Review & Approval

1. Once tasks reach `review` status, a manager is notified.  
2. Manager checks for correctness, either sets `completed` or reverts the task to `in_progress`.  
3. Final sign-off triggers a “Return ready to e-file” state.

### 5.5. Client Communication

- Phase 1 might only contain internal staff communications.  
- Future expansions could incorporate a client portal, direct messages, etc.

### 5.6. Task Assignment & Deadline Management

- If a task is near or past its due date, the system highlights it in red.  
- Manager can update the due date or reassign the task if staff is overloaded.

---

## 6. Dashboard & Analytics

### 6.1. Metrics to Track

1. **Number of Active Clients** (active vs. inactive).  
2. **Number of Tax Returns in Progress** (by status).  
3. **Upcoming Deadlines** (tasks due in next 7 days).  
4. **Completion Percentage** for each project (ratio of completed tasks).

### 6.2. Charts & Graphs

- **Bar Chart**: tasks completed per day/week.  
- **Pie Chart**: distribution of tasks by status (todo, in_progress, review, completed).  
- **Line Chart**: revenue over time or number of new clients per month (in future phases).

### 6.3. Information Organization

- Summaries: “Overdue Tasks,” “Due This Week,” “In Review.”  
- Possibly a single “Focus Now” area to show the highest-priority tasks or blockers.

### 6.4. Alerts & Customization

- Alerts for tasks overdue or tasks waiting on manager review.  
- Possibly let managers customize the dashboard to see only team members’ tasks or a specific date range.

---

## 7. AI Integration Points

> Although Phase 1 might only partially include AI, we plan for future expansions where GPT-based logic can assist staff.

### 7.1. Potential AI Use Cases

1. **Data Entry Suggestions**  
   - When inputting new client info, AI auto-fills standard forms based on minimal input.  
2. **Document Classification**  
   - Automatically label or categorize uploaded documents (e.g., “This is a W-2,” “This is a 1099”).  
3. **Task Automation**  
   - When a new client type is set to “S Corporation,” the system automatically creates recommended tasks.  
4. **Deadline Reminders / Nudges**  
   - AI might look at historical patterns and remind staff if a certain step is typically late.

### 7.2. Client Communication

- GPT-based templates for emails like “Request for Additional Documents.”  
- Summaries of client questions to speed up response time.

### 7.3. Decision Support

- Over time, the system might recommend “This client likely needs an extension” or “Based on prior-year data, watch for additional forms.”

---

## 8. Mobile / Responsive Considerations

### 8.1. Critical Features on Mobile

- **Task List**: Tax Preparers or Admin staff can see tasks on the go.  
- **Notifications**: Quick push notifications for urgent deadlines.  
- **Document Upload** (camera-based scanning in future phases).

### 8.2. Layout Adaptations

- Single-column approach on phones.  
- Collapsible sidebars for navigation.  
- Larger “touch targets” for Mark Complete or reassign tasks.

### 8.3. Mobile-First Workflow

- Access daily tasks from phone while traveling or meeting with clients.  
- Add notes or attach a quick photo of a doc.  
- Real-time sync with the main system.

---

## Conclusion & Next Steps

This **Phase 1 Detailed Vision** outlines how the American Dream Taxes Hub application should serve the needs of tax preparers, admin staff, and managers. By focusing on:

1. **Clear data structures** and type safety.  
2. **Unified state management** with consistent forms.  
3. **Straightforward, user-friendly pages** for tasks, clients, and projects.  
4. **AI Integration** planned for future expansions.  
5. **Responsive design** for essential mobile workflows.

We ensure a robust foundation that can **scale** to a large user base and help achieve the **$100M revenue** goal by **optimizing daily operations**, **reducing errors**, and **delivering a top-notch user experience**.

**Next Steps**:  
1. Implement the consolidated data models in Supabase.  
2. Create the Next.js + TypeScript scaffolding for page-level architecture.  
3. Integrate React Hook Form + Zod for consistent validation.  
4. Begin building the Task Management workflow with an emphasis on **optimistic updates** and strong error handling.  
5. Gradually incorporate AI-driven suggestions for classification and automation.

---  

**End of Document**  

```
