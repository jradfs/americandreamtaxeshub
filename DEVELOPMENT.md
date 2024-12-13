# American Dream Taxes Hub - Development Guide

## System Overview
The American Dream Taxes Hub is a comprehensive practice management tool designed to streamline tax practice workflows and improve team efficiency. The system focuses on helping tax professionals and accountants manage various services including bookkeeping, tax returns, payroll processing, and business services through a unified, Motion-inspired interface.

## Core Features (Phase 1)

### 1. Unified Task & Project Management
- **Main View Structure**
  ```typescript
  interface UnifiedViewConfig {
    grouping: {
      type: "Stage" | "Status" | "Task";
      sections: {
        strategy: TaskSection;
        design: TaskSection;
        implementation: TaskSection;
      };
      filters: {
        showScheduledOnly: boolean;
        showCompleted: boolean;
        priority: Priority[];
        assignee: string[];
      };
    };
    workspaces: Workspace[];
  }

  interface TaskSection {
    todo: Task[];
    complete: Task[];
    metadata: {
      totalDuration: number;
      completionRate: number;
      assignees: string[];
    };
  }

  interface Workspace {
    id: string;
    name: string;
    projects: Project[];
    tasks: Task[];
    clientId?: string;
    settings: {
      defaultView: "list" | "kanban" | "gantt";
      defaultGrouping: "Stage" | "Status" | "Task";
    };
  }
  ```

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
    queueSettings: {
      refreshInterval: number;  // How often to recalculate priorities
      maxItems: number;        // Maximum items in smart queue
      autoSchedule: boolean;   // Automatically schedule tasks based on priority
    };
  }
  ```

### 2. Enhanced Task Management
- **Task Structure**
  ```typescript
  interface Task {
    id: string;
    name: string;
    section: "strategy" | "design" | "implementation";
    status: "todo" | "complete";
    priority: "high" | "medium" | "low";
    duration: number;
    assignee: string[];
    dependencies: string[];
    deadline?: Date;
    labels: string[];
    clientId?: string;
  }
  ```

### 2. Project Templates System

#### A. Bookkeeping Services
1. **Regular Monthly Bookkeeping**
   ```typescript
   interface MonthlyBookkeepingTemplate {
     sections: {
       strategy: [
         { name: "Review Previous Month", estimatedTime: 30, priority: "High" },
         { name: "Plan Adjustments", estimatedTime: 30, priority: "High" }
       ],
       implementation: [
         { name: "Download Bank Statements", estimatedTime: 30, priority: "High" },
         { name: "Process QB Transactions", estimatedTime: 180, priority: "High" },
         { name: "Reconcile Accounts", estimatedTime: 60, priority: "High" },
         { name: "Generate Reports", estimatedTime: 30, priority: "Medium" }
       ],
       review: [
         { name: "Quality Review", estimatedTime: 30, priority: "High" }
       ]
     };
     totalEstimatedTime: 330; // minutes
     defaultPriority: "High";
     recurringSchedule: "Monthly";
   }
   ```

2. **Cleanup Bookkeeping**
   ```typescript
   interface CleanupBookkeepingTemplate {
     sections: {
       strategy: [
         { name: "Initial Assessment", estimatedTime: 120 },
         { name: "Data Collection", estimatedTime: 240 }
       ],
       implementation: [
         { name: "QB Setup/Review", estimatedTime: 180 },
         { name: "Historical Entry", estimatedTime: 480 },
         { name: "Reconciliation", estimatedTime: 240 }
       ],
       review: [
         { name: "Final Review", estimatedTime: 120 }
       ]
     };
     totalEstimatedTime: 1380; // minutes
     defaultPriority: "Medium";
   }
   ```

#### B. Tax Return Services
1. **Individual Tax Return**
   ```typescript
   interface IndividualTaxTemplate {
     sections: {
       strategy: [
         { name: "Document Collection", estimatedTime: 60 },
         { name: "Initial Review", estimatedTime: 30 }
       ],
       implementation: [
         { name: "Tax Return Preparation", estimatedTime: 120 }
       ],
       review: [
         { name: "Quality Review", estimatedTime: 45 },
         { name: "Client Review", estimatedTime: 30 }
       ]
     };
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
     sections: {
       strategy: [
         { name: "Document Collection", estimatedTime: 120 },
         { name: "Financial Review", estimatedTime: 180 }
       ],
       implementation: [
         { name: "Tax Return Preparation", estimatedTime: 240 }
       ],
       review: [
         { name: "Quality Review", estimatedTime: 90 },
         { name: "Client Review", estimatedTime: 60 }
       ]
     };
     totalEstimatedTime: 690; // minutes
     variations: ["LLC", "S-Corp", "C-Corp", "Partnership"];
   }
   ```

#### C. Payroll Services
```typescript
interface PayrollTemplate {
  sections: {
    weekly: [
      { name: "Collect Time Data", deadline: "Monday 12PM" },
      { name: "Process Payroll", deadline: "Tuesday 12PM" },
      { name: "Generate Checks", deadline: "Wednesday 12PM" },
      { name: "Mail Checks", deadline: "Wednesday 3PM" }
    ],
    monthly: [
      { name: "Monthly Tax Deposits", deadline: "15th" },
      { name: "Monthly Reports", deadline: "Last Day" }
    ],
    quarterly: [
      { name: "Quarterly Returns", deadline: "Quarter End" }
    ],
    yearEnd: [
      { name: "W2 Preparation", deadline: "January 15th" },
      { name: "Annual Filings", deadline: "January 31st" }
    ]
  }
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

create type section_type as enum (
  'strategy',
  'design',
  'implementation',
  'review'
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
  section section_type not null,
  title text not null,
  description text,
  estimated_minutes integer not null,
  sequence_number integer not null,
  required_docs text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(template_id, section, sequence_number)
);

-- Active Projects
create table projects (
  id uuid default uuid_generate_v4() primary key,
  template_id uuid references project_templates(id),
  client_id uuid references clients(id),
  workspace_id uuid references workspaces(id),
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
  section section_type not null,
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

-- Workspaces
create table workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for Performance
create index idx_projects_client_id on projects(client_id);
create index idx_projects_template_id on projects(template_id);
create index idx_projects_workspace_id on projects(workspace_id);
create index idx_project_tasks_project_id on project_tasks(project_id);
create index idx_project_tasks_assigned_to on project_tasks(assigned_to);
create index idx_template_tasks_template_id on template_tasks(template_id);
```

### 4. Implementation Phases

#### Phase 1A: Foundation (Week 1-2)
1. **Unified View Setup**
   - Implement workspace structure
   - Create section-based task organization
   - Set up grouping and filtering system

2. **Database Setup**
   - Execute schema migrations
   - Set up database triggers for updated_at
   - Create initial template data

3. **Type Definitions**
   ```typescript
   // src/types/supabase.ts
   export interface Template {
     id: string;
     name: string;
     type: TemplateType;
     sections: Section[];
     estimatedDuration: number;
     defaultPriority: PriorityLevel;
     isRecurring: boolean;
     recurringPeriod?: string;
   }

   export interface Section {
     type: SectionType;
     tasks: TemplateTask[];
   }

   export interface TemplateTask {
     id: string;
     templateId: string;
     section: SectionType;
     title: string;
     description?: string;
     estimatedMinutes: number;
     sequenceNumber: number;
     requiredDocs?: string[];
   }
   ```

#### Phase 1B: Smart Features (Week 3-4)
1. **Enhanced View Features**
   - Priority calculation system
   - Time block suggestions
   - Deadline tracking
   - Task dependencies visualization

2. **Task Management**
   - Drag-and-drop between sections
   - Quick actions
   - Time tracking
   - Status transitions

#### Phase 1C: Integration & Polish (Week 5-6)
1. **Template Management**
   - Template CRUD operations
   - Section management
   - Template duplication

2. **Workflow Automation**
   - Automatic task creation
   - Deadline calculations
   - Priority adjustments

### 5. Component Structure

```
src/
├── components/
│   ├── unified/
│   │   ├── MainView/
│   │   │   ├── index.tsx
│   │   │   ├── GroupingOptions.tsx
│   │   │   └── FilterControls.tsx
│   │   ├── Sections/
│   │   │   ├── Strategy.tsx
│   │   │   ├── Design.tsx
│   │   │   └── Implementation.tsx
│   │   └── Tasks/
│   │       ├── TaskCard.tsx
│   │       └── TaskDetails.tsx
│   ├── sidebar/
│   │   ├── WorkspaceList.tsx
│   │   ├── ViewOptions.tsx
│   │   └── Navigation.tsx
│   └── templates/
│       ├── TemplateBuilder/
│       │   ├── SectionManager.tsx
│       │   └── TaskDefaults.tsx
│       └── ProjectCreator/
│           ├── Timeline.tsx
│           └── Progress.tsx
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

   // Section management tests
   describe('Section Organization', () => {
     it('should maintain task order within sections', () => {
       // Test implementation
     });

     it('should calculate section completion status', () => {
       // Test implementation
     });
   });
   ```

2. **Integration Tests**
   - Template creation flow
   - Project lifecycle
   - Task state management
   - Section transitions

3. **E2E Tests**
   - Critical user journeys
   - Data persistence
   - Real-time updates
   - Workspace management

### 7. Development Progress

### Completed Features
- Database schema design
- Initial template system
- Basic task management

### In Progress
1. **Unified View Implementation**
   - Workspace structure
   - Section-based organization
   - Task grouping system

2. **UI Components**
   - Main view layout
   - Section management
   - Task cards

### Next Steps
1. **View Enhancements**
   - Implement grouping options
   - Add filtering system
   - Create section transitions

2. **Task Features**
   - Add time tracking
   - Implement dependencies
   - Add status management

3. **Template Updates**
   - Modify for section support
   - Add workspace integration
   - Update task inheritance

### Success Criteria
- Unified view successfully managing all tasks and projects
- Section-based organization working efficiently
- Template system supporting new structure
- Smooth task and project management
- Effective time tracking and priority management

### Next Steps
1. Begin unified view implementation
2. Update template system
3. Enhance task management
4. Add workspace support
5. Implement filtering and grouping
