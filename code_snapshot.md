# Supabase Data Fetching Analysis

## Overview
This snapshot focuses on the Supabase data fetching error in the dashboard metrics.
Error: Failed to fetch pending tax returns in getDashboardMetrics.

### `src\app\dashboard\page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shell'
import { DashboardHeader } from '@/components/header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { getDashboardMetrics } from '@/lib/supabase/dashboardQueries'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const metrics = await getDashboardMetrics()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your tax practice management dashboard."
      />
      <div className="grid gap-10">
        <DashboardTabs {...metrics} />
      </div>
    </DashboardShell>
  )
}

```

### `src\lib\supabase\server.ts`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export function createClient() {
  return createServerComponentClient<Database>({ cookies });
}
```

### `src\hooks\useTaxReturns.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TaxReturn } from '@/types/hooks'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from '@/components/ui/use-toast'

export function useTaxReturns(clientId?: string) {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchTaxReturns()
    } else {
      setTaxReturns([])
      setLoading(false)
    }
  }, [session, clientId])

  async function fetchTaxReturns() {
    try {
      let query = supabase
        .from('tax_returns')
        .select('*')
        .order('due_date', { ascending: true })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      setTaxReturns(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addTaxReturn({
    filing_type,
    status,
    tax_year,
    ...rest
  }: Omit<TaxReturn, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!filing_type || !status || tax_year === undefined) {
        throw new Error('Filing type, status, and tax year are required')
      }

      if (!session) {
        throw new Error('Please sign in to add tax returns')
      }

      const taxReturnData = {
        filing_type,
        status,
        tax_year: typeof tax_year === 'string' ? parseInt(tax_year, 10) : tax_year,
        ...rest,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .insert([{
          ...taxReturnData,
          filing_deadline: rest.filing_deadline,
          extension_filed: rest.extension_filed
        }])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => [data[0], ...prev])
        toast({
          title: 'Success',
          description: 'Tax return added successfully'
        })
        return data[0]
      }
      throw new Error('Failed to create tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function updateTaxReturn(
    id: number,
    updates: Partial<Omit<TaxReturn, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!session) {
        throw new Error('Please sign in to update tax returns')
      }

      const updateData = {
        ...updates,
        tax_year: updates.tax_year 
          ? (typeof updates.tax_year === 'string' ? parseInt(updates.tax_year, 10) : updates.tax_year)
          : undefined,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => prev.map(taxReturn => 
          taxReturn.id === id ? data[0] : taxReturn
        ))
        toast({
          title: 'Success',
          description: 'Tax return updated successfully'
        })
        return data[0]
      }
      throw new Error('Failed to update tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function deleteTaxReturn(id: number) {
    try {
      if (!session) {
        throw new Error('Please sign in to delete tax returns')
      }

      const { error } = await supabase
        .from('tax_returns')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTaxReturns(prev => prev.filter(taxReturn => taxReturn.id !== id))
      toast({
        title: 'Success',
        description: 'Tax return deleted successfully'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  return {
    taxReturns,
    loading,
    error,
    addTaxReturn,
    updateTaxReturn,
    deleteTaxReturn,
    refresh: fetchTaxReturns
  }
}

```

### `src\types\database.types.ts`

```typescript
﻿export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log_entries: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          task_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          completed: boolean
          created_at: string | null
          description: string | null
          id: string
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contact_details: {
        Row: {
          address: string | null
          city: string | null
          client_id: string
          created_at: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contact_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_name: string
          document_type: string
          id: string
          reminder_sent: boolean | null
          status: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_name: string
          document_type: string
          id?: string
          reminder_sent?: boolean | null
          status: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_name?: string
          document_type?: string
          id?: string
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          accounting_method: string | null
          address: string | null
          assigned_preparer_id: string | null
          business_tax_id: string | null
          business_type: string | null
          city: string | null
          company_name: string | null
          contact_email: string
          created_at: string | null
          document_deadline: string | null
          email: string | null
          filing_status: string | null
          fiscal_year_end: string | null
          full_name: string | null
          id: string
          individual_tax_id: string | null
          industry_code: string | null
          last_contact_date: string | null
          last_filed_date: string | null
          next_appointment: string | null
          notes: string | null
          phone: string | null
          primary_contact_name: string | null
          state: string | null
          status: Database["public"]["Enums"]["client_status"]
          tax_id: string | null
          tax_info: Json
          tax_return_status: string | null
          tax_year: number | null
          type: Database["public"]["Enums"]["client_type"] | null
          updated_at: string | null
          user_id: string | null
          zip: string | null
        }
        Insert: {
          accounting_method?: string | null
          address?: string | null
          assigned_preparer_id?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_email: string
          created_at?: string | null
          document_deadline?: string | null
          email?: string | null
          filing_status?: string | null
          fiscal_year_end?: string | null
          full_name?: string | null
          id: string
          individual_tax_id?: string | null
          industry_code?: string | null
          last_contact_date?: string | null
          last_filed_date?: string | null
          next_appointment?: string | null
          notes?: string | null
          phone?: string | null
          primary_contact_name?: string | null
          state?: string | null
          status: Database["public"]["Enums"]["client_status"]
          tax_id?: string | null
          tax_info?: Json
          tax_return_status?: string | null
          tax_year?: number | null
          type?: Database["public"]["Enums"]["client_type"] | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          accounting_method?: string | null
          address?: string | null
          assigned_preparer_id?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_email?: string
          created_at?: string | null
          document_deadline?: string | null
          email?: string | null
          filing_status?: string | null
          fiscal_year_end?: string | null
          full_name?: string | null
          id?: string
          individual_tax_id?: string | null
          industry_code?: string | null
          last_contact_date?: string | null
          last_filed_date?: string | null
          next_appointment?: string | null
          notes?: string | null
          phone?: string | null
          primary_contact_name?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tax_id?: string | null
          tax_info?: Json
          tax_return_status?: string | null
          tax_year?: number | null
          type?: Database["public"]["Enums"]["client_type"] | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      document_tracking: {
        Row: {
          document_name: string | null
          due_date: string | null
          id: string
          project_id: string | null
          reminder_sent: boolean | null
          status: string | null
        }
        Insert: {
          document_name?: string | null
          due_date?: string | null
          id: string
          project_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
        }
        Update: {
          document_name?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      individuals: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          tax_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          tax_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          tax_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          client_id: string | null
          content: string
          created_at: string | null
          id: string
          project_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          sent_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          sent_at?: string | null
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          sent_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      owners: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          individual_id: string | null
          ownership_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          individual_id?: string | null
          ownership_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          individual_id?: string | null
          ownership_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owners_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_services: {
        Row: {
          client_id: string | null
          created_at: string | null
          frequency: string
          id: string
          last_processed_date: string | null
          next_due_date: string | null
          progress: string | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          frequency: string
          id?: string
          last_processed_date?: string | null
          next_due_date?: string | null
          progress?: string | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          frequency?: string
          id?: string
          last_processed_date?: string | null
          next_due_date?: string | null
          progress?: string | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_team_members: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          category_id?: string | null
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          project_defaults?: Json | null
          recurring_schedule?: string | null
          seasonal_priority?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          project_defaults?: Json | null
          recurring_schedule?: string | null
          seasonal_priority?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accounting_info: Json | null
          client_id: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          end_date: string | null
          id: string
          name: string
          parent_project_id: string | null
          payroll_info: Json | null
          primary_manager: string | null
          priority: string
          service_info: Json | null
          service_type: string | null
          stage: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          task_count: number | null
          tax_info: Json | null
          tax_return_id: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          primary_manager?: string | null
          priority?: string
          service_info?: Json | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status: Database["public"]["Enums"]["project_status"]
          task_count?: number | null
          tax_info?: Json | null
          tax_return_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name?: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          primary_manager?: string | null
          priority?: string
          service_info?: Json | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          task_count?: number | null
          tax_info?: Json | null
          tax_return_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_tax_return"
            columns: ["tax_return_id"]
            isOneToOne: false
            referencedRelation: "tax_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_primary_manager_fkey"
            columns: ["primary_manager"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_primary_manager_fkey"
            columns: ["primary_manager"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          depends_on: string | null
          task_id: string | null
        }
        Insert: {
          depends_on?: string | null
          task_id?: string | null
        }
        Update: {
          depends_on?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_fkey"
            columns: ["depends_on"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          checklist: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          priority: string | null
          updated_at: string | null
        }
        Insert: {
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          priority?: string | null
          updated_at?: string | null
        }
        Update: {
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          priority?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_team: string[] | null
          assignee_id: string | null
          category: string | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          parent_task_id: string | null
          priority: string | null
          progress: number | null
          project_id: string | null
          recurring_config: Json | null
          start_date: string | null
          status: string
          tax_form_type: string | null
          tax_return_id: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          recurring_config?: Json | null
          start_date?: string | null
          status?: string
          tax_form_type?: string | null
          tax_return_id?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          recurring_config?: Json | null
          start_date?: string | null
          status?: string
          tax_form_type?: string | null
          tax_return_id?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_parent_task_id"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_returns: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          due_date: string | null
          extension_date: string | null
          filed_date: string | null
          filing_type: string
          id: string
          notes: string | null
          status: string
          tax_year: number
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          extension_date?: string | null
          filed_date?: string | null
          filing_type: string
          id?: string
          notes?: string | null
          status: string
          tax_year: number
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          extension_date?: string | null
          filed_date?: string | null
          filing_type?: string
          id?: string
          notes?: string | null
          status?: string
          tax_year?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          position: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      template_tasks: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          id: string
          order_index: number | null
          priority: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          order_index?: number | null
          priority?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          order_index?: number | null
          priority?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_template_tasks_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          projects_managed: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          projects_managed?: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          projects_managed?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          steps: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          steps: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          steps?: Json
        }
        Relationships: []
      }
    }
    Views: {
      project_dashboard: {
        Row: {
          assigned_team_members: string | null
          client_name: string | null
          company_name: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          due_date: string | null
          id: string | null
          name: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          total_tasks: number | null
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          completed_tasks: number | null
          completion_percentage: number | null
          project_id: string | null
          project_name: string | null
          project_status: Database["public"]["Enums"]["project_status"] | null
          total_tasks: number | null
        }
        Relationships: []
      }
      user_task_load: {
        Row: {
          completed_tasks: number | null
          full_name: string | null
          in_progress_tasks: number | null
          overdue_tasks: number | null
          total_tasks: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      archive_project: {
        Args: {
          project_id: string
        }
        Returns: undefined
      }
      are_dependencies_completed: {
        Args: {
          task_id: string
        }
        Returns: boolean
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      clone_project_template: {
        Args: {
          template_id: string
          new_client_id: string
          new_tax_year: number
        }
        Returns: string
      }
      commit_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_project_tasks: {
        Args: {
          p_project_id: string
          p_template_id: string
        }
        Returns: undefined
      }
      create_template_category: {
        Args: {
          p_name: string
          p_description: string
        }
        Returns: string
      }
      create_template_with_tasks: {
        Args: {
          title: string
          description: string
          default_priority: Database["public"]["Enums"]["task_priority"]
          project_defaults: Json
          template_category_id: string
          metadata: Json
          tasks: Json
        }
        Returns: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
      }
      delete_data: {
        Args: {
          table_name: string
          condition: string
        }
        Returns: string
      }
      delete_template_category: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      exec_sql: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      execute_ddl: {
        Args: {
          ddl_command: string
        }
        Returns: string
      }
      execute_dml: {
        Args: {
          dml_command: string
        }
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_project_tasks: {
        Args: {
          project_id: string
        }
        Returns: {
          id: string
          title: string
          status: string
          priority: string
          due_date: string
          assignee_id: string
        }[]
      }
      get_workspace_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      insert_data: {
        Args: {
          target_table: string
          data: Json
        }
        Returns: string
      }
      is_authenticated_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      lca: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      lquery_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree2text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltxtq_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      manage_constraint: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_index: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_rls: {
        Args: {
          table_name: string
          enable: boolean
        }
        Returns: string
      }
      manage_table: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_template_category: {
        Args: {
          p_action: string
          p_id?: string
          p_name?: string
          p_description?: string
        }
        Returns: Json
      }
      nlevel: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      rollback_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      text2ltree: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      update_data: {
        Args: {
          table_name: string
          data: Json
          condition: string
        }
        Returns: string
      }
      update_template_category: {
        Args: {
          p_id: string
          p_name: string
          p_description: string
        }
        Returns: boolean
      }
      update_template_with_tasks: {
        Args: {
          template_id: string
          title: string
          description: string
          default_priority: Database["public"]["Enums"]["task_priority"]
          project_defaults: Json
          template_category_id: string
          metadata: Json
          tasks: Json
        }
        Returns: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
      }
      validate_json_data: {
        Args: {
          data: Json
        }
        Returns: boolean
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      client_status: "active" | "inactive" | "pending" | "archived"
      client_type: "business" | "individual"
      document_status: "pending" | "uploaded" | "verified" | "rejected"
      filing_type:
        | "individual"
        | "business"
        | "partnership"
        | "corporation"
        | "s_corporation"
        | "non_profit"
      priority_level: "low" | "medium" | "high" | "urgent"
      project_status:
        | "not_started"
        | "on_hold"
        | "cancelled"
        | "todo"
        | "in_progress"
        | "review"
        | "blocked"
        | "completed"
        | "archived"
      service_type: "tax_return" | "bookkeeping" | "payroll" | "advisory"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "review" | "completed"
      tax_return_status:
        | "not_started"
        | "gathering_documents"
        | "in_progress"
        | "review"
        | "filed"
        | "amended"
      user_role: "admin" | "team_member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

```

### `src\lib\supabase\dashboardQueries.ts`

```typescript
import { createClient } from './server'

export async function getDashboardMetrics() {
  const supabase = createClient()

  // Simple query to verify table access
  const { data, error } = await supabase
    .from('tax_returns')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Tax returns error:', error)
    throw new Error('Failed to fetch pending tax returns.')
  }

  return {
    totalActiveClients: 0,
    pendingTaxReturns: data?.length ?? 0,
    activeProjects: 0,
    upcomingDeadlines: 0
  }
} 
```

### `src\app\error.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription>
            An error occurred while loading this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 rounded-lg bg-slate-950 p-4 text-sm text-white">
              {error.message}
            </pre>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

```

### `src\lib\supabase\client.ts`

```typescript
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserSupabaseClient<Database>()
}



```

### `src\lib\supabase\client.ts`

```typescript
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserSupabaseClient<Database>()
}



```

### `src\lib\supabase\dashboardQueries.ts`

```typescript
import { createClient } from './server'

export async function getDashboardMetrics() {
  const supabase = createClient()

  // Simple query to verify table access
  const { data, error } = await supabase
    .from('tax_returns')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Tax returns error:', error)
    throw new Error('Failed to fetch pending tax returns.')
  }

  return {
    totalActiveClients: 0,
    pendingTaxReturns: data?.length ?? 0,
    activeProjects: 0,
    upcomingDeadlines: 0
  }
} 
```

### `src\lib\supabase\server.ts`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export function createClient() {
  return createServerComponentClient<Database>({ cookies });
}
```

### `src\lib\supabase\supabase-provider.tsx`

```typescript
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

type SupabaseContextType = {
  supabase: SupabaseClient<Database>
  session: Session | null
}

const createClient = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-my-custom-header': 'american-dream-taxes-hub'
      }
    }
  }
)

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: createClient(),
  session: null
})

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        setSession(initialSession)
      } catch (error) {
        console.error('Error getting session:', error)
      }
    }

    getSession()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        router.refresh()
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error)
    }
  }, [supabase, router])

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

```

### `src\lib\supabase\supabase.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { type Database } from '@/types/database.types'

export const createClientHelper = (cookieStore?: any) => {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: cookieStore ? {
				get(name: string) {
					return cookieStore.get(name)?.value
				},
				set(name: string, value: string, options: any) {
					cookieStore.set({ name, value, ...options })
				},
				remove(name: string, options: any) {
					cookieStore.set({ name, value: '', ...options })
				},
			} : undefined,
			auth: {
				persistSession: true,
				storageKey: 'american-dream-taxes-auth',
			}
		}
	)
}
```

### `src\lib\supabase\tasks.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'
import { toast } from "@/components/ui/use-toast"

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function updateTask(
  taskId: string, 
  updates: Partial<Database['public']['Tables']['tasks']['Row']>
) {
  // Prepare updates, removing any undefined or null values
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
  )

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...filteredUpdates,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)

  if (error) {
    toast({
      title: "Error updating task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')

  if (error) {
    toast({
      title: "Error fetching tasks",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

export async function createTask(
  taskData: Omit<Database['public']['Tables']['tasks']['Insert'], 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (error) {
    toast({
      title: "Error creating task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

```

### `src\app\dashboard\layout.tsx`

```typescript
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  )
}
```

### `src\app\dashboard\page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shell'
import { DashboardHeader } from '@/components/header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { getDashboardMetrics } from '@/lib/supabase/dashboardQueries'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const metrics = await getDashboardMetrics()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your tax practice management dashboard."
      />
      <div className="grid gap-10">
        <DashboardTabs {...metrics} />
      </div>
    </DashboardShell>
  )
}

```

### `src\lib\api\projects.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';
import { ProjectFormValues } from '@/types/projects';

export async function createProject(
  projectData: ProjectFormValues
): Promise<Tables<'projects'> | null> {
  const supabase = createClient();
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      status: projectData.status || 'not_started',
      priority: projectData.priority || 'medium'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return project;
}

export async function createProjectFromTemplate(
  projectData: ProjectFormValues,
  templateId: string
): Promise<Tables<'projects'> | null> {
  const supabase = createClient();
  
  const { data: project, error } = await supabase
    .rpc('create_project_from_template', {
      project_data: projectData,
      template_id: templateId
    });

  if (error) {
    console.error('Error creating project from template:', error);
    return null;
  }

  return project;
}

```

### `src\lib\api\templates.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';

export async function getCategories(): Promise<Tables<'template_categories'>[] | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('template_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return null;
  }

  return data;
}

export async function getTemplates(): Promise<Tables<'project_templates'>[] | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('project_templates')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    return null;
  }

  return data;
}

export async function getTemplateWithTasks(
  templateId: string
): Promise<Tables<'project_templates'> & { tasks: Tables<'template_tasks'>[] } | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('project_templates')
    .select(`
      *,
      tasks: template_tasks (*)
    `)
    .eq('id', templateId)
    .single();

  if (error) {
    console.error('Error fetching template with tasks:', error);
    return null;
  }

  return data;
}

```

### `src\hooks\use-debounce.tsx`

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

```

### `src\hooks\use-mobile.tsx`

```typescript
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

### `src\hooks\use-protected-route.ts`

```typescript
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import type { UserRole } from '@/types/auth'

interface UseProtectedRouteOptions {
  allowedRoles?: UserRole[]
  redirectTo?: string
  isPublicRoute?: boolean
}

export function useProtectedRoute({
  allowedRoles,
  redirectTo = '/login',
  isPublicRoute = false
}: UseProtectedRouteOptions = {}) {
  const { session, loading, checkRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    // Allow public routes
    if (isPublicRoute) return

    // Redirect to login if not authenticated
    if (!session) {
      const returnUrl = encodeURIComponent(pathname || '')
      router.replace(`${redirectTo}?returnUrl=${returnUrl}`)
      return
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAllowedRole = allowedRoles.some(role => checkRole(role))
      if (!hasAllowedRole) {
        router.replace('/unauthorized')
      }
    }
  }, [session, loading, allowedRoles, redirectTo, isPublicRoute, router, pathname, checkRole])

  return {
    isAuthenticated: !!session,
    isAuthorized: !allowedRoles || allowedRoles.some(role => checkRole(role)),
    isLoading: loading,
    user: session?.user
  }
} 
```

### `src\hooks\use-toast.ts`

```typescript
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

### `src\hooks\use-users.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type User = {
  id: string
  name?: string
  avatar_url?: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUsers() {
      try {
        // First get the current user's data
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (!currentUser) {
          throw new Error('No authenticated user')
        }

        // Then fetch all profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .order('name')

        if (error) throw error

        // Process the profiles
        const processedUsers = (profiles || []).map(profile => ({
          id: profile.id,
          name: profile.name || 'Unknown User',
          avatar_url: profile.avatar_url
        }));

        setUsers(processedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        // On error, at least show the current user
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUsers([{
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User',
            avatar_url: user.user_metadata?.avatar_url
          }])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  return { users, loading }
}
```

### `src\hooks\useAITasks.ts`

```typescript
import { useState } from 'react';
import { TaskCategory } from '@/lib/ai/tasks';

export function useAITasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function classifyTask(title: string, description: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/classify-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify task');
      }

      const data = await response.json();
      return data as {
        category: TaskCategory;
        suggestions: Array<{category: TaskCategory, confidence: number}>;
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Classification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    classifyTask,
    isLoading,
    error,
  };
}
```

### `src\hooks\useClientOnboarding.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ClientOnboardingWorkflow, WorkflowTemplate } from '@/types/hooks'

export function useClientOnboarding(clientId?: string) {
  const [workflow, setWorkflow] = useState<ClientOnboardingWorkflow | null>(null)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (clientId) {
      fetchWorkflow()
    }
    fetchTemplates()
  }, [clientId])

  async function fetchWorkflow() {
    if (!clientId) return

    try {
      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .select('*')
        .eq('client_id', clientId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      
      // Transform the data to include steps if progress exists
      if (data) {
        const progressData = data.progress ? JSON.parse(data.progress) : null
        const workflowData: ClientOnboardingWorkflow = {
          ...data,
          steps: progressData?.steps || []
        }
        setWorkflow(workflowData)
      } else {
        setWorkflow(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTemplates() {
    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('name')

      if (error) throw error
      
      // Transform the templates data to parse steps JSON
      const transformedTemplates = (data || []).map(template => ({
        ...template,
        steps: Array.isArray(template.steps) 
          ? template.steps 
          : typeof template.steps === 'string'
            ? JSON.parse(template.steps)
            : []
      })) as WorkflowTemplate[]
      
      setTemplates(transformedTemplates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function startWorkflow(clientId: string, templateId: number) {
    try {
      if (!clientId || !templateId) {
        throw new Error('Client ID and template ID are required')
      }

      const template = templates.find(t => t.id === templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      const workflowData = {
        client_id: clientId,
        template_id: templateId,
        status: 'in_progress',
        progress: JSON.stringify({
          currentStep: 0,
          totalSteps: template.steps.length,
          completedSteps: [],
          steps: template.steps.map(step => ({
            ...step,
            status: 'pending'
          }))
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .insert([workflowData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        const progressData = JSON.parse(data[0].progress || '{}')
        const workflowWithSteps: ClientOnboardingWorkflow = {
          ...data[0],
          steps: progressData.steps || []
        }
        setWorkflow(workflowWithSteps)
        return workflowWithSteps
      }
      throw new Error('Failed to start workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<Omit<ClientOnboardingWorkflow, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setWorkflow(data[0])
        return data[0]
      }
      throw new Error('Failed to update workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteWorkflow(id: number) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const { error } = await supabase
        .from('client_onboarding_workflows')
        .delete()
        .eq('id', id)

      if (error) throw error
      setWorkflow(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    workflow,
    templates,
    loading,
    error,
    startWorkflow,
    updateWorkflow,
    deleteWorkflow,
    refresh: fetchWorkflow
  }
}

```

### `src\hooks\useClients.ts`

```typescript
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Client } from '@/types/clients'

export function useClients() {
  const [data, setData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data: clientsData, error: supabaseError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError

        // Transform the data to match our Client type
        const transformedClients = clientsData?.map((client) => ({
          ...client,
          contact_info: client.contact_info || {},
          tax_info: client.tax_info || {},
        })) as Client[]

        setData(transformedClients || [])
      } catch (error) {
        setError(error instanceof Error ? error : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [supabase])

  return { data, loading, error }
}

```

### `src\hooks\useDocuments.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabaseClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Document = Database['public']['Tables']['client_documents']['Row']
type DocumentInsert = Database['public']['Tables']['client_documents']['Insert']

export const useDocuments = (clientId: string) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [clientId])

  const fetchDocuments = async () => {
    setIsLoading(true)
    const { data, error } = await supabaseClient
      .from('client_documents')
      .select('*')
      .eq('client_id', clientId)
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data)
    }
    setIsLoading(false)
  }

  const uploadDocument = async (file: File, type: Document['document_type'], dueDate?: Date) => {
    // 1. Upload file to storage
    const { data: fileData, error: uploadError } = await supabaseClient
      .storage
      .from('client-documents')
      .upload(`${clientId}/${file.name}`, file)

    if (uploadError) throw uploadError

    // 2. Create document record
    const documentData: DocumentInsert = {
      client_id: clientId,
      document_name: file.name,
      document_type: type,
      status: 'pending',
      uploaded_at: new Date().toISOString(),
      file_path: fileData?.path
    }

    const { data, error: dbError } = await supabaseClient
      .from('client_documents')
      .insert(documentData)
      .single()

    if (dbError) throw dbError

    await fetchDocuments()
    return data
  }

  const updateDocumentStatus = async (documentId: number, status: Document['status']) => {
    const { error } = await supabaseClient
      .from('client_documents')
      .update({ status })
      .eq('id', documentId)

    if (error) throw error
    await fetchDocuments()
  }

  return {
    documents,
    isLoading,
    uploadDocument,
    updateDocumentStatus,
    fetchDocuments
  }
}

```

### `src\hooks\useNotes.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Note } from '@/types/hooks'

export function useNotes(clientId?: string, projectId?: number, userId?: string) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [clientId, projectId, userId])

  async function fetchNotes() {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      setNotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addNote({ content, ...rest }: Omit<Note, 'id' | 'created_at'>) {
    try {
      if (!content) {
        throw new Error('Content is required')
      }

      const noteData = {
        content,
        ...rest,
        created_at: new Date().toISOString(),
        client_id: clientId,
        user_id: userId,
        project_id: projectId
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setNotes(prev => [data[0], ...prev])
        return data[0]
      }
      throw new Error('Failed to create note')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateNote(id: number, content: string) {
    try {
      if (!content) {
        throw new Error('Content is required')
      }

      const { data, error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', id)
        .select()

      if (error) throw error
      setNotes(prev => prev.map(note => note.id === id ? { ...note, content } : note))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteNote(id: number) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotes(prev => prev.filter(note => note.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refresh: fetchNotes
  }
}

```

### `src\hooks\usePayrollServices.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PayrollService } from '@/types/hooks'

export function usePayrollServices(clientId?: string) {
  const [services, setServices] = useState<PayrollService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [clientId])

  async function fetchServices() {
    try {
      let query = supabase
        .from('payroll_services')
        .select('*')
        .order('created_at', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addService({ service_name, frequency, ...rest }: Omit<PayrollService, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!service_name || !frequency) {
        throw new Error('Service name and frequency are required')
      }

      const serviceData = {
        service_name,
        frequency,
        ...rest,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('payroll_services')
        .insert([serviceData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setServices(prev => [data[0], ...prev])
        return data[0]
      }
      throw new Error('Failed to create payroll service')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateService(
    id: number,
    updates: Partial<Omit<PayrollService, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('payroll_services')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setServices(prev => prev.map(service => service.id === id ? data[0] : service))
        return data[0]
      }
      throw new Error('Failed to update payroll service')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteService(id: number) {
    try {
      const { error } = await supabase
        .from('payroll_services')
        .delete()
        .eq('id', id)

      if (error) throw error
      setServices(prev => prev.filter(service => service.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    refresh: fetchServices
  }
}

```

### `src\hooks\useProjectAnalytics.ts`

```typescript
import { useCallback, useState } from 'react';
import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Project = Database['public']['Tables']['projects']['Row'];

function calculateCompletionRate(project: Project): number {
  if (!project.task_count || project.task_count === 0) return 0;
  return ((project.completed_tasks || 0) / project.task_count) * 100;
}

function assessProjectRisk(project: Project): string {
  const completionRate = calculateCompletionRate(project);
  if (completionRate < 30) return 'high';
  if (completionRate < 70) return 'medium';
  return 'low';
}

function predictDelay(project: Project): number {
  const completionRate = calculateCompletionRate(project);
  // Simple delay prediction based on completion rate
  if (completionRate < 50) return 5; // 5 days delay predicted
  if (completionRate < 80) return 2; // 2 days delay predicted
  return 0; // No delay predicted
}

function analyzeResourceUtilization(project: Project): number {
  // Simple resource utilization calculation
  const completionRate = calculateCompletionRate(project);
  return Math.min(100, completionRate * 1.2); // Adjust based on completion rate
}

function generateRecommendations(project: Project): string[] {
  const recommendations: string[] = [];
  const completionRate = calculateCompletionRate(project);
  
  if (completionRate < 30) {
    recommendations.push('Consider allocating more resources to this project');
  }
  if (project.status === 'blocked') {
    recommendations.push('Review and address project blockers');
  }
  if (!project.primary_manager) {
    recommendations.push('Assign a primary manager to improve project oversight');
  }
  
  return recommendations;
}

export function useProjectAnalytics() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const supabase = createClientComponentClient<Database>();

  const analyzeProjects = useCallback(async (projects: Project[]) => {
    setLoading(true);
    try {
      // Analyze project patterns and generate insights
      const projectInsights = projects.map(project => ({
        id: project.id,
        name: project.name,
        metrics: {
          completionRate: calculateCompletionRate(project),
          riskLevel: assessProjectRisk(project),
          predictedDelay: predictDelay(project),
          resourceUtilization: analyzeResourceUtilization(project)
        },
        recommendations: generateRecommendations(project)
      }));

      setInsights(projectInsights);
      return projectInsights;
    } catch (error) {
      console.error('Error analyzing projects:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    insights,
    analyzeProjects
  };
} 
```

### `src\hooks\useProjectFilters.ts`

```typescript
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import type { ProjectWithRelations } from '@/types/projects';
import type { ProjectStatus, Priority, ServiceCategory } from '@/types/hooks';
import { startOfDay, endOfDay } from 'date-fns';

export interface ProjectFilters {
  search: string;
  status: ProjectStatus[];
  priority: Priority[];
  service_category: ServiceCategory[];
  clientId: string;
  dateRange?: DateRange;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  groupBy: string;
}

export const defaultFilters: ProjectFilters = {
  search: '',
  status: [],
  priority: [],
  service_category: [],
  clientId: 'all',
  dateRange: undefined,
  sortBy: 'due_date',
  sortOrder: 'asc',
  groupBy: 'status'
};

export function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [error, setError] = useState<Error | null>(null);

  const updateFilters = (updates: Partial<ProjectFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filterProjects = (projects: ProjectWithRelations[]): ProjectWithRelations[] => {
    try {
      return projects.filter(project => {
        // Search filter
        if (filters.search && !matchesSearch(project, filters.search)) {
          return false;
        }

        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(project.status)) {
          return false;
        }

        // Priority filter
        if (filters.priority.length > 0 && project.priority && !filters.priority.includes(project.priority as Priority)) {
          return false;
        }

        // Service category filter
        if (filters.service_category.length > 0 && project.service_type && !filters.service_category.includes(project.service_type as ServiceCategory)) {
          return false;
        }

        // Client filter
        if (filters.clientId !== 'all' && project.client_id !== filters.clientId) {
          return false;
        }

        // Date range filter
        if (filters.dateRange?.from) {
          const startDate = startOfDay(filters.dateRange.from);
          const endDate = filters.dateRange.to ? endOfDay(filters.dateRange.to) : endOfDay(filters.dateRange.from);
          const projectDate = project.due_date ? new Date(project.due_date) : null;

          if (!projectDate || projectDate < startDate || projectDate > endDate) {
            return false;
          }
        }

        return true;
      });
    } catch (err) {
      console.error('Error filtering projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to filter projects'));
      return projects;
    }
  };

  const matchesSearch = (project: ProjectWithRelations, search: string): boolean => {
    const searchLower = search.toLowerCase();
    return (
      (project.name?.toLowerCase().includes(searchLower) || false) ||
      (project.description?.toLowerCase().includes(searchLower) || false) ||
      (project.client?.full_name?.toLowerCase().includes(searchLower) || false) ||
      (project.client?.company_name?.toLowerCase().includes(searchLower) || false)
    );
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    filterProjects,
    error
  };
}

```

### `src\hooks\useProjectForm.ts`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ProjectFormValues, projectSchema, ServiceType } from '@/lib/validations/project';
import { Database } from '@/types/database.types';
import { ProjectTemplate } from '@/types/projects';

type ProjectRow = Database['public']['Tables']['projects']['Row'];

interface UseProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
}

export function useProjectForm({ defaultValues, onSubmit }: UseProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      status: 'not_started',
      priority: 'medium',
      service_type: 'tax_return',
      tax_info: null,
      accounting_info: null,
      payroll_info: null,
      service_info: null,
      completed_tasks: 0,
      completion_percentage: 0,
      task_count: 0,
      ...defaultValues,
    },
  });

  const calculateProgress = () => {
    const fields = form.getValues();
    const requiredFields = [
      'name',
      'client_id',
      'service_type',
      'due_date',
    ];

    const serviceFields = {
      tax_return: ['tax_info'],
      bookkeeping: ['accounting_info'],
      payroll: ['payroll_info'],
      advisory: ['service_info']
    } as const;

    let completed = 0;
    let total = requiredFields.length;

    // Check basic required fields
    for (const field of requiredFields) {
      if (fields[field as keyof ProjectFormValues]) {
        completed++;
      }
    }

    // Check service-specific fields
    if (fields.service_type && serviceFields[fields.service_type]) {
      const serviceSpecificFields = serviceFields[fields.service_type];
      total += serviceSpecificFields.length;
      for (const field of serviceSpecificFields) {
        if (fields[field as keyof ProjectFormValues]) {
          completed++;
        }
      }
    }

    // Calculate percentage
    const percentage = (completed / total) * 100;
    setProgress(Math.round(percentage));
  };

  const onServiceTypeChange = (type: ServiceType) => {
    // Reset service-specific fields when type changes
    form.setValue('service_type', type);
    form.setValue('tax_info', null);
    form.setValue('accounting_info', null);
    form.setValue('payroll_info', null);
    form.setValue('service_info', null);
    calculateProgress();
  };

  const onTemplateSelect = (template: ProjectTemplate | null) => {
    if (!template) {
      form.setValue('template_id', null);
      return;
    }

    form.setValue('template_id', template.id);
    if (template.project_defaults) {
      const defaults = template.project_defaults as Partial<ProjectRow>;
      Object.entries(defaults).forEach(([key, value]) => {
        form.setValue(key as keyof ProjectFormValues, value);
      });
    }
    calculateProgress();
  };

  const handleSubmit = async (e?: React.BaseSyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      setIsSubmitting(true);
      const values = form.getValues();
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    progress,
    onServiceTypeChange,
    onTemplateSelect,
    onSubmit: handleSubmit,
    calculateProgress,
  };
}

```

### `src\hooks\useProjectManagement.ts`

```typescript
import { useState, useCallback, useMemo, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format, startOfWeek, endOfWeek, addMonths } from 'date-fns';
import type { 
  ProjectWithRelations, 
  ServiceCategory, 
  TaxReturnType, 
  ProjectStatus, 
  Priority 
} from '@/types/projects';
import type { ReviewStatus } from '@/types/tasks';
import { useToast } from '@/components/ui/use-toast';
import { useProjectFilters } from './useProjectFilters';
import type { ProjectFilters } from './useProjectFilters';

export function useProjectManagement(): {
  projects: ProjectWithRelations[];
  loading: boolean;
  error: Error | null;
  filters: ProjectFilters;
  updateFilters: (updates: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
  filterProjects: (projects: ProjectWithRelations[]) => ProjectWithRelations[];
  groupProjects: (projects: ProjectWithRelations[], groupBy: string) => { [key: string]: ProjectWithRelations[] };
  refresh: () => Promise<void>;
  bulkUpdateProjects: (projectIds: string[], updates: Partial<ProjectWithRelations>) => Promise<boolean>;
  archiveProjects: (projectIds: string[]) => Promise<boolean>;
} {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { filters, updateFilters, resetFilters, filterProjects: applyFilters } = useProjectFilters();

  const groupKeyMap = {
    status: (project: ProjectWithRelations) => project.status || 'No Status',
    service: (project: ProjectWithRelations) => project.service_category || 'Uncategorized',
    deadline: (project: ProjectWithRelations) => {
      if (!project.due_date) return 'No Due Date';
      const dueDate = new Date(project.due_date);
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);

      if (dueDate < today) return 'Overdue';
      if (dueDate <= weekEnd) return 'This Week';
      if (dueDate <= addMonths(today, 1)) return 'Next Month';
      return 'Later';
    },
    client: (project: ProjectWithRelations) => project.client?.name || 'No Client'
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(*),
          tasks:project_tasks(
            *,
            checklist_items(*),
            activity_log_entries(*)
          ),
          tax_return:tax_returns(*)
        `);

      if (fetchError) throw fetchError;

      const processedProjects = data.map(project => ({
        ...project,
        completion_percentage: calculateCompletionPercentage(project)
      }));

      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    fetchProjects();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        fetchProjects
      )
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
    };
  }, [fetchProjects, supabase]);

  const calculateCompletionPercentage = (project: ProjectWithRelations): number => {
    if (!project.tasks?.length) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const groupProjects = useCallback((projects: ProjectWithRelations[], groupBy: string) => {
    const groupedProjects: { [key: string]: ProjectWithRelations[] } = {};
    const getGroupKey = groupKeyMap[groupBy as keyof typeof groupKeyMap] || groupKeyMap.status;

    projects.forEach(project => {
      const key = getGroupKey(project);
      if (!groupedProjects[key]) {
        groupedProjects[key] = [];
      }
      groupedProjects[key].push(project);
    });

    return groupedProjects;
  }, []);

  const bulkUpdateProjects = async (projectIds: string[], updates: Partial<ProjectWithRelations>) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .in('id', projectIds);

      if (updateError) throw updateError;

      await fetchProjects();
      return true;
    } catch (err) {
      console.error('Error updating projects:', err);
      throw new Error('Failed to update projects');
    }
  };

  const archiveProjects = async (projectIds: string[]) => {
    return bulkUpdateProjects(projectIds, { 
      status: 'archived',
      updated_at: new Date().toISOString()
    });
  };

  const TAX_DEADLINES: Record<TaxReturnType, { normal: string; extended: string }> = {
    '1040': { normal: '04-15', extended: '10-15' },
    '1120': { normal: '04-15', extended: '10-15' },
    '1065': { normal: '03-15', extended: '09-15' },
    '1120S': { normal: '03-15', extended: '09-15' },
    '990': { normal: '05-15', extended: '11-15' },
    '941': { normal: 'quarterly', extended: 'N/A' },
    '940': { normal: '01-31', extended: 'N/A' },
    'other': { normal: '04-15', extended: '10-15' }
  };

  const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (new Date(deadlineDate) > today) {
        return deadlineDate;
      }
    }
    
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const getProjectDeadline = useCallback((project: ProjectWithRelations): Date | null => {
    if (project.due_date) {
      return new Date(project.due_date);
    }
    if (project.tax_info?.filing_deadline) {
      return new Date(project.tax_info.filing_deadline);
    }
    if (project.payroll_info?.next_payroll_date) {
      return new Date(project.payroll_info.next_payroll_date);
    }
    if (project.business_services_info?.due_date) {
      return new Date(project.business_services_info.due_date);
    }
    if (project.tax_info?.return_type) {
      const isExtended = project.tax_info.is_extended || false;
      return getDeadline(project.tax_info.return_type, isExtended);
    }
    return null;
  }, [getDeadline]);

  const filterProjects = useCallback((projects: ProjectWithRelations[]) => {
    if (!projects) return [];
    
    return projects.filter(project => {
      const searchLower = (filters.search || '').toLowerCase();
      
      // Safely access potentially undefined properties
      const projectTitle = project?.title || '';
      const projectDesc = project?.description || '';
      const clientCompany = project?.client?.company_name || '';
      const clientName = project?.client?.full_name || '';
      const returnType = project?.tax_info?.return_type || '';
      
      const matchesSearch = !searchLower || (
        projectTitle.toLowerCase().includes(searchLower) ||
        projectDesc.toLowerCase().includes(searchLower) ||
        clientCompany.toLowerCase().includes(searchLower) ||
        clientName.toLowerCase().includes(searchLower) ||
        returnType.toLowerCase().includes(searchLower)
      );

      const matchesService = !filters.service?.length || 
        (project?.service_category && filters.service.includes(project.service_category));
      
      const matchesStatus = !filters.status?.length || 
        (project?.status && filters.status.includes(project.status));
      
      const matchesPriority = !filters.priority?.length || 
        (project?.priority && filters.priority.includes(project.priority));
      
      const matchesReturnType = !filters.returnType?.length || 
        (project?.tax_info?.return_type && filters.returnType.includes(project.tax_info.return_type));
      
      const matchesReviewStatus = !filters.reviewStatus?.length || 
        (project?.tax_info?.review_status && filters.reviewStatus.includes(project.tax_info.review_status));

      const deadline = getProjectDeadline(project);
      const matchesDueThisWeek = !filters.dueThisWeek || 
        (deadline && new Date(deadline) <= new Date(endOfWeek(new Date())));

      const matchesDueThisMonth = !filters.dueThisMonth || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 1)));

      const matchesDueThisQuarter = !filters.dueThisQuarter || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 3)));

      const matchesDateRange = !filters.dateRange || !deadline || 
        (deadline >= new Date(filters.dateRange.from) && deadline <= new Date(filters.dateRange.to));

      return (
        matchesSearch &&
        matchesService &&
        matchesStatus &&
        matchesPriority &&
        matchesReturnType &&
        matchesReviewStatus &&
        matchesDueThisWeek &&
        matchesDueThisMonth &&
        matchesDueThisQuarter &&
        matchesDateRange
      );
    });
  }, [filters, getProjectDeadline]);

  return {
    projects,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    filterProjects,
    groupProjects,
    refresh: fetchProjects,
    bulkUpdateProjects,
    archiveProjects
  };
}

```

### `src\hooks\useProjectSubmission.ts`

```typescript
import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectFormValues, validateTaskDependencies, sortTasksByDependencies } from '@/lib/validations/project';

export const useProjectSubmission = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const submitProject = async (values: ProjectFormValues) => {
    setIsLoading(true);

    try {
      // Validate tasks before submission
      if (values.tasks?.length && !validateTaskDependencies(values.tasks)) {
        throw new Error('Invalid task dependencies');
      }

      // Sort tasks by dependencies to ensure correct order
      const sortedTasks = values.tasks ? sortTasksByDependencies(values.tasks) : [];

      // Prepare project data
      const projectData = {
        creation_type: values.creation_type,
        template_id: values.template_id,
        name: values.name.trim(),
        description: values.description?.trim(),
        client_id: values.client_id,
        status: values.status,
        priority: values.priority,
        due_date: values.due_date?.toISOString(),
        service_type: values.service_type,
        tax_info: values.tax_info || {},
        accounting_info: values.accounting_info || {},
        payroll_info: values.payroll_info || {},
        tax_return_id: values.tax_return_id,
        team_members: values.team_members || [],
        tasks: sortedTasks.map((task, index) => ({
          title: task.title.trim(),
          description: task.description?.trim(),
          priority: task.priority,
          dependencies: task.dependencies || [],
          order_index: index,
          assignee_id: task.assignee_id
        }))
      };

      // Submit project through API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create project');
      }

      toast.success('Project created successfully');
      onSuccess();
      return { data: responseData, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      console.error('Project creation error:', err);
      toast.error(message);
      return { data: null, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitProject
  };
};

```

### `src\hooks\useProjectTabProgress.ts`

```typescript
import { UseFormReturn } from 'react-hook-form';

export function useProjectTabProgress(form: UseFormReturn<any>) {
  const getTabProgress = (tab: string): number => {
    const fields = {
      'basic-info': ['name', 'description', 'client_id', 'priority'],
      'service-details': ['service_type'],
      'tasks': ['tasks']
    };

    const tabFields = fields[tab as keyof typeof fields] || [];
    if (!tabFields.length) return 100;

    const completedFields = tabFields.filter(field => {
      const value = form.getValues(field);
      return value !== undefined && value !== '' && value !== null;
    });

    return Math.round((completedFields.length / tabFields.length) * 100);
  };

  return { getTabProgress };
} 
```

### `src\hooks\useProjectTemplates.ts`

```typescript
import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { ProjectTemplate, ProjectTemplateInput } from '@/types/projects'

export function useProjectTemplates() {
  const { supabase } = useSupabase()
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('project_templates')
        .select('*, template_tasks(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch templates'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createTemplate = useCallback(async (template: ProjectTemplateInput) => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .insert(template)
        .select('*, template_tasks(*)')
        .single()

      if (error) throw error

      setTemplates(prev => [data, ...prev])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template')
    }
  }, [supabase])

  const updateTemplate = useCallback(async (id: string, updates: Partial<ProjectTemplateInput>) => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .update(updates)
        .eq('id', id)
        .select('*, template_tasks(*)')
        .single()

      if (error) throw error

      setTemplates(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template')
    }
  }, [supabase])

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTemplates(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template')
    }
  }, [supabase])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  }
}
```

### `src\hooks\useProjects.ts`

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'
import type { 
  Project, 
  ProjectWithRelations, 
  ProjectTemplate, 
  ProjectStatus, 
  ServiceType 
} from '@/types/hooks'
import type { Task } from '@/types/tasks'
import { toast } from 'sonner'
import { 
  FilterState, 
  PaginationState, 
  SortingState, 
  ProjectFilters 
} from '@/types/hooks'

interface ProjectResponse<T> {
  data: T | null
  error: string | null
}

export function useProjects(initialFilters?: ProjectFilters) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {})
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: 1000
  })
  const [sorting, setSorting] = useState<SortingState>({
    column: 'created_at',
    direction: 'desc'
  })
  const [totalCount, setTotalCount] = useState(0)
  const supabase = createClientComponentClient<Database>()

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:clients!projects_client_id_fkey (*),
        tasks!tasks_project_id_fkey (
          *,
          checklist_items(*),
          activity_log_entries(*)
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    if (filters.status?.length) {
      query = query.in('status', filters.status)
    }
    if (filters.serviceType?.length) {
      query = query.in('service_type', filters.serviceType)
    }
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }
    if (filters.dueDateRange) {
      query = query
        .gte('due_date', filters.dueDateRange.from.toISOString())
        .lte('due_date', filters.dueDateRange.to.toISOString())
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    const from = pagination.pageIndex * pagination.pageSize
    const to = from + pagination.pageSize - 1
    query = query.range(from, to)

    return query
  }, [supabase, filters, pagination])

  const fetchTaxReturns = useCallback(async (projectIds: string[]): Promise<Map<string, Database['public']['Tables']['tax_returns']['Row']>> => {
    if (!projectIds.length) return new Map()

    try {
      const { data, error } = await supabase
        .from('tax_returns')
        .select('*')
        .in('id', projectIds)

      if (error) {
        console.error('Error fetching tax returns:', error)
        return new Map()
      }

      return new Map(data?.map(tr => [tr.id, tr]) || [])
    } catch (error) {
      console.error('Error in fetchTaxReturns:', error)
      return new Map()
    }
  }, [supabase])

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const query = buildQuery()
      const { data: projectsData, error: projectsError, count } = await query

      if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        toast.error('Failed to load projects')
        throw projectsError
      }

      // Fetch tax returns separately for projects that have tax_return_id
      const projectsWithTaxReturns = projectsData?.filter(p => p.tax_return_id) || []
      const taxReturnsMap = await fetchTaxReturns(projectsWithTaxReturns.map(p => p.tax_return_id))

      // Combine the data
      const enrichedProjects = projectsData?.map(project => ({
        ...project,
        tax_return: project.tax_return_id ? taxReturnsMap.get(project.tax_return_id) : undefined
      })) as ProjectWithRelations[]

      setProjects(enrichedProjects)
      if (count !== null) setTotalCount(count)
    } catch (error) {
      console.error('Error in fetchProjects:', error)
      setProjects([])
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [buildQuery, fetchTaxReturns])

  const fetchTaxReturnForProject = async (projectId: string): Promise<Database['public']['Tables']['tax_returns']['Row'] | null> => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project?.tax_return_id) return null

      const { data, error } = await supabase
        .from('tax_returns')
        .select('*')
        .eq('id', project.tax_return_id)
        .single()

      if (error) {
        if (error.code === '42501') { // Permission denied
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching tax return:', error)
      return null
    }
  }

  const createProject = async (projectData: NewProject & { tasks?: Task[] }): Promise<ProjectResponse<ProjectWithRelations>> => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (projectError) throw projectError

      // Handle tasks and their related items
      if (projectData.tasks?.length) {
        for (const task of projectData.tasks) {
          // Create task
          const { data: newTask, error: taskError } = await supabase
            .from('tasks')
            .insert({
              ...task,
              project_id: project.id
            })
            .select()
            .single()

          if (taskError) throw taskError

          // Create checklist items if any
          if (task.checklist_items?.length) {
            const { error: checklistError } = await supabase
              .from('checklist_items')
              .insert(
                task.checklist_items.map(item => ({
                  ...item,
                  task_id: newTask.id
                }))
              )

            if (checklistError) throw checklistError
          }

          // Add initial activity log entry
          const { error: activityError } = await supabase
            .from('activity_log_entries')
            .insert({
              task_id: newTask.id,
              type: 'created',
              details: { status: newTask.status }
            })

          if (activityError) throw activityError
        }
      }

      await fetchProjects()
      return { data: project, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error: 'Failed to create project' }
    }
  }

  const updateProject = async (projectId: string, updates: UpdateProject): Promise<ProjectResponse<ProjectWithRelations>> => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      if (projectError) throw projectError

      await fetchProjects()
      return { data: project, error: null }
    } catch (error) {
      console.error('Error updating project:', error)
      return { data: null, error: 'Failed to update project' }
    }
  }

  const deleteProject = async (projectId: string): Promise<{ error: string | null }> => {
    try {
      // Delete related records first
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', projectId)

      if (tasks?.length) {
        // Delete task-related records
        await Promise.all(tasks.map(task => Promise.all([
          supabase.from('checklist_items').delete().eq('task_id', task.id),
          supabase.from('activity_log_entries').delete().eq('task_id', task.id)
        ])))
      }

      // Then delete notes
      await supabase.from('notes').delete().eq('project_id', projectId)

      // Finally delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      await fetchProjects()
      return { error: null }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { error: 'Failed to delete project' }
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    totalCount,
    filters,
    setFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
    createProject,
    updateProject,
    deleteProject,
    fetchTaxReturnForProject
  }
}

```

### `src\hooks\useProjects.tsx`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { DbProject, ProjectWithRelations, ProjectInsert, ProjectResponse } from '@/types/projects';

export function useProjects(clientId?: string): {
  projects: ProjectWithRelations[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: ProjectInsert) => Promise<ProjectWithRelations>;
  updateProject: (id: string, updates: Partial<DbProject>) => Promise<ProjectWithRelations>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
} {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            full_name,
            company_name,
            contact_info,
            contact_email,
            type,
            status
          ),
          tasks:tasks!tasks_project_id_fkey (
            id,
            title,
            description,
            status,
            priority,
            due_date,
            assignee_id,
            progress,
            category
          ),
          team_members:project_team_members!project_team_members_project_id_fkey (
            user:users (
              id,
              full_name,
              email,
              role
            )
          )
        `)
        .order('due_date', { ascending: true })
        .neq('status', 'archived');

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw new Error('Failed to fetch projects');
      }

      const projectsWithRelations = (projectsData as unknown as ProjectResponse[] | null)?.map(project => ({
        ...project,
        client: project.client || null,
        tasks: project.tasks || [],
        team_members: project.team_members?.map(tm => tm.user) || [],
        tax_info: project.tax_info || null,
        accounting_info: project.accounting_info || null,
        payroll_info: project.payroll_info || null,
        service_info: project.service_info || null
      })) || [];

      setProjects(projectsWithRelations);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching projects';
      console.error('Error in fetchProjects:', err);
      setError(errorMessage);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (project: ProjectInsert): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info,
          contact_email,
          type,
          status
        ),
        tasks:tasks!tasks_project_id_fkey (
          id,
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          progress,
          category
        ),
        team_members:project_team_members!project_team_members_project_id_fkey (
          user:users (
            id,
            full_name,
            email,
            role
          )
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    const newProject = {
      ...data,
      client: (data as unknown as ProjectResponse).client || null,
      tasks: (data as unknown as ProjectResponse).tasks || [],
      team_members: (data as unknown as ProjectResponse).team_members?.map(tm => tm.user) || [],
      tax_info: data.tax_info || null,
      accounting_info: data.accounting_info || null,
      payroll_info: data.payroll_info || null,
      service_info: data.service_info || null
    } as ProjectWithRelations;

    setProjects(current => [...current, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<DbProject>): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info,
          contact_email,
          type,
          status
        ),
        tasks:tasks!tasks_project_id_fkey (
          id,
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          progress,
          category
        ),
        team_members:project_team_members!project_team_members_project_id_fkey (
          user:users (
            id,
            full_name,
            email,
            role
          )
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');

    const updatedProject = {
      ...data,
      client: (data as unknown as ProjectResponse).client || null,
      tasks: (data as unknown as ProjectResponse).tasks || [],
      team_members: (data as unknown as ProjectResponse).team_members?.map(tm => tm.user) || [],
      tax_info: data.tax_info || null,
      accounting_info: data.accounting_info || null,
      payroll_info: data.payroll_info || null,
      service_info: data.service_info || null
    } as ProjectWithRelations;

    setProjects(current =>
      current.map(p => (p.id === id ? updatedProject : p))
    );

    return updatedProject;
  };

  const deleteProject = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setProjects(current => current.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, [clientId]);

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}
```

### `src\hooks\useServiceFields.ts`

```typescript
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues, ServiceType, ServiceCategory } from '@/types/hooks';

export function useServiceFields(form: UseFormReturn<ProjectFormValues>) {
  const handleServiceTypeChange = (currentType: ServiceType | ServiceCategory) => {
    if (currentType !== 'uncategorized') {
      // Reset specific service fields based on type
      switch (currentType) {
        case 'tax_return':
          form.setValue('tax_return_id', undefined);
          form.setValue('tax_return_status', undefined);
          break;
        case 'accounting':
          form.setValue('accounting_period', undefined);
          break;
        // Add other service type specific resets
      }
    }
  };

  const calculateProgress = (serviceType: string) => {
    // Progress calculation logic
    return 50; // Placeholder
  };

  const validateServiceSpecificFields = () => {
    const currentType = form.getValues('service_type');
    const currentTasks = form.getValues('tasks') || [];

    if (currentType !== 'uncategorized' && currentTasks.length > 0) {
      // Validation logic
      return true;
    }

    return false;
  };

  return {
    handleServiceTypeChange,
    calculateProgress,
    validateServiceSpecificFields
  };
}

```

### `src\hooks\useSmartProjectFilters.ts`

```typescript
import { useCallback } from 'react';
import { ProjectFilters } from '@/types/hooks';
import { ProjectWithRelations } from '@/types/projects';

export function useSmartProjectFilters() {
  const suggestFilters = useCallback(async (projects: ProjectWithRelations[]) => {
    try {
      // Analyze project patterns and suggest relevant filters
      const patterns = analyzeProjectPatterns(projects);
      
      return {
        recommendedFilters: patterns.map(pattern => ({
          type: pattern.type,
          value: pattern.value,
          confidence: pattern.confidence,
          reason: pattern.reason
        })),
        autoGroups: generateSmartGroups(projects)
      };
    } catch (error) {
      console.error('Error suggesting filters:', error);
      return null;
    }
  }, []);

  return {
    suggestFilters
  };
} 
```

### `src\hooks\useSmartTemplates.ts`

```typescript
import { useCallback } from 'react';
import { ProjectTemplate } from '@/types/projects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useSmartTemplates() {
  const supabase = createClientComponentClient();

  const suggestTemplate = useCallback(async (projectData: any) => {
    try {
      // Analyze project requirements and suggest best template
      const analysis = await analyzeProjectRequirements(projectData);
      const recommendations = generateTemplateRecommendations(analysis);
      
      return {
        suggestedTemplate: recommendations.bestMatch,
        alternatives: recommendations.alternatives,
        customizations: recommendations.suggestedCustomizations
      };
    } catch (error) {
      console.error('Error suggesting template:', error);
      return null;
    }
  }, [supabase]);

  return {
    suggestTemplate
  };
} 
```

### `src\hooks\useStorage.ts`

```typescript
import { useState } from 'react';
import { StorageService } from '@/lib/storage/storage';
import { type FileObject } from '@supabase/storage-js';

interface UseStorageReturn {
  uploadFile: (file: File, path: string) => Promise<FileObject | null>;
  downloadFile: (path: string) => Promise<Blob | null>;
  deleteFile: (path: string) => Promise<boolean>;
  listFiles: (prefix?: string) => Promise<FileObject[] | null>;
  getPublicUrl: (path: string) => string | null;
  loading: boolean;
  error: Error | null;
}

export function useStorage(): UseStorageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const storageService = StorageService.getInstance();

  const handleOperation = async <T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      console.error(errorMessage, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    return handleOperation(
      () => storageService.uploadFile(file, path),
      'Error uploading file'
    );
  };

  const downloadFile = async (path: string) => {
    return handleOperation(
      () => storageService.downloadFile(path),
      'Error downloading file'
    );
  };

  const deleteFile = async (path: string) => {
    return handleOperation(
      () => storageService.deleteFile(path),
      'Error deleting file'
    );
  };

  const listFiles = async (prefix?: string) => {
    return handleOperation(
      () => storageService.listFiles(prefix),
      'Error listing files'
    );
  };

  const getPublicUrl = (path: string) => {
    try {
      return storageService.getPublicUrl(path);
    } catch (err) {
      console.error('Error getting public URL:', err);
      setError(err instanceof Error ? err : new Error('Error getting public URL'));
      return null;
    }
  };

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,
    getPublicUrl,
    loading,
    error,
  };
}

```

### `src\hooks\useTaskManagement.ts`

```typescript
'use client'

import { useState, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ProjectFormValues } from '@/types/projects'
import { TaskFormValues, TaskStatus, TaskPriority, DbChecklistItem, DbActivityLogEntry } from '@/types/tasks'
import { Database } from '@/types/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type TaskSchema = TaskFormValues & {
  title: string
  dependencies: string[]
  order_index: number
  checklist_items?: DbChecklistItem[]
  activity_log_entries?: DbActivityLogEntry[]
}

interface ValidationError {
  message: string
  type: 'dependency' | 'circular' | 'duplicate' | 'required' | 'date' | 'other'
}

export function useTaskManagement(form: UseFormReturn<ProjectFormValues>) {
  const [taskErrors, setTaskErrors] = useState<Record<string, ValidationError>>({})
  const supabase = createClientComponentClient()

  const validateCircularDependencies = useCallback((
    tasks: TaskSchema[],
    startTask: string,
    visited = new Set<string>(),
    path = new Set<string>()
  ): { isValid: boolean; cycle?: string[] } => {
    if (path.has(startTask)) {
      return {
        isValid: false,
        cycle: Array.from(path).concat(startTask)
      }
    }

    if (visited.has(startTask)) {
      return { isValid: true }
    }

    visited.add(startTask)
    path.add(startTask)
    
    const task = tasks.find(t => t.title === startTask)
    if (!task) return { isValid: true }

    for (const dep of task.dependencies || []) {
      const result = validateCircularDependencies(tasks, dep, visited, path)
      if (!result.isValid) {
        return result
      }
    }

    path.delete(startTask)
    return { isValid: true }
  }, [])

  const validateTaskDependencies = useCallback((tasks: TaskSchema[]): boolean => {
    const taskTitles = new Set(tasks.map(t => t.title))
    const errors: Record<string, ValidationError> = {}
    
    // Check for duplicate titles
    const titleCounts = tasks.reduce((acc, task) => {
      acc[task.title] = (acc[task.title] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    for (const [title, count] of Object.entries(titleCounts)) {
      if (count > 1) {
        errors[title] = {
          message: 'Duplicate task title',
          type: 'duplicate'
        }
      }
    }

    // Validate dependencies
    for (const task of tasks) {
      if (!task.dependencies) continue
      
      for (const dep of task.dependencies) {
        if (!taskTitles.has(dep)) {
          errors[task.title] = {
            message: `Dependency "${dep}" not found`,
            type: 'dependency'
          }
        }
      }

      // Check for circular dependencies
      const circularCheck = validateCircularDependencies(tasks, task.title)
      if (!circularCheck.isValid) {
        errors[task.title] = {
          message: `Circular dependency detected: ${circularCheck.cycle?.join(' → ')}`,
          type: 'circular'
        }
      }
    }

    // Validate required fields and dates
    for (const task of tasks) {
      if (!task.title.trim()) {
        errors[task.title] = {
          message: 'Task title is required',
          type: 'required'
        }
      }

      if (task.start_date && task.due_date) {
        const start = new Date(task.start_date)
        const due = new Date(task.due_date)
        if (start > due) {
          errors[task.title] = {
            message: 'Start date must be before due date',
            type: 'date'
          }
        }
      }
    }

    setTaskErrors(errors)
    return Object.keys(errors).length === 0
  }, [validateCircularDependencies])

  const addTask = useCallback((task: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const newTask: TaskSchema = {
      title: task.title || '',
      description: task.description,
      status: task.status || 'todo' as TaskStatus,
      priority: task.priority || 'medium' as TaskPriority,
      dependencies: task.dependencies || [],
      order_index: task.order_index ?? currentTasks.length,
      project_id: task.project_id || '',
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      start_date: task.start_date,
      estimated_minutes: task.estimated_minutes,
      actual_minutes: task.actual_minutes,
      category: task.category,
      tags: task.tags,
      tax_form_type: task.tax_form_type,
      tax_year: task.tax_year,
      review_required: task.review_required,
      reviewer_id: task.reviewer_id,
      checklist_items: task.checklist_items || [],
      activity_log_entries: task.activity_log_entries || []
    }
    
    const updatedTasks = [...currentTasks, newTask]
    
    if (validateTaskDependencies(updatedTasks)) {
      form.setValue('tasks', updatedTasks)
      return true
    }
    
    return false
  }, [form, validateTaskDependencies])

  const removeTask = useCallback((taskTitle: string) => {
    const currentTasks = form.getValues('tasks') || []
    const updatedTasks = currentTasks
      .filter(t => t.title !== taskTitle)
      .map((t, index) => ({
        ...t,
        order_index: index,
        dependencies: t.dependencies?.filter(d => d !== taskTitle) || []
      }))
    
    form.setValue('tasks', updatedTasks)
    validateTaskDependencies(updatedTasks)
  }, [form, validateTaskDependencies])

  const updateTask = useCallback((taskTitle: string, updates: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const taskIndex = currentTasks.findIndex(t => t.title === taskTitle)
    
    if (taskIndex === -1) return false

    const updatedTasks = [...currentTasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      ...updates
    }

    if (validateTaskDependencies(updatedTasks)) {
      form.setValue('tasks', updatedTasks)
      return true
    }

    return false
  }, [form, validateTaskDependencies])

  const updateTaskOrder = useCallback((tasks: TaskSchema[]) => {
    const updatedTasks = tasks.map((task, index) => ({
      ...task,
      order_index: index
    }))
    
    form.setValue('tasks', updatedTasks)
    validateTaskDependencies(updatedTasks)
  }, [form, validateTaskDependencies])

  const getTaskMetadata = useCallback(() => {
    const tasks = form.getValues('tasks') || []
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalEstimatedTime = tasks.reduce((sum, t) => sum + (t.estimated_minutes || 0), 0)
    const totalActualTime = tasks.reduce((sum, t) => sum + (t.actual_minutes || 0), 0)
    
    const assigneeCounts = tasks.reduce((acc, task) => {
      if (task.assignee_id) {
        acc[task.assignee_id] = (acc[task.assignee_id] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const categoryCounts = tasks.reduce((acc, task) => {
      if (task.category) {
        acc[task.category] = (acc[task.category] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      totalEstimatedTime,
      totalActualTime,
      timeVariance: totalActualTime - totalEstimatedTime,
      assigneeCounts,
      categoryCounts,
      hasErrors: Object.keys(taskErrors).length > 0
    }
  }, [form, taskErrors])

  const optimizeTaskSequence = useCallback(async (tasks: Task[]) => {
    try {
      // Basic task optimization without external functions
      const sortedTasks = tasks.sort((a, b) => {
        // Sort tasks by priority and due date
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        
        if (priorityDiff !== 0) return priorityDiff
        
        const aDueDate = a.due_date ? new Date(a.due_date).getTime() : Infinity
        const bDueDate = b.due_date ? new Date(b.due_date).getTime() : Infinity
        
        return aDueDate - bDueDate
      })
      
      return {
        sequence: sortedTasks,
        allocation: null,
        estimatedCompletion: null
      }
    } catch (error) {
      console.error('Error optimizing tasks:', error)
      return {
        sequence: tasks,
        allocation: null,
        estimatedCompletion: null
      }
    }
  }, [])

  const createChecklistItem = useCallback(async (taskId: string, text: string) => {
    const { data, error } = await supabase
      .from('checklist_items')
      .insert({
        task_id: taskId,
        text,
        completed: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }, [supabase])

  const updateChecklistItem = useCallback(async (itemId: string, updates: Partial<DbChecklistItem>) => {
    const { data, error } = await supabase
      .from('checklist_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error
    return data
  }, [supabase])

  const deleteChecklistItem = useCallback(async (itemId: string) => {
    const { error } = await supabase
      .from('checklist_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
  }, [supabase])

  const addActivityLogEntry = useCallback(async (taskId: string, type: string, details: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('activity_log_entries')
      .insert({
        task_id: taskId,
        type,
        details
      })
      .select()
      .single()

    if (error) throw error
    return data
  }, [supabase])

  return {
    taskErrors,
    addTask,
    removeTask,
    updateTask,
    updateTaskOrder,
    validateTasks: () => validateTaskDependencies(form.getValues('tasks') || []),
    getTaskMetadata,
    optimizeTaskSequence,
    createChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    addActivityLogEntry
  }
}

```

### `src\hooks\useTaskValidation.ts`

```typescript
import { useState } from 'react';
import { type TaskSchema } from '@/lib/validations/project';

export type TaskDependencyError = Record<string, string>;

export const useTaskValidation = () => {
  const [taskDependencyErrors, setTaskDependencyErrors] = useState<TaskDependencyError>({});

  const detectCircularDependencies = (tasks: TaskSchema[], taskId: string, visited: Set<string>, path: string[]): boolean => {
    if (visited.has(taskId)) {
      if (path.includes(taskId)) {
        // Found a circular dependency
        const cycle = path.slice(path.indexOf(taskId));
        cycle.push(taskId);
        return true;
      }
      return false;
    }

    visited.add(taskId);
    path.push(taskId);

    const task = tasks.find(t => t.title === taskId);
    if (task?.dependencies) {
      for (const depId of task.dependencies) {
        if (detectCircularDependencies(tasks, depId, visited, path)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  };

  const validateTaskDependencies = (tasks: TaskSchema[] | undefined) => {
    if (!tasks || tasks.length === 0) return true;
    
    const errors: TaskDependencyError = {};
    
    tasks.forEach(task => {
      // Ensure dependencies is an array
      if (task.dependencies && !Array.isArray(task.dependencies)) {
        errors[task.title] = 'Dependencies must be an array';
        return;
      }

      // Validate dependency IDs exist in the task list
      if (task.dependencies) {
        const invalidDeps = task.dependencies.filter(dep => 
          !tasks.some(t => t.title === dep)
        );
        if (invalidDeps.length > 0) {
          errors[task.title] = `Invalid dependencies: ${invalidDeps.join(', ')}`;
          return;
        }

        // Check for circular dependencies
        const visited = new Set<string>();
        if (detectCircularDependencies(tasks, task.title, visited, [])) {
          errors[task.title] = 'Circular dependency detected';
          return;
        }
      }

      // Validate task order if provided
      if (task.order_index !== undefined) {
        const duplicateOrder = tasks.some(t => 
          t !== task && t.order_index === task.order_index
        );
        if (duplicateOrder) {
          errors[task.title] = 'Duplicate task order detected';
        }
      }
    });

    setTaskDependencyErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    taskDependencyErrors,
    validateTaskDependencies,
  };
};

```

### `src\hooks\useTasks.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { TaskWithRelations } from '@/types/tasks'

type DbTask = Database['public']['Tables']['tasks']['Row']
type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']
type DbChecklistItem = Database['public']['Tables']['checklist_items']['Row']
type DbActivityLogEntry = Database['public']['Tables']['activity_log_entries']['Row']

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch tasks
      const taskQuery = supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          assignee:users(*),
          parent_task:tasks!parent_task_id(*),
          template:task_templates(*)
        `)
        .order('created_at', { ascending: false })

      if (projectId) {
        taskQuery.eq('project_id', projectId)
      }

      const { data: taskData, error: taskError } = await taskQuery

      if (taskError) throw taskError

      // For each task, fetch related items
      const tasksWithRelations = await Promise.all((taskData || []).map(async (task) => {
        const [checklistItems, activityLogEntries] = await Promise.all([
          // Fetch checklist items
          supabase
            .from('checklist_items')
            .select('*')
            .eq('task_id', task.id)
            .then(({ data }) => data || []),

          // Fetch activity log entries
          supabase
            .from('activity_log_entries')
            .select('*')
            .eq('task_id', task.id)
            .order('created_at', { ascending: false })
            .then(({ data }) => data || [])
        ])

        return {
          ...task,
          checklist_items: checklistItems,
          activity_log_entries: activityLogEntries
        }
      }))

      setTasks(tasksWithRelations)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (taskData: DbTaskInsert) => {
    try {
      setError(null)
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single()

      if (taskError) throw taskError

      // Add initial activity log entry
      await supabase
        .from('activity_log_entries')
        .insert({
          task_id: task.id,
          action: 'created',
          details: { status: task.status }
        })

      await fetchTasks()
      return task
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create task'))
      throw err
    }
  }

  const updateTask = async (taskId: string, updates: DbTaskUpdate) => {
    try {
      setError(null)
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single()

      if (taskError) throw taskError

      // Add activity log entry
      await supabase
        .from('activity_log_entries')
        .insert({
          task_id: taskId,
          action: 'updated',
          details: { updates }
        })

      await fetchTasks()
      return task
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update task'))
      throw err
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      setError(null)
      // Delete related records first
      await Promise.all([
        supabase.from('checklist_items').delete().eq('task_id', taskId),
        supabase.from('activity_log_entries').delete().eq('task_id', taskId)
      ])

      // Then delete the task
      const { error: taskError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (taskError) throw taskError

      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete task'))
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  return {
    tasks,
    isLoading,
    error,
    mutate: fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}

```

### `src\hooks\useTaxProjectManagement.ts`

```typescript
'use client'

import { useState, useCallback } from 'react';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ProjectWithRelations, TaxReturnType } from '@/types/projects';

// Constants for tax deadlines
const TAX_DEADLINES = {
  '1040': {
    normal: '04-15',
    extended: '10-15'
  },
  '1120': {
    normal: '03-15',
    extended: '09-15'
  },
  '1065': {
    normal: '03-15',
    extended: '09-15'
  },
  '1120S': {
    normal: '03-15',
    extended: '09-15'
  }
};

const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

export function useTaxProjectManagement() {
  const [view, setView] = useState<'deadline' | 'return_type' | 'review_status'>('deadline');

  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = startOfDay(new Date());
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (isAfter(deadlineDate, today)) {
        return deadlineDate;
      }
    }
    
    // If all deadlines have passed, return first deadline of next year
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const groupProjectsByDeadline = useCallback((projects: ProjectWithRelations[]) => {
    const groups: Record<string, ProjectWithRelations[]> = {
      'Due This Week': [],
      'Due This Month': [],
      'Due Later': [],
      'Past Due': [],
    };

    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    const nextMonth = addDays(today, 30);

    projects.forEach(project => {
      if (!project.tax_info?.filing_deadline) return;

      const deadline = new Date(project.tax_info.filing_deadline);
      
      if (isBefore(deadline, today)) {
        groups['Past Due'].push(project);
      } else if (isBefore(deadline, nextWeek)) {
        groups['Due This Week'].push(project);
      } else if (isBefore(deadline, nextMonth)) {
        groups['Due This Month'].push(project);
      } else {
        groups['Due Later'].push(project);
      }
    });

    return groups;
  }, []);

  const groupProjectsByReturnType = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const returnType = project.tax_info?.return_type || 'Other';
      if (!groups[returnType]) {
        groups[returnType] = [];
      }
      groups[returnType].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByReviewStatus = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const status = project.tax_info?.review_status || 'Not Started';
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  return {
    view,
    setView,
    getDeadline,
    getNextEstimatedTaxDeadline,
    groupProjectsByDeadline,
    groupProjectsByReturnType,
    groupProjectsByReviewStatus,
  };
}

```

### `src\hooks\useTaxReturns.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TaxReturn } from '@/types/hooks'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from '@/components/ui/use-toast'

export function useTaxReturns(clientId?: string) {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchTaxReturns()
    } else {
      setTaxReturns([])
      setLoading(false)
    }
  }, [session, clientId])

  async function fetchTaxReturns() {
    try {
      let query = supabase
        .from('tax_returns')
        .select('*')
        .order('due_date', { ascending: true })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      setTaxReturns(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addTaxReturn({
    filing_type,
    status,
    tax_year,
    ...rest
  }: Omit<TaxReturn, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!filing_type || !status || tax_year === undefined) {
        throw new Error('Filing type, status, and tax year are required')
      }

      if (!session) {
        throw new Error('Please sign in to add tax returns')
      }

      const taxReturnData = {
        filing_type,
        status,
        tax_year: typeof tax_year === 'string' ? parseInt(tax_year, 10) : tax_year,
        ...rest,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .insert([{
          ...taxReturnData,
          filing_deadline: rest.filing_deadline,
          extension_filed: rest.extension_filed
        }])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => [data[0], ...prev])
        toast({
          title: 'Success',
          description: 'Tax return added successfully'
        })
        return data[0]
      }
      throw new Error('Failed to create tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function updateTaxReturn(
    id: number,
    updates: Partial<Omit<TaxReturn, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!session) {
        throw new Error('Please sign in to update tax returns')
      }

      const updateData = {
        ...updates,
        tax_year: updates.tax_year 
          ? (typeof updates.tax_year === 'string' ? parseInt(updates.tax_year, 10) : updates.tax_year)
          : undefined,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => prev.map(taxReturn => 
          taxReturn.id === id ? data[0] : taxReturn
        ))
        toast({
          title: 'Success',
          description: 'Tax return updated successfully'
        })
        return data[0]
      }
      throw new Error('Failed to update tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function deleteTaxReturn(id: number) {
    try {
      if (!session) {
        throw new Error('Please sign in to delete tax returns')
      }

      const { error } = await supabase
        .from('tax_returns')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTaxReturns(prev => prev.filter(taxReturn => taxReturn.id !== id))
      toast({
        title: 'Success',
        description: 'Tax return deleted successfully'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  return {
    taxReturns,
    loading,
    error,
    addTaxReturn,
    updateTaxReturn,
    deleteTaxReturn,
    refresh: fetchTaxReturns
  }
}

```

### `src\hooks\useTemplateTasks.ts`

```typescript
import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from 'src/lib/supabase/supabase-provider'
import { TemplateTask } from 'src/types/hooks'

export function useTemplateTasks(templateId: string) {
  const { supabase } = useSupabase()
  const [tasks, setTasks] = useState<TemplateTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('template_tasks')
        .select('*')
        .eq('template_id', templateId)
        .order('order_index', { ascending: true })

      if (error) throw error

      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch template tasks'))
    } finally {
      setLoading(false)
    }
  }, [supabase, templateId])

  const createTask = useCallback(async (task: Omit<TemplateTask, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .insert(task)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => [...prev, data])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template task')
    }
  }, [supabase])

  const updateTask = useCallback(async (id: string, updates: Partial<TemplateTask>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template task')
    }
  }, [supabase])

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('template_tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template task')
    }
  }, [supabase])

  const reorderTask = useCallback(async (taskId: string, newOrderIndex: number) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .update({ order_index: newOrderIndex })
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error

      await fetchTasks() // Refresh the list to get the correct order
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to reorder template task')
    }
  }, [supabase, fetchTasks])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    refreshTasks: fetchTasks,
  }
}

```

### `src\hooks\useTimeEntries.ts`

```typescript
import { useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { TimeEntry, TimeEntryWithRelations } from '@/types/hooks'
import { Task, TaskWithRelations } from '@/types/tasks'
import { Project, ProjectWithRelations } from '@/types/hooks'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const useTimeEntries = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

  const fetchTimeEntries = useCallback(async (
    filters?: {
      userId?: string
      taskId?: string
      projectId?: string
      startDate?: string
      endDate?: string
      billable?: boolean
    }
  ) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('time_entries')
        .select(`
          *,
          task:tasks(*),
          project:projects(*),
          user:users(*)
        `)

      if (filters?.userId) query = query.eq('user_id', filters.userId)
      if (filters?.taskId) query = query.eq('task_id', filters.taskId)
      if (filters?.projectId) query = query.eq('project_id', filters.projectId)
      if (filters?.startDate) query = query.gte('start_time', filters.startDate)
      if (filters?.endDate) query = query.lte('end_time', filters.endDate)
      if (filters?.billable !== undefined) query = query.eq('billable', filters.billable)

      const { data, error } = await query

      if (error) throw error

      setTimeEntries(data as TimeEntryWithRelations[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const startTimeEntry = useCallback(async (
    entryData: {
      task_id?: string
      project_id?: string
      description?: string
      billable?: boolean
    }
  ) => {
    setLoading(true)
    setError(null)

    try {
      // Check for any active time entry
      const { data } = await supabase
        .from('time_entries')
        .select('*')
        .is('end_time', null)

      const active = data?.find(entry => entry.start_time && !entry.end_time)

      if (active) {
        throw new Error('An active time entry already exists. Please stop it first.')
      }

      const { data: userData } = await supabase.auth.getUser()

      const { data: newEntry, error } = await supabase
        .from('time_entries')
        .insert({
          ...entryData,
          start_time: new Date().toISOString(),
          end_time: null,
          user_id: userData.user?.id
        })
        .select()

      if (error) throw error

      setTimeEntries(prev => [...prev, newEntry[0]])
      return newEntry[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const stopTimeEntry = useCallback(async (entryId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({ 
          end_time: new Date().toISOString() 
        })
        .eq('id', entryId)
        .select()

      if (error) throw error

      setTimeEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, end_time: data[0].end_time } 
            : entry
        )
      )

      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const deleteTimeEntry = useCallback(async (entryId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', entryId)

      if (error) throw error

      setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    timeEntries,
    loading,
    error,
    fetchTimeEntries,
    startTimeEntry,
    stopTimeEntry,
    deleteTimeEntry,
    setTimeEntries
  }
}

```

### `src\hooks\useUsers.ts`

```typescript
import { useState, useCallback } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { DbUser, DbUserInsert, DbUserUpdate, UserWithRelations } from '@/types/users'

export function useUsers() {
  const supabase = useSupabase()
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createUser = useCallback(async (userData: DbUserInsert) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      if (data) setUsers(prev => [...prev, data[0]])
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create user'))
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const updateUser = useCallback(async (userId: string, updates: DbUserUpdate) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      if (data) {
        setUsers(prev => 
          prev.map(user => user.id === userId ? { ...user, ...data[0] } : user)
        )
      }
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'))
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete user'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}

```

### `src\hooks\useWorkflows.ts`

```typescript
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { 
  DbWorkflowTemplate,
  DbWorkflowTemplateInsert,
  WorkflowTemplateWithRelations,
  WorkflowStep,
  WorkflowStatus,
  WORKFLOW_STATUS
} from '@/types/workflows'

interface CreateWorkflowRequest {
  name: string
  description?: string | null
  steps: WorkflowStep[]
}

interface UseWorkflowsOptions {
  initialFilters?: {
    status?: WorkflowStatus
    search?: string
  }
  pageSize?: number
}

export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const [workflows, setWorkflows] = useState<WorkflowTemplateWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState(options.initialFilters || {})
  const [page, setPage] = useState(1)
  const [pageSize] = useState(options.pageSize || 10)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchWorkflows()
  }, [filters, page, pageSize])

  async function fetchWorkflows() {
    try {
      let query = supabase
        .from('workflow_templates')
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      // Execute query
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setWorkflows(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching workflows:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'))
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }

  async function createWorkflow(workflowData: CreateWorkflowRequest): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: createError } = await supabase
        .from('workflow_templates')
        .insert({
          name: workflowData.name,
          description: workflowData.description,
          steps: workflowData.steps
        } satisfies DbWorkflowTemplateInsert)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (createError) throw createError

      setWorkflows(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to create workflow')
      }
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<DbWorkflowTemplate>
  ): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: updateError } = await supabase
        .from('workflow_templates')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (updateError) throw updateError

      setWorkflows(prev =>
        prev.map(workflow =>
          workflow.id === id ? data : workflow
        )
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to update workflow')
      }
    }
  }

  async function deleteWorkflow(id: number): Promise<{ error: Error | null }> {
    try {
      const { error: deleteError } = await supabase
        .from('workflow_templates')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting workflow:', err)
      return { 
        error: err instanceof Error ? err : new Error('Failed to delete workflow')
      }
    }
  }

  return {
    workflows,
    loading,
    error,
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  }
}

```

### `src\types\auth.ts`

```typescript
import { Database } from './database.types'

// Use database types for user role
export type UserRole = Database['public']['Enums']['user_role']

// Use database types for user
export type User = {
  id: string
  email: string
  role: UserRole
  full_name?: string | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

// Strongly type the session
export type Session = {
  user: User
  expires_at: number
  access_token?: string
  refresh_token?: string
}

// Auth state with proper error typing
export type AuthState = {
  session: Session | null
  loading: boolean
  error: AuthError | null
}

// Form data with validation
export type SignInFormData = {
  email: string
  password: string
}

export type SignUpFormData = {
  email: string
  password: string
  full_name: string
  role: UserRole
}

// Type guard for checking if user is authenticated
export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && 
         typeof session.user === 'object' && 
         typeof session.user.id === 'string' &&
         typeof session.user.email === 'string' &&
         typeof session.expires_at === 'number' &&
         session.expires_at > Date.now() / 1000
}

// Type guard for checking user role
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role
}

// Error types
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Session has expired')
    this.name = 'SessionExpiredError'
  }
}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('Unauthorized access')
    this.name = 'UnauthorizedError'
  }
}

// Auth guard type
export type AuthGuard = {
  requireAuth: boolean
  allowedRoles?: UserRole[]
} 
```

### `src\types\clients.ts`

```typescript
import type { Database } from './database.types'
import type { Json } from './database.types'
import { z } from 'zod'
import { clientFormSchema } from '@/lib/validations/client'

// Database types
export type DbClient = Database['public']['Tables']['clients']['Row']
export type DbClientInsert = Database['public']['Tables']['clients']['Insert']
export type DbClientUpdate = Database['public']['Tables']['clients']['Update']
export type DbClientContactDetails = Database['public']['Tables']['client_contact_details']['Row']

// Enums from database
export type ClientStatus = Database['public']['Enums']['client_status']
export type ClientType = Database['public']['Enums']['client_type']
export type FilingType = Database['public']['Enums']['filing_type']

export interface Dependent {
  name: string
  ssn?: string | null
  relationship?: string | null
  birth_date?: string | null
}

export interface PreviousReturn {
  year: number
  filed_date: string
  preparer?: string | null
  notes?: string | null
}

export interface TaxInfo {
  filing_status?: string | null
  tax_id?: string | null
  tax_year?: number | null
  last_filed_date?: string | null
  filing_type?: FilingType | null
  tax_id_type?: 'ssn' | 'ein' | null
  dependents?: Dependent[] | null
  previous_returns?: PreviousReturn[] | null
}

// Form data type that matches our schema
export type ClientFormData = z.infer<typeof clientFormSchema>

// Enhanced client type with relationships
export interface ClientWithRelations extends Omit<DbClient, 'tax_info'> {
  tax_info: TaxInfo | null
  contact_details?: DbClientContactDetails | null
  documents?: Database['public']['Tables']['client_documents']['Row'][]
  workflows?: Database['public']['Tables']['client_onboarding_workflows']['Row'][]
  assigned_preparer?: Database['public']['Tables']['users']['Row'] | null
  tax_returns?: Database['public']['Tables']['tax_returns']['Row'][]
  projects?: Database['public']['Tables']['projects']['Row'][]
}

export function isTaxInfo(value: unknown): value is TaxInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('filing_status' in value) || typeof value.filing_status === 'string' || value.filing_status === null) &&
    (!('tax_id' in value) || typeof value.tax_id === 'string' || value.tax_id === null) &&
    (!('tax_year' in value) || typeof value.tax_year === 'number' || value.tax_year === null)
}

export function isDbClient(client: unknown): client is DbClient {
  return client !== null &&
    typeof client === 'object' &&
    'id' in client &&
    'contact_email' in client &&
    'status' in client
}

// Conversion utilities
export function toClientFormData(client: DbClient): ClientFormData {
  const {
    created_at,
    updated_at,
    ...formData
  } = client
  
  const taxInfo = isTaxInfo(client.tax_info) ? client.tax_info : null

  return {
    ...formData,
    tax_info: taxInfo,
  } as ClientFormData
}

export function toDbClient(formData: ClientFormData): Omit<DbClientInsert, 'id'> {
  const {
    id, // Exclude id as it's handled by the database
    tax_info,
    ...rest
  } = formData

  // Ensure all required fields are present with defaults
  const dbClient: Omit<DbClientInsert, 'id'> = {
    ...rest,
    contact_email: rest.contact_email,
    status: rest.status,
    tax_info: tax_info as Json,
    // Add any other required fields with defaults
    type: rest.type || null,
    accounting_method: rest.accounting_method || null,
    business_type: rest.business_type || null,
    company_name: rest.company_name || null,
    document_deadline: rest.document_deadline || null,
    fiscal_year_end: rest.fiscal_year_end || null,
    industry_code: rest.industry_code || null,
    last_contact_date: rest.last_contact_date || null,
    last_filed_date: rest.last_filed_date || null,
    next_appointment: rest.next_appointment || null,
    primary_contact_name: rest.primary_contact_name || null,
    tax_id: rest.tax_id || null,
    tax_return_status: rest.tax_return_status || null,
    user_id: rest.user_id || null,
    assigned_preparer_id: rest.assigned_preparer_id || null,
  }

  return dbClient
}

// Constants
export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived',
} as const satisfies Record<string, ClientStatus>

export const CLIENT_TYPE = {
  BUSINESS: 'business',
  INDIVIDUAL: 'individual',
} as const satisfies Record<string, ClientType>

// Helper functions for type checking
export function isValidClientStatus(status: string): status is ClientStatus {
  return Object.values(CLIENT_STATUS).includes(status as ClientStatus)
}

export function isValidClientType(type: string): type is ClientType {
  return Object.values(CLIENT_TYPE).includes(type as ClientType)
}

// Helper function for null safety
export function ensureNullable<T>(value: T | undefined): T | null {
  return value === undefined ? null : value
}
```

### `src\types\database.types.ts`

```typescript
﻿export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log_entries: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          task_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          completed: boolean
          created_at: string | null
          description: string | null
          id: string
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contact_details: {
        Row: {
          address: string | null
          city: string | null
          client_id: string
          created_at: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contact_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_name: string
          document_type: string
          id: string
          reminder_sent: boolean | null
          status: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_name: string
          document_type: string
          id?: string
          reminder_sent?: boolean | null
          status: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_name?: string
          document_type?: string
          id?: string
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          accounting_method: string | null
          address: string | null
          assigned_preparer_id: string | null
          business_tax_id: string | null
          business_type: string | null
          city: string | null
          company_name: string | null
          contact_email: string
          created_at: string | null
          document_deadline: string | null
          email: string | null
          filing_status: string | null
          fiscal_year_end: string | null
          full_name: string | null
          id: string
          individual_tax_id: string | null
          industry_code: string | null
          last_contact_date: string | null
          last_filed_date: string | null
          next_appointment: string | null
          notes: string | null
          phone: string | null
          primary_contact_name: string | null
          state: string | null
          status: Database["public"]["Enums"]["client_status"]
          tax_id: string | null
          tax_info: Json
          tax_return_status: string | null
          tax_year: number | null
          type: Database["public"]["Enums"]["client_type"] | null
          updated_at: string | null
          user_id: string | null
          zip: string | null
        }
        Insert: {
          accounting_method?: string | null
          address?: string | null
          assigned_preparer_id?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_email: string
          created_at?: string | null
          document_deadline?: string | null
          email?: string | null
          filing_status?: string | null
          fiscal_year_end?: string | null
          full_name?: string | null
          id: string
          individual_tax_id?: string | null
          industry_code?: string | null
          last_contact_date?: string | null
          last_filed_date?: string | null
          next_appointment?: string | null
          notes?: string | null
          phone?: string | null
          primary_contact_name?: string | null
          state?: string | null
          status: Database["public"]["Enums"]["client_status"]
          tax_id?: string | null
          tax_info?: Json
          tax_return_status?: string | null
          tax_year?: number | null
          type?: Database["public"]["Enums"]["client_type"] | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          accounting_method?: string | null
          address?: string | null
          assigned_preparer_id?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_email?: string
          created_at?: string | null
          document_deadline?: string | null
          email?: string | null
          filing_status?: string | null
          fiscal_year_end?: string | null
          full_name?: string | null
          id?: string
          individual_tax_id?: string | null
          industry_code?: string | null
          last_contact_date?: string | null
          last_filed_date?: string | null
          next_appointment?: string | null
          notes?: string | null
          phone?: string | null
          primary_contact_name?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tax_id?: string | null
          tax_info?: Json
          tax_return_status?: string | null
          tax_year?: number | null
          type?: Database["public"]["Enums"]["client_type"] | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      document_tracking: {
        Row: {
          document_name: string | null
          due_date: string | null
          id: string
          project_id: string | null
          reminder_sent: boolean | null
          status: string | null
        }
        Insert: {
          document_name?: string | null
          due_date?: string | null
          id: string
          project_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
        }
        Update: {
          document_name?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      individuals: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          tax_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          tax_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          tax_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          client_id: string | null
          content: string
          created_at: string | null
          id: string
          project_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          sent_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          sent_at?: string | null
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          sent_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      owners: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          individual_id: string | null
          ownership_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          individual_id?: string | null
          ownership_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          individual_id?: string | null
          ownership_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owners_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_services: {
        Row: {
          client_id: string | null
          created_at: string | null
          frequency: string
          id: string
          last_processed_date: string | null
          next_due_date: string | null
          progress: string | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          frequency: string
          id?: string
          last_processed_date?: string | null
          next_due_date?: string | null
          progress?: string | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          frequency?: string
          id?: string
          last_processed_date?: string | null
          next_due_date?: string | null
          progress?: string | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_team_members: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          category_id?: string | null
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          project_defaults?: Json | null
          recurring_schedule?: string | null
          seasonal_priority?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          project_defaults?: Json | null
          recurring_schedule?: string | null
          seasonal_priority?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accounting_info: Json | null
          client_id: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          end_date: string | null
          id: string
          name: string
          parent_project_id: string | null
          payroll_info: Json | null
          primary_manager: string | null
          priority: string
          service_info: Json | null
          service_type: string | null
          stage: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          task_count: number | null
          tax_info: Json | null
          tax_return_id: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          primary_manager?: string | null
          priority?: string
          service_info?: Json | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status: Database["public"]["Enums"]["project_status"]
          task_count?: number | null
          tax_info?: Json | null
          tax_return_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name?: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          primary_manager?: string | null
          priority?: string
          service_info?: Json | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          task_count?: number | null
          tax_info?: Json | null
          tax_return_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_tax_return"
            columns: ["tax_return_id"]
            isOneToOne: false
            referencedRelation: "tax_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_primary_manager_fkey"
            columns: ["primary_manager"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_primary_manager_fkey"
            columns: ["primary_manager"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          depends_on: string | null
          task_id: string | null
        }
        Insert: {
          depends_on?: string | null
          task_id?: string | null
        }
        Update: {
          depends_on?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_fkey"
            columns: ["depends_on"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          checklist: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          priority: string | null
          updated_at: string | null
        }
        Insert: {
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          priority?: string | null
          updated_at?: string | null
        }
        Update: {
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          priority?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_team: string[] | null
          assignee_id: string | null
          category: string | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          parent_task_id: string | null
          priority: string | null
          progress: number | null
          project_id: string | null
          recurring_config: Json | null
          start_date: string | null
          status: string
          tax_form_type: string | null
          tax_return_id: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          recurring_config?: Json | null
          start_date?: string | null
          status?: string
          tax_form_type?: string | null
          tax_return_id?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          recurring_config?: Json | null
          start_date?: string | null
          status?: string
          tax_form_type?: string | null
          tax_return_id?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_parent_task_id"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_returns: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          due_date: string | null
          extension_date: string | null
          filed_date: string | null
          filing_type: string
          id: string
          notes: string | null
          status: string
          tax_year: number
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          extension_date?: string | null
          filed_date?: string | null
          filing_type: string
          id?: string
          notes?: string | null
          status: string
          tax_year: number
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          extension_date?: string | null
          filed_date?: string | null
          filing_type?: string
          id?: string
          notes?: string | null
          status?: string
          tax_year?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          position: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      template_tasks: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          id: string
          order_index: number | null
          priority: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          order_index?: number | null
          priority?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          order_index?: number | null
          priority?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_template_tasks_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          projects_managed: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          projects_managed?: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          projects_managed?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          steps: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          steps: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          steps?: Json
        }
        Relationships: []
      }
    }
    Views: {
      project_dashboard: {
        Row: {
          assigned_team_members: string | null
          client_name: string | null
          company_name: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          due_date: string | null
          id: string | null
          name: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          total_tasks: number | null
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          completed_tasks: number | null
          completion_percentage: number | null
          project_id: string | null
          project_name: string | null
          project_status: Database["public"]["Enums"]["project_status"] | null
          total_tasks: number | null
        }
        Relationships: []
      }
      user_task_load: {
        Row: {
          completed_tasks: number | null
          full_name: string | null
          in_progress_tasks: number | null
          overdue_tasks: number | null
          total_tasks: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      archive_project: {
        Args: {
          project_id: string
        }
        Returns: undefined
      }
      are_dependencies_completed: {
        Args: {
          task_id: string
        }
        Returns: boolean
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      clone_project_template: {
        Args: {
          template_id: string
          new_client_id: string
          new_tax_year: number
        }
        Returns: string
      }
      commit_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_project_tasks: {
        Args: {
          p_project_id: string
          p_template_id: string
        }
        Returns: undefined
      }
      create_template_category: {
        Args: {
          p_name: string
          p_description: string
        }
        Returns: string
      }
      create_template_with_tasks: {
        Args: {
          title: string
          description: string
          default_priority: Database["public"]["Enums"]["task_priority"]
          project_defaults: Json
          template_category_id: string
          metadata: Json
          tasks: Json
        }
        Returns: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
      }
      delete_data: {
        Args: {
          table_name: string
          condition: string
        }
        Returns: string
      }
      delete_template_category: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      exec_sql: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      execute_ddl: {
        Args: {
          ddl_command: string
        }
        Returns: string
      }
      execute_dml: {
        Args: {
          dml_command: string
        }
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_project_tasks: {
        Args: {
          project_id: string
        }
        Returns: {
          id: string
          title: string
          status: string
          priority: string
          due_date: string
          assignee_id: string
        }[]
      }
      get_workspace_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      insert_data: {
        Args: {
          target_table: string
          data: Json
        }
        Returns: string
      }
      is_authenticated_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      lca: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      lquery_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree2text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltxtq_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      manage_constraint: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_index: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_rls: {
        Args: {
          table_name: string
          enable: boolean
        }
        Returns: string
      }
      manage_table: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_template_category: {
        Args: {
          p_action: string
          p_id?: string
          p_name?: string
          p_description?: string
        }
        Returns: Json
      }
      nlevel: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      rollback_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      text2ltree: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      update_data: {
        Args: {
          table_name: string
          data: Json
          condition: string
        }
        Returns: string
      }
      update_template_category: {
        Args: {
          p_id: string
          p_name: string
          p_description: string
        }
        Returns: boolean
      }
      update_template_with_tasks: {
        Args: {
          template_id: string
          title: string
          description: string
          default_priority: Database["public"]["Enums"]["task_priority"]
          project_defaults: Json
          template_category_id: string
          metadata: Json
          tasks: Json
        }
        Returns: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
      }
      validate_json_data: {
        Args: {
          data: Json
        }
        Returns: boolean
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      client_status: "active" | "inactive" | "pending" | "archived"
      client_type: "business" | "individual"
      document_status: "pending" | "uploaded" | "verified" | "rejected"
      filing_type:
        | "individual"
        | "business"
        | "partnership"
        | "corporation"
        | "s_corporation"
        | "non_profit"
      priority_level: "low" | "medium" | "high" | "urgent"
      project_status:
        | "not_started"
        | "on_hold"
        | "cancelled"
        | "todo"
        | "in_progress"
        | "review"
        | "blocked"
        | "completed"
        | "archived"
      service_type: "tax_return" | "bookkeeping" | "payroll" | "advisory"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "review" | "completed"
      tax_return_status:
        | "not_started"
        | "gathering_documents"
        | "in_progress"
        | "review"
        | "filed"
        | "amended"
      user_role: "admin" | "team_member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

```

### `src\types\documents.ts`

```typescript
export type Document = {
  id?: string
  project_id?: string
  title: string
  file_path: string
  uploaded_at?: string
  description?: string
  tags?: string[]
  category?: string
} 
```

### `src\types\hooks.ts`

```typescript
import { Project, ProjectTemplate, ProjectFormValues } from './projects'
import { Task, TaskStatus, ReviewStatus } from './tasks'
import { Client } from './clients'
import { Database } from './database.types'

// Re-export database enums
export type ProjectStatus = Database['public']['Enums']['project_status']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type ClientStatus = Database['public']['Enums']['client_status']
export type ClientType = Database['public']['Enums']['client_type']
export type ServiceType = Database['public']['Enums']['service_type']

// Re-export all types to ensure they are available
export type {
  Project,
  ProjectTemplate,
  ProjectFormValues,
  Task,
  TaskStatus,
  ReviewStatus,
  Client,
  Database
}

export type WorkflowTemplate = {
  id: string
  name: string
  description?: string | null
  steps: Array<{
    title: string
    description?: string
    status?: 'pending' | 'in_progress' | 'completed'
  }>
  created_at?: string | null
}

export type TemplateTask = {
  id: string
  title: string
  description: string
  order_index: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  template_id: string
  dependencies: string[]
  created_at: string
  updated_at: string
}

export type TaxReturn = {
  id?: string
  project_id?: string
  tax_year: number
  filing_type?: string
  status?: string
  filing_deadline?: string
  extension_filed?: boolean
  created_at?: string
  updated_at?: string
}

export type WorkflowStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type WorkflowTask = Task & { workflow_id?: string }

export type ClientOnboardingWorkflow = Database['public']['Tables']['client_onboarding_workflows']['Row'] & {
  steps?: Array<{
    title: string
    description?: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
}

export type Document = Database['public']['Tables']['client_documents']['Row'] & {
  project?: Database['public']['Tables']['projects']['Row'] | null
  client?: Database['public']['Tables']['clients']['Row'] | null
}

export type DocumentFormData = Omit<Document, 'id' | 'uploaded_at'>

export type Note = Database['public']['Tables']['notes']['Row']

export type PayrollService = Database['public']['Tables']['payroll_services']['Row']

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type ServiceCategory = 'tax_returns' | 'payroll' | 'accounting' | 'tax_planning' | 'compliance' | 'uncategorized'

export type ProjectFilters = {
  search?: string
  service?: string[]
  serviceType?: string[]
  service_category?: string[]
  status?: string[]
  priority?: string[]
  dateRange?: { from: string; to: string }
  dueDateRange?: { from: Date; to: Date }
  clientId?: string
  teamMemberId?: string
  tags?: string[]
  hasDocuments?: boolean
  hasNotes?: boolean
  hasTimeEntries?: boolean
  returnType?: string[]
  reviewStatus?: string[]
  dueThisWeek?: boolean
  dueThisMonth?: boolean
  dueThisQuarter?: boolean
}

export type ProjectAnalytics = {
  completionRate: number
  riskLevel: string
  predictedDelay: number
  resourceUtilization: number
  recommendations: string[]
}

```

### `src\types\notes.ts`

```typescript
export type Note = {
  id?: string
  project_id?: string
  content: string
  created_at?: string
  updated_at?: string
  author_id?: string
  tags?: string[]
  category?: string
} 
```

### `src\types\projects.ts`

```typescript
import { Database } from './database.types';
import type { Json } from './database.types';
import { z } from 'zod';
import { projectSchema } from '@/lib/validations/project';

// Database types
export type DbProject = Database['public']['Tables']['projects']['Row'];
export type DbProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DbProjectUpdate = Database['public']['Tables']['projects']['Update'];

// Enums from database
export type ProjectStatus = Database['public']['Enums']['project_status'];
export type ServiceType = Database['public']['Enums']['service_type'];
export type TaskPriority = Database['public']['Enums']['task_priority'];

// Strongly typed JSON fields
export interface TaxInfo {
  return_type?: Database['public']['Enums']['filing_type']
  filing_status?: string
  tax_year?: number
  due_date?: string
  extension_date?: string
  estimated_refund?: number
  estimated_liability?: number
  notes?: string
}

export interface AccountingInfo {
  period_start?: string
  period_end?: string
  accounting_method?: 'cash' | 'accrual'
  fiscal_year_end?: string
  last_reconciliation_date?: string
  chart_of_accounts_setup?: boolean
  software_used?: string
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  notes?: string
}

export interface PayrollInfo {
  payroll_schedule?: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'
  employee_count?: number
  last_payroll_date?: string
  next_payroll_date?: string
  payroll_provider?: string
  notes?: string
}

export interface ServiceInfo {
  service_category?: string
  frequency?: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  last_service_date?: string
  next_service_date?: string
  special_instructions?: string
  notes?: string
}

// Form data type that matches our schema
export type ProjectFormData = z.infer<typeof projectSchema>;

// Enhanced project type with relationships and strongly typed JSON fields
export interface ProjectWithRelations extends Omit<DbProject, 'tax_info' | 'accounting_info' | 'payroll_info' | 'service_info'> {
  tax_info: TaxInfo | null
  accounting_info: AccountingInfo | null
  payroll_info: PayrollInfo | null
  service_info: ServiceInfo | null
  client?: Database['public']['Tables']['clients']['Row'] | null
  template?: Database['public']['Tables']['project_templates']['Row'] | null
  tasks?: Database['public']['Tables']['tasks']['Row'][]
  team_members?: Database['public']['Tables']['project_team_members']['Row'][]
  primary_manager_details?: Database['public']['Tables']['users']['Row'] | null
}

// Type guards
export function isTaxInfo(value: unknown): value is TaxInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('tax_year' in value) || typeof value.tax_year === 'number') &&
    (!('estimated_refund' in value) || typeof value.estimated_refund === 'number') &&
    (!('estimated_liability' in value) || typeof value.estimated_liability === 'number')
}

export function isAccountingInfo(value: unknown): value is AccountingInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('chart_of_accounts_setup' in value) || typeof value.chart_of_accounts_setup === 'boolean') &&
    (!('accounting_method' in value) || ['cash', 'accrual'].includes(value.accounting_method as string))
}

export function isPayrollInfo(value: unknown): value is PayrollInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('employee_count' in value) || typeof value.employee_count === 'number') &&
    (!('payroll_schedule' in value) || ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'].includes(value.payroll_schedule as string))
}

export function isServiceInfo(value: unknown): value is ServiceInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('frequency' in value) || ['one-time', 'weekly', 'monthly', 'quarterly', 'annually'].includes(value.frequency as string))
}

export function isDbProject(project: unknown): project is DbProject {
  return project !== null &&
    typeof project === 'object' &&
    'id' in project &&
    'name' in project &&
    'status' in project
}

// Conversion utilities
export function toProjectFormData(project: DbProject): Omit<ProjectFormData, 'service_type' | 'priority'> & {
  service_type?: ServiceType | null
  priority?: TaskPriority | null
} {
  const {
    id,
    created_at,
    updated_at,
    priority,
    service_type,
    ...formData
  } = project
  
  return {
    ...formData,
    priority: priority as TaskPriority,
    service_type: service_type as ServiceType,
    tax_info: isTaxInfo(project.tax_info) ? project.tax_info : null,
    accounting_info: isAccountingInfo(project.accounting_info) ? project.accounting_info : null,
    payroll_info: isPayrollInfo(project.payroll_info) ? project.payroll_info : null,
    service_info: isServiceInfo(project.service_info) ? project.service_info : null,
  }
}

export function toDbProject(formData: ProjectFormData): DbProjectInsert {
  const {
    tax_info,
    accounting_info,
    payroll_info,
    service_info,
    ...rest
  } = formData

  return {
    ...rest,
    name: rest.name || '',
    status: rest.status || 'not_started',
    tax_info: tax_info as Json,
    accounting_info: accounting_info as Json,
    payroll_info: payroll_info as Json,
    service_info: service_info as Json,
  }
}

// Constants
export const PROJECT_STATUS = {
  NOT_STARTED: 'not_started',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const satisfies Record<string, ProjectStatus>

export const SERVICE_TYPE = {
  TAX_RETURN: 'tax_return',
  BOOKKEEPING: 'bookkeeping',
  PAYROLL: 'payroll',
  ADVISORY: 'advisory',
} as const satisfies Record<string, ServiceType>

// Helper functions for type checking
export function isValidProjectStatus(status: string): status is ProjectStatus {
  return Object.values(PROJECT_STATUS).includes(status as ProjectStatus)
}

export function isValidServiceType(type: string): type is ServiceType {
  return Object.values(SERVICE_TYPE).includes(type as ServiceType)
}

```

### `src\types\tasks.ts`

```typescript
import type { Database } from './database.types'
import { z } from 'zod'
import { taskSchema } from '@/lib/validations/task'

// Database types
export type DbTask = Database['public']['Tables']['tasks']['Row']
export type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
export type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']

// Enums from database
export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']

// Relational table types
export type DbChecklistItem = Database['public']['Tables']['checklist_items']['Row']
export type DbActivityLogEntry = Database['public']['Tables']['activity_log_entries']['Row']

export type RecurringConfig = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  end_date?: string
  end_occurrences?: number
}

// Form data type that matches our schema
export type TaskFormValues = z.infer<typeof taskSchema>
export type TaskFormData = TaskFormValues
export type TaskUpdate = Partial<TaskFormValues> & { id: string }

// Task type for general use
export type Task = TaskWithRelations

// Enhanced task type with relationships using relational tables
export type TaskWithRelations = DbTask & {
  checklist_items?: DbChecklistItem[]
  activity_log_entries?: DbActivityLogEntry[]
  recurring_config: RecurringConfig | null
  project?: Database['public']['Tables']['projects']['Row'] | null
  assignee?: Database['public']['Tables']['users']['Row'] | null
  parent_task?: DbTask | null
  subtasks?: DbTask[]
  dependencies?: DbTask[]
  template?: Database['public']['Tables']['task_templates']['Row'] | null
}

// Constants
export const taskStatusOptions: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed']
export const taskPriorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

// Type guards
export function isDbTask(task: unknown): task is DbTask {
  return task !== null &&
    typeof task === 'object' &&
    'id' in task &&
    'title' in task &&
    'status' in task
}

// Conversion utilities
export function toTaskFormValues(task: DbTask): TaskFormValues {
  const {
    id,
    created_at,
    updated_at,
    ...formData
  } = task
  
  return {
    ...formData,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority | undefined,
    recurring_config: task.recurring_config as RecurringConfig | null,
  }
}

```

### `src\types\templates.ts`

```typescript
import type { Database } from './database.types'
import { z } from 'zod'
import { projectTemplateSchema, templateTaskSchema } from '@/lib/validations/template'

// Database types
export type DbProjectTemplate = Database['public']['Tables']['project_templates']['Row']
export type DbProjectTemplateInsert = Database['public']['Tables']['project_templates']['Insert']
export type DbProjectTemplateUpdate = Database['public']['Tables']['project_templates']['Update']

export type DbTemplateTask = Database['public']['Tables']['template_tasks']['Row']
export type DbTemplateTaskInsert = Database['public']['Tables']['template_tasks']['Insert']
export type DbTemplateTaskUpdate = Database['public']['Tables']['template_tasks']['Update']

// JSON field types from database
export type ProjectDefaults = NonNullable<DbProjectTemplate['project_defaults']>
export type SeasonalPriority = NonNullable<DbProjectTemplate['seasonal_priority']>

// Form data types
export type ProjectTemplateFormData = z.infer<typeof projectTemplateSchema>
export type TemplateTaskFormData = z.infer<typeof templateTaskSchema>

// Types with relationships
export interface ProjectTemplateWithRelations extends DbProjectTemplate {
  tasks?: DbTemplateTask[]
  category?: Database['public']['Tables']['template_categories']['Row'] | null
}

export interface TemplateTaskWithRelations extends DbTemplateTask {
  template?: DbProjectTemplate | null
  dependencies?: DbTemplateTask[]
}

// Template category types
export type DbTemplateCategory = Database['public']['Tables']['template_categories']['Row']
export type DbTemplateCategoryInsert = Database['public']['Tables']['template_categories']['Insert']
export type DbTemplateCategoryUpdate = Database['public']['Tables']['template_categories']['Update']

export interface TemplateCategoryWithRelations extends DbTemplateCategory {
  templates?: DbProjectTemplate[]
  parent?: DbTemplateCategory | null
  children?: DbTemplateCategory[]
} 
```

### `src\types\time_entries.ts`

```typescript
export type TimeEntry = {
  id?: string
  project_id?: string
  task_id?: string
  user_id?: string
  start_time: string
  end_time?: string
  duration?: number
  description?: string
  billable?: boolean
  hourly_rate?: number
  tags?: string[]
} 
```

### `src\types\users.ts`

```typescript
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
```

### `src\types\validation.ts`

```typescript
import { z } from 'zod'
import type { Database } from './database.types'

type DbEnums = Database['public']['Enums']

// Contact Info Schema
export const contactInfoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
})

// Client Schema
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  contact_info: contactInfoSchema,
  status: z.enum(['active', 'inactive', 'pending', 'archived'] as const satisfies readonly DbEnums['client_status'][]),
  type: z.enum(['business', 'individual'] as const satisfies readonly DbEnums['client_type'][]).optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Project Schema
export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  client_id: z.string().uuid(),
  status: z.enum([
    'not_started',
    'on_hold',
    'cancelled',
    'todo',
    'in_progress',
    'review',
    'blocked',
    'completed',
    'archived'
  ] as const satisfies readonly DbEnums['project_status'][]),
  service_type: z.enum([
    'tax_return',
    'bookkeeping',
    'payroll',
    'advisory'
  ] as const satisfies readonly DbEnums['service_type'][]).optional(),
  start_date: z.string().datetime().optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Task Schema
export const taskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum([
    'todo',
    'in_progress',
    'review',
    'completed'
  ] as const satisfies readonly DbEnums['task_status'][]),
  priority: z.enum([
    'low',
    'medium',
    'high',
    'urgent'
  ] as const satisfies readonly DbEnums['task_priority'][]),
  project_id: z.string().uuid().optional(),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Task Status Transitions
export const taskStatusTransitions = {
  todo: ['in_progress', 'review'],
  in_progress: ['todo', 'review', 'completed'],
  review: ['in_progress', 'completed'],
  completed: ['review']
} as const

// Utility type for valid status transitions
export type ValidStatusTransition<T extends DbEnums['task_status']> = typeof taskStatusTransitions[T][number]

// Form Data Schemas
export const clientFormSchema = clientSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const projectFormSchema = projectSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const taskFormSchema = taskSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

// Type Inference
export type ClientFormData = z.infer<typeof clientFormSchema>
export type ProjectFormData = z.infer<typeof projectFormSchema>
export type TaskFormData = z.infer<typeof taskFormSchema>

// Validation Functions
export const validateClient = (data: unknown) => clientSchema.parse(data)
export const validateProject = (data: unknown) => projectSchema.parse(data)
export const validateTask = (data: unknown) => taskSchema.parse(data)

// Safe Status Transition Validator
export const validateTaskStatusTransition = (
  currentStatus: DbEnums['task_status'],
  newStatus: DbEnums['task_status']
): boolean => {
  const allowedTransitions = taskStatusTransitions[currentStatus]
  return allowedTransitions.includes(newStatus as any)
} 
```

### `src\types\workflows.ts`

```typescript
import { Database } from './database.types'

// Base types from database
export type DbWorkflowTemplate = Database['public']['Tables']['workflow_templates']['Row']
export type DbWorkflowTemplateInsert = Database['public']['Tables']['workflow_templates']['Insert']
export type DbWorkflowTemplateUpdate = Database['public']['Tables']['workflow_templates']['Update']

// Workflow status enum
export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
} as const

export type WorkflowStatus = typeof WORKFLOW_STATUS[keyof typeof WORKFLOW_STATUS]

// Step type for workflow templates
export interface WorkflowStep {
  id: string
  title: string
  description?: string | null
  order: number
  required: boolean
  dependencies?: string[] | null
  metadata?: Record<string, unknown> | null
}

// Extended type with relationships
export interface WorkflowTemplateWithRelations extends DbWorkflowTemplate {
  workflows?: Database['public']['Tables']['client_onboarding_workflows']['Row'][] | null
}

// Form data types
export type WorkflowFormData = Omit<DbWorkflowTemplateInsert, 'id' | 'created_at' | 'updated_at'> 
```

### `src\components\dashboard\dashboard-tabs.tsx`

```typescript
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from '@/components/dashboard/overview'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { TaskQueue } from '@/components/dashboard/task-queue'

interface DashboardTabsProps {
  totalActiveClients: number
  pendingTaxReturns: number
  activeProjects: number
  upcomingDeadlines: number
}

export function DashboardTabs({
  totalActiveClients,
  pendingTaxReturns,
  activeProjects,
  upcomingDeadlines,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        <TabsTrigger value="queue">Task Queue</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Overview
          totalActiveClients={totalActiveClients}
          pendingTaxReturns={pendingTaxReturns}
          activeProjects={activeProjects}
          upcomingDeadlines={upcomingDeadlines}
        />
      </TabsContent>
      <TabsContent value="activity">
        <RecentActivity />
      </TabsContent>
      <TabsContent value="queue">
        <TaskQueue />
      </TabsContent>
    </Tabs>
  )
} 
```

### `src\components\dashboard\focus-now-dashboard.tsx`

```typescript
'use client'

export function FocusNowDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Focus Now Dashboard</h2>
      {/* Add your Focus Now Dashboard implementation here */}
    </div>
  )
}

```

### `src\components\dashboard\overview.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OverviewProps {
  totalActiveClients: number
  pendingTaxReturns: number
  activeProjects: number
  upcomingDeadlines: number
}

export function Overview({
  totalActiveClients,
  pendingTaxReturns,
  activeProjects,
  upcomingDeadlines,
}: OverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActiveClients}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tax Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTaxReturns}</div>
          <p className="text-xs text-muted-foreground">Not started or gathering documents</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">Todo, in progress, or review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">Due within 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
} 
```

### `src\components\dashboard\recent-activity.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  user: {
    name: string
    email: string
    image?: string
  }
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.image} alt={activity.user.name} />
                  <AvatarFallback>
                    {activity.user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), "MMM d, yyyy &apos;at&apos; h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 
```

### `src\components\dashboard\revenue-card.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/line-chart"

interface RevenueCardProps {
  revenue: number
  percentageChange: number
  data: number[]
}

export function RevenueCard({ revenue, percentageChange, data }: RevenueCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          +{percentageChange}% from last month
        </p>
        <div className="h-[80px]">
          <LineChart 
            data={data}
            className="h-full w-full"
            pathClassName="stroke-[hsl(var(--chart-1))]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

```

### `src\components\dashboard\smart-queue.tsx`

```typescript
'use client'

export function SmartQueue() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Smart Queue</h2>
      {/* Add your Smart Queue implementation here */}
    </div>
  )
}

```

### `src\components\dashboard\subscriptions-card.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/ui/bar-chart"

interface SubscriptionsCardProps {
  count: number
  percentageChange: number
  data: number[]
}

export function SubscriptionsCard({ count, percentageChange, data }: SubscriptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{count}</div>
        <p className="text-xs text-muted-foreground">
          +{percentageChange}% from last month
        </p>
        <div className="h-[80px]">
          <BarChart 
            data={data}
            className="h-full w-full"
            pathClassName="fill-[hsl(var(--chart-2))]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

```

### `src\components\dashboard\task-queue.tsx`

```typescript
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TaskQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Queue</CardTitle>
        <CardDescription>
          Your upcoming and pending tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Review Q1 Financial Statements
              </p>
              <p className="text-sm text-muted-foreground">
                Due in 2 days
              </p>
            </div>
            <Badge>High Priority</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Prepare Tax Returns for Smith Co
              </p>
              <p className="text-sm text-muted-foreground">
                Due in 5 days
              </p>
            </div>
            <Badge variant="secondary">Medium Priority</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Client Meeting: ABC Corp
              </p>
              <p className="text-sm text-muted-foreground">
                Tomorrow at 2 PM
              </p>
            </div>
            <Badge variant="outline">Low Priority</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
```


## File Size Analysis

| File | Size (KB) |
|------|------------|
| src/types/database.types.ts | 51.4 |
| src\types\database.types.ts | 51.4 |
| src\hooks\useProjectManagement.ts | 10.0 |
| src\hooks\useTaskManagement.ts | 9.8 |
| src\hooks\useProjects.ts | 8.4 |
| src\hooks\useProjects.tsx | 6.4 |
| src\types\projects.ts | 6.0 |
| src\hooks\useClientOnboarding.ts | 4.9 |
| src\types\clients.ts | 4.8 |
| src/hooks/useTaxReturns.ts | 4.7 |
| src\hooks\useTaxReturns.ts | 4.7 |
| src\hooks\useTasks.ts | 4.5 |
| src\hooks\useWorkflows.ts | 4.5 |
| src\hooks\useTimeEntries.ts | 4.5 |
| src\hooks\use-toast.ts | 3.9 |
| src\types\validation.ts | 3.8 |
| src\hooks\useProjectForm.ts | 3.4 |
| src\hooks\useTaxProjectManagement.ts | 3.4 |
| src\hooks\useProjectFilters.ts | 3.3 |
| src\types\hooks.ts | 3.1 |
| src\hooks\usePayrollServices.ts | 3.0 |
| src\hooks\useUsers.ts | 3.0 |
| src\hooks\useTemplateTasks.ts | 2.9 |
| src\hooks\useNotes.ts | 2.8 |
| src\hooks\useProjectAnalytics.ts | 2.8 |
| src\hooks\useProjectSubmission.ts | 2.5 |
| src\hooks\useProjectTemplates.ts | 2.5 |
| src\hooks\useTaskValidation.ts | 2.4 |
| src\types\tasks.ts | 2.4 |
| src\hooks\useStorage.ts | 2.2 |
| src\hooks\useDocuments.ts | 2.1 |
| src\components\dashboard\recent-activity.tsx | 2.1 |
| src\types\auth.ts | 2.0 |
| src\components\dashboard\overview.tsx | 2.0 |
| src\lib\supabase\supabase-provider.tsx | 2.0 |
| src\types\templates.ts | 1.9 |
| src\components\dashboard\task-queue.tsx | 1.7 |
| src\lib\supabase\tasks.ts | 1.7 |
| src\hooks\use-users.ts | 1.7 |
| src\hooks\use-protected-route.ts | 1.4 |
| src\components\dashboard\dashboard-tabs.tsx | 1.3 |
| src\types\users.ts | 1.3 |
| src\lib\api\templates.ts | 1.3 |
| src\hooks\useServiceFields.ts | 1.2 |
| src\hooks\useClients.ts | 1.2 |
| src/app/error.tsx | 1.1 |
| src\types\workflows.ts | 1.1 |
| src\lib\api\projects.ts | 1.1 |
| src\hooks\useAITasks.ts | 1.1 |
| src\components\dashboard\revenue-card.tsx | 1.0 |
| src\components\dashboard\subscriptions-card.tsx | 1.0 |
| src\app\dashboard\layout.tsx | 0.9 |
| src\hooks\useSmartTemplates.ts | 0.9 |
| src/app/dashboard/page.tsx | 0.8 |
| src\app\dashboard\page.tsx | 0.8 |
| src\hooks\useSmartProjectFilters.ts | 0.8 |
| src\hooks\useProjectTabProgress.ts | 0.7 |
| src\lib\supabase\supabase.ts | 0.7 |
| src\hooks\use-mobile.tsx | 0.6 |
| src/lib/supabase/dashboardQueries.ts | 0.5 |
| src\lib\supabase\dashboardQueries.ts | 0.5 |
| src\hooks\use-debounce.tsx | 0.4 |
| src/lib/supabase/server.ts | 0.3 |
| src\lib\supabase\server.ts | 0.3 |
| src\types\time_entries.ts | 0.2 |
| src\components\dashboard\focus-now-dashboard.tsx | 0.2 |
| src/lib/supabase/client.ts | 0.2 |
| src\lib\supabase\client.ts | 0.2 |
| src\components\dashboard\smart-queue.tsx | 0.2 |
| src\types\documents.ts | 0.2 |
| src\types\notes.ts | 0.2 |
