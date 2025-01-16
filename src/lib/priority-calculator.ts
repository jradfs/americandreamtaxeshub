import { Task, Project } from "@/types/hooks";

interface PriorityFactors {
  dueDate: number; // Weight: 0.3
  clientPriority: number; // Weight: 0.2
  taskType: number; // Weight: 0.15
  timeEstimate: number; // Weight: 0.15
  dependencies: number; // Weight: 0.2
}

const WEIGHTS = {
  dueDate: 0.3,
  clientPriority: 0.2,
  taskType: 0.15,
  timeEstimate: 0.15,
  dependencies: 0.2,
};

// Priority categories and their weights
const CATEGORY_WEIGHTS: { [key: string]: number } = {
  "tax-return": 1.0,
  bookkeeping: 0.8,
  payroll: 0.9,
  "business-services": 0.7,
  other: 0.5,
};

export function calculatePriority(task: Task, projects?: Project[]): number {
  const factors: PriorityFactors = {
    dueDate: calculateDueDateScore(task.due_date),
    clientPriority: calculateClientPriorityScore(task.priority),
    taskType: calculateTaskTypeScore(task),
    timeEstimate: calculateTimeEstimateScore(task),
    dependencies: calculateDependenciesScore(task, projects),
  };

  return (
    factors.dueDate * WEIGHTS.dueDate +
    factors.clientPriority * WEIGHTS.clientPriority +
    factors.taskType * WEIGHTS.taskType +
    factors.timeEstimate * WEIGHTS.timeEstimate +
    factors.dependencies * WEIGHTS.dependencies
  );
}

function calculateDueDateScore(dueDate: string | null): number {
  if (!dueDate) return 0.5; // Middle priority for tasks without due dates

  const now = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilDue < 0) return 1; // Overdue tasks get highest priority
  if (daysUntilDue === 0) return 0.9; // Due today
  if (daysUntilDue <= 2) return 0.8; // Due in next 2 days
  if (daysUntilDue <= 7) return 0.6; // Due this week
  if (daysUntilDue <= 14) return 0.4; // Due next week
  if (daysUntilDue <= 30) return 0.2; // Due this month
  return 0.1; // Due later
}

function calculateClientPriorityScore(priority: string | null): number {
  if (!priority) return 0.5; // Middle priority for tasks without priority set

  switch (priority.toLowerCase()) {
    case "high":
      return 1;
    case "medium":
      return 0.6;
    case "low":
      return 0.3;
    default:
      return 0.5;
  }
}

function calculateTaskTypeScore(task: Task): number {
  // Consider task category
  if (task.category) {
    const categoryWeight =
      CATEGORY_WEIGHTS[task.category.toLowerCase()] || CATEGORY_WEIGHTS.other;
    return categoryWeight;
  }

  // Fallback to title-based scoring if no category
  if (task.title.toLowerCase().includes("tax")) return 0.9;
  if (task.title.toLowerCase().includes("deadline")) return 0.8;
  if (task.title.toLowerCase().includes("review")) return 0.7;
  return 0.5;
}

function calculateTimeEstimateScore(task: Task): number {
  if (!task.estimated_minutes) return 0.5;

  // Tasks that take longer get slightly higher priority
  // This helps prevent long tasks from being perpetually delayed
  if (task.estimated_minutes > 240) return 0.8; // > 4 hours
  if (task.estimated_minutes > 120) return 0.7; // > 2 hours
  if (task.estimated_minutes > 60) return 0.6; // > 1 hour
  return 0.5; // <= 1 hour
}

function calculateDependenciesScore(task: Task, projects?: Project[]): number {
  if (!task.dependencies || task.dependencies.length === 0) {
    return 0.5; // No dependencies
  }

  // Higher priority for tasks that are blocking others
  const blockingScore = 0.7;

  // If this task is part of a project, check project deadline
  if (projects && task.project_id) {
    const project = projects.find((p) => p.id === task.project_id);
    if (project && project.due_date) {
      const projectDue = new Date(project.due_date);
      const now = new Date();
      const daysUntilProjectDue = Math.ceil(
        (projectDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntilProjectDue <= 7) {
        return 0.9; // Critical path task in a project due soon
      }
    }
  }

  return blockingScore;
}
