import { type UserRole } from '@/types/auth'
import { ROLE_PERMISSIONS, ROLES } from './constants'

type Permission = 'read' | 'write' | 'delete' | 'manage_users'

export class PermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionError'
  }
}

export function hasPermission(userRole: UserRole | undefined, permission: Permission): boolean {
  if (!userRole) return false
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function requirePermission(userRole: UserRole | undefined, permission: Permission): void {
  if (!hasPermission(userRole, permission)) {
    throw new PermissionError(`Missing required permission: ${permission}`)
  }
}

export function isAdmin(userRole: UserRole | undefined): boolean {
  return userRole === ROLES.ADMIN
}

export function requireAdmin(userRole: UserRole | undefined): void {
  if (!isAdmin(userRole)) {
    throw new PermissionError('Admin access required')
  }
}

export function canManageResource(
  userRole: UserRole | undefined,
  resourceOwnerId: string | undefined,
  userId: string | undefined
): boolean {
  if (!userRole || !userId) return false
  if (isAdmin(userRole)) return true
  return resourceOwnerId === userId
}

export function requireResourceAccess(
  userRole: UserRole | undefined,
  resourceOwnerId: string | undefined,
  userId: string | undefined
): void {
  if (!canManageResource(userRole, resourceOwnerId, userId)) {
    throw new PermissionError('Access to this resource is not allowed')
  }
}

// Helper for checking multiple permissions
export function hasAllPermissions(userRole: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

// Helper for checking if user has any of the specified permissions
export function hasAnyPermission(userRole: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

// Helper for role-based component rendering
export function canRender(requiredRole: UserRole | UserRole[], userRole: UserRole | undefined): boolean {
  if (!userRole) return false
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }
  return userRole === requiredRole || isAdmin(userRole)
} 