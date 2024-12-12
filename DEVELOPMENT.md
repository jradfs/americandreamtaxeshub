# American Dream Taxes Hub - Development Guide

## System Overview
The American Dream Taxes Hub is a comprehensive practice management tool designed to streamline tax practice workflows and improve team efficiency. The system focuses on helping tax professionals and accountants manage various services including bookkeeping, tax returns, payroll processing, and business services.

## Core Features (Phase 1)

### 1. Smart Task Management System
- **Focus Now Dashboard**
  - Priority-based task display
  - Upcoming deadlines
  - Time-sensitive alerts
  - Quick action capabilities
  - Team workload overview

- **Smart Queue System**
  ```typescript
  interface SmartQueueConfig {
    priorityFactors: {
      dueDate: number;          // Weight: 0.4
      clientPriority: number;   // Weight: 0.2
      taskType: number;         // Weight: 0.2
      timeEstimate: number;     // Weight: 0.1
      dependencies: number;     // Weight: 0.1
    };
  }
  ```

### 2. Project Templates System

#### A. Bookkeeping Services
1. **Regular Monthly Bookkeeping**
   ```typescript
   interface MonthlyBookkeepingTemplate {
     tasks: [
       { name: "Download Bank Statements", estimatedTime: 30, priority: "High" },
       { name: "Process QB Transactions", estimatedTime: 180, priority: "High" },
       { name: "Reconcile Accounts", estimatedTime: 60, priority: "High" },
       { name: "Generate Reports", estimatedTime: 30, priority: "Medium" },
       { name: "Quality Review", estimatedTime: 30, priority: "High" }
     ];
     totalEstimatedTime: 330; // minutes
     defaultPriority: "High";
     recurringSchedule: "Monthly";
   }
   ```

2. **Cleanup Bookkeeping**
   ```typescript
   interface CleanupBookkeepingTemplate {
     tasks: [
       { name: "Initial Assessment", estimatedTime: 120 },
       { name: "Data Collection", estimatedTime: 240 },
       { name: "QB Setup/Review", estimatedTime: 180 },
       { name: "Historical Entry", estimatedTime: 480 },
       { name: "Reconciliation", estimatedTime: 240 },
       { name: "Final Review", estimatedTime: 120 }
     ];
     totalEstimatedTime: 1380; // minutes
     defaultPriority: "Medium";
   }
   ```

#### B. Tax Return Services
1. **Individual Tax Return**
   ```typescript
   interface IndividualTaxTemplate {
     tasks: [
       { name: "Document Collection", estimatedTime: 60 },
       { name: "Initial Review", estimatedTime: 30 },
       { name: "Tax Return Preparation", estimatedTime: 120 },
       { name: "Quality Review", estimatedTime: 45 },
       { name: "Client Review", estimatedTime: 30 }
     ];
     totalEstimatedTime: 285; // minutes
     seasonalPriority: {
       "Q1": "Critical",
       "Q2": "High",
       "Q3": "Medium",
       "Q4": "High"
     };
   }
   ```

2. **Business Tax Return**
   ```typescript
   interface BusinessTaxTemplate {
     tasks: [
       { name: "Document Collection", estimatedTime: 120 },
       { name: "Financial Review", estimatedTime: 180 },
       { name: "Tax Return Preparation", estimatedTime: 240 },
       { name: "Quality Review", estimatedTime: 90 },
       { name: "Client Review", estimatedTime: 60 }
     ];
     totalEstimatedTime: 690; // minutes
     variations: ["LLC", "S-Corp", "C-Corp", "Partnership"];
   }
   ```

#### C. Payroll Services
```typescript
interface PayrollTemplate {
  weeklyTasks: [
    { name: "Collect Time Data", deadline: "Monday 12PM" },
    { name: "Process Payroll", deadline: "Tuesday 12PM" },
    { name: "Generate Checks", deadline: "Wednesday 12PM" },
    { name: "Mail Checks", deadline: "Wednesday 3PM" }
  ];
  monthlyTasks: [
    { name: "Monthly Tax Deposits", deadline: "15th" },
    { name: "Monthly Reports", deadline: "Last Day" }
  ];
  quarterlyTasks: [
    { name: "Quarterly Returns", deadline: "Quarter End" }
  ];
  yearEndTasks: [
    { name: "W2 Preparation", deadline: "January 15th" },
    { name: "Annual Filings", deadline: "January 31st" }
  ];
}
```

### 3. Database Schema Updates

```sql
-- Project Templates
create type template_type as enum (
  'monthly_bookkeeping',
  'cleanup_bookkeeping',
  'individual_tax',
  'business_tax',
  'payroll',
  'business_formation',
  'irs_response'
);

create type priority_level as enum (
  'critical',
  'high',
  'medium',
  'low'
);

create type task_status as enum (
  'not_started',
  'in_progress',
  'review',
  'complete'
);

-- Base Templates
create table project_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type template_type not null,
  estimated_duration integer,
  default_priority priority_level default 'medium',
  is_recurring boolean default false,
  recurring_period text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Template Tasks
create table template_tasks (
  id uuid default uuid_generate_v4() primary key,
  template_id uuid references project_templates(id) on delete cascade,
  title text not null,
  description text,
  estimated_minutes integer not null,
  sequence_number integer not null,
  required_docs text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(template_id, sequence_number)
);

-- Active Projects
create table projects (
  id uuid default uuid_generate_v4() primary key,
  template_id uuid references project_templates(id),
  client_id uuid references clients(id),
  name text not null,
  status task_status default 'not_started',
  priority priority_level,
  start_date timestamptz,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Project Tasks
create table project_tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  template_task_id uuid references template_tasks(id),
  title text not null,
  description text,
  status task_status default 'not_started',
  assigned_to uuid references auth.users(id),
  estimated_minutes integer not null,
  actual_minutes integer,
  sequence_number integer not null,
  start_date timestamptz,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for Performance
create index idx_projects_client_id on projects(client_id);
create index idx_projects_template_id on projects(template_id);
create index idx_project_tasks_project_id on project_tasks(project_id);
create index idx_project_tasks_assigned_to on project_tasks(assigned_to);
create index idx_template_tasks_template_id on template_tasks(template_id);
```

### 4. Implementation Phases

#### Phase 1A: Foundation (Week 1-2)
1. **Database Setup**
   - Execute schema migrations
   - Set up database triggers for updated_at
   - Create initial template data

2. **Type Definitions**
   ```typescript
   // src/types/supabase.ts
   export interface Template {
     id: string;
     name: string;
     type: TemplateType;
     estimatedDuration: number;
     defaultPriority: PriorityLevel;
     isRecurring: boolean;
     recurringPeriod?: string;
   }

   export interface TemplateTask {
     id: string;
     templateId: string;
     title: string;
     description?: string;
     estimatedMinutes: number;
     sequenceNumber: number;
     requiredDocs?: string[];
   }
   ```

3. **Base Components**
   - Template selection interface
   - Project creation flow
   - Task assignment component

#### Phase 1B: Smart Features (Week 3-4)
1. **Enhanced Dashboard**
   - Priority calculation system
   - Time block suggestions
   - Deadline tracking

2. **Task Management**
   - Drag-and-drop task board
   - Quick actions
   - Time tracking

#### Phase 1C: Integration & Polish (Week 5-6)
1. **Template Management**
   - Template CRUD operations
   - Template task ordering
   - Template duplication

2. **Workflow Automation**
   - Automatic task creation
   - Deadline calculations
   - Priority adjustments

### 5. Component Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── FocusNowSection/
│   │   │   ├── index.tsx
│   │   │   ├── PriorityTasks.tsx
│   │   │   └── TimeBlockSuggestions.tsx
│   │   ├── SmartQueue/
│   │   │   ├── index.tsx
│   │   │   └── TaskPrioritization.tsx
│   │   └── TimeBlock/
│   │       ├── index.tsx
│   │       └── Schedule.tsx
│   ├── projects/
│   │   ├── templates/
│   │   │   ├── TemplateList.tsx
│   │   │   ├── TemplateForm.tsx
│   │   │   └── TemplateTask.tsx
│   │   └── active/
│   │       ├── ProjectBoard.tsx
│   │       ├── ProjectDetails.tsx
│   │       └── ProjectTimeline.tsx
│   └── tasks/
│       ├── TaskBoard/
│       │   ├── index.tsx
│       │   ├── Column.tsx
│       │   └── Card.tsx
│       └── TaskDetails/
│           ├── index.tsx
│           └── TimeTracking.tsx
```

### 6. Testing Strategy

1. **Unit Tests**
   ```typescript
   // Priority calculation tests
   describe('Task Prioritization', () => {
     it('should prioritize tasks with closer deadlines', () => {
       // Test implementation
     });
     
     it('should consider task dependencies', () => {
       // Test implementation
     });
   });
   ```

2. **Integration Tests**
   - Template creation flow
   - Project lifecycle
   - Task state management

3. **E2E Tests**
   - Critical user journeys
   - Data persistence
   - Real-time updates

### 7. Next Steps

1. **Immediate Actions**
   - [ ] Review and approve database schema
   - [ ] Set up development environment
   - [ ] Create initial project templates

2. **Development Kickoff**
   - [ ] Execute database migrations
   - [ ] Implement base components
   - [ ] Set up testing framework

3. **Team Coordination**
   - [ ] Daily standups
   - [ ] Code review process
   - [ ] Documentation updates

## Development Roadmap (Updated: December 2023)

Based on QA findings and core requirements, here is the prioritized development plan:

### Phase 1: Critical Infrastructure (Week 1)

#### Authentication & Core Database
- [ ] Set up complete database schema
  - Implement all tables defined in schema section
  - Add necessary indexes and constraints
- [ ] Implement proper session management
  - Add session persistence
  - Fix direct page access handling
- [ ] Authentication improvements
  - Add "Remember me" functionality
  - Implement password reset feature
- [ ] Fix user identification display
  - Replace user IDs with names throughout the application
  - Add proper user context management

### Phase 2: Template System (Week 2)

#### Project Templates Implementation
- [ ] Create template management interface
- [ ] Implement core templates:
  - Monthly Bookkeeping
  - Cleanup Bookkeeping
  - Individual Tax Return
  - Business Tax Return
  - Payroll Services
- [ ] Add template instantiation system
- [ ] Implement template task inheritance

### Phase 3: Task Management (Week 3)

#### Smart Queue and Task Features
- [ ] Implement Smart Queue System
  - Add priority-based task sorting
  - Implement workload balancing
  - Add deadline management
- [ ] Enhanced task management
  - Add time tracking
  - Implement task dependencies
  - Add task comments and discussions
- [ ] Task workflow improvements
  - Add status transitions
  - Implement approval flows
  - Add task history tracking

### Phase 4: Search & Organization (Week 4)

#### Global Search and Data Organization
- [ ] Implement global search functionality
  - Add client search
  - Add project search
  - Add task search
- [ ] Add advanced filtering
  - Status-based filtering
  - Date-based filtering
  - Priority-based filtering
- [ ] Implement data organization
  - Add pagination for all list views
  - Implement sorting capabilities
  - Add bulk actions for tasks and clients

### Success Criteria
- All critical QA findings addressed
- Core features implemented and tested
- Improved user experience with proper session management
- Complete template system operational
- Smart Queue System managing task prioritization effectively
- Comprehensive search and filter capabilities across all sections

### Next Steps
After completing these phases, we will:
1. Conduct comprehensive testing
2. Gather user feedback
3. Plan Phase 2 features based on user needs
4. Consider additional automation opportunities
