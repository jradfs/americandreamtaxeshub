import type { Database } from './database.types'
import { z } from 'zod'
import { userSchema, profileSchema } from '@/lib/validations/user'

// Database types
export type DbUser = Database['public']['Tables']['users']['Row']
export type DbUserInsert = Database['public']['Tables']['users']['Insert']
export type DbUserUpdate = Database['public']['Tables']['users']['Update']

export type DbProfile = Database['public']['Tables']['profiles']['Row']
export type DbProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type DbProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Enum types from database
export type UserRole = Database['public']['Enums']['user_role']

// Form data types
export type UserFormData = z.infer<typeof userSchema>
export type ProfileFormData = z.infer<typeof profileSchema>

// Types with relationships
export interface UserWithRelations extends DbUser {
  profile?: DbProfile | null
  managed_projects?: Database['public']['Tables']['projects']['Row'][]
  assigned_tasks?: Database['public']['Tables']['tasks']['Row'][]
  team_memberships?: Database['public']['Tables']['project_team_members']['Row'][]
}

export interface ProfileWithRelations extends DbProfile {
  user?: DbUser | null
}

// Constants
export const USER_ROLES: UserRole[] = [
  'admin',
  'team_member'
] 