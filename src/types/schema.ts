import { Database } from './database.types'

export type DbEnums = Database['public']['Enums']
export type DbTables = Database['public']['Tables']

// Tax Return Types
export type TaxReturn = DbTables['tax_returns']['Row']
export type TaxReturnInsert = DbTables['tax_returns']['Insert']
export type TaxReturnUpdate = DbTables['tax_returns']['Update']
export type TaxReturnStatus = DbEnums['tax_return_status']
export type FilingType = DbEnums['filing_type']

// User Types
export type User = DbTables['users']['Row']
export type UserRole = DbEnums['user_role']

// Client Types
export type Client = DbTables['clients']['Row']
export type ClientStatus = DbEnums['client_status']
export type ClientType = DbEnums['client_type']

// Project Types
export type Project = DbTables['projects']['Row']
export type ProjectStatus = DbEnums['project_status']
export type ServiceType = DbEnums['service_type']

// Task Types
export type Task = DbTables['tasks']['Row']
export type TaskStatus = DbEnums['task_status']
export type TaskPriority = DbEnums['task_priority']

// Document Types
export type Document = DbTables['client_documents']['Row']
export type DocumentStatus = DbEnums['document_status']

// Utility type to extract relationships
type ExtractRelationships<T> = T extends { Relationships: infer R } ? R : never

// Export relationships for each table
export type TaxReturnRelationships = ExtractRelationships<DbTables['tax_returns']>
export type UserRelationships = ExtractRelationships<DbTables['users']>
export type ClientRelationships = ExtractRelationships<DbTables['clients']>
export type ProjectRelationships = ExtractRelationships<DbTables['projects']>
export type TaskRelationships = ExtractRelationships<DbTables['tasks']>
export type DocumentRelationships = ExtractRelationships<DbTables['client_documents']> 