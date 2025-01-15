import { Json } from './database.types';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ClientType = 'individual' | 'business';
export type ClientStatus = 'active' | 'inactive' | 'pending';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  clientId?: string;
  projectId?: string;
  dueDate?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  type: ClientType;
  status: ClientStatus;
  address?: string;
  avatarUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: TaskStatus;
  serviceType: string;
  dueDate: string;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  projectId?: string;
  clientId?: string;
  filePath: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'preparer' | 'manager';
  created_at: string;
  updated_at: string;
}

export type WorkflowStatus = 'draft' | 'active' | 'archived';

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  type: string;
  config: Record<string, unknown>;
}

export interface WorkflowTrigger {
  type: string;
  config: Record<string, unknown>;
}

export interface WorkflowCondition {
  type: string;
  config: Record<string, unknown>;
}

export interface WorkflowAction {
  type: string;
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string
  name: string
  description: string
  version: string
  status: string
  steps: Json
  triggers: Json
  conditions: Json
  actions: Json
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}
