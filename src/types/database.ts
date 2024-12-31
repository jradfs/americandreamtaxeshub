export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_documents: {
        Row: {
          client_id: string | null
          document_name: string
          document_type: string
          id: number
          reminder_sent: boolean | null
          status: string
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          document_name: string
          document_type: string
          id?: never
          reminder_sent?: boolean | null
          status: string
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          document_name?: string
          document_type?: string
          id?: never
          reminder_sent?: boolean | null
          status?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: number
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: never
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: never
          progress?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          company_name: string | null
          contact_email: string
          contact_info: Json
          created_at: string | null
          full_name: string | null
          id: string
          status: string
          tax_info: Json
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email: string
          contact_info?: Json
          created_at?: string | null
          full_name?: string | null
          id: string
          status: string
          tax_info?: Json
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: string
          contact_info?: Json
          created_at?: string | null
          full_name?: string | null
          id?: string
          status?: string
          tax_info?: Json
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          client_id: string | null
          file_name: string
          file_type: string
          folder_path: string | null
          id: number
          project_id: number | null
          storage_path: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          client_id?: string | null
          file_name: string
          file_type: string
          folder_path?: string | null
          id?: never
          project_id?: number | null
          storage_path: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          client_id?: string | null
          file_name?: string
          file_type?: string
          folder_path?: string | null
          id?: never
          project_id?: number | null
          storage_path?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      individuals: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: number
          tax_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: never
          tax_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: never
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
          id: number
          project_id: number | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: never
          project_id?: number | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: never
          project_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: number
          message: string
          sent_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          id?: never
          message: string
          sent_at?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          id?: never
          message?: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      owners: {
        Row: {
          client_id: string | null
          id: number
          individual_id: number | null
          ownership_percentage: number | null
        }
        Insert: {
          client_id?: string | null
          id?: never
          individual_id?: number | null
          ownership_percentage?: number | null
        }
        Update: {
          client_id?: string | null
          id?: never
          individual_id?: number | null
          ownership_percentage?: number | null
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
          id: number
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
          id?: never
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
          id?: never
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
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          created_at: string | null
          description: string | null
          due_date: string | null
          end_date: string | null
          id: string
          name: string
          parent_project_id: string | null
          payroll_info: Json | null
          priority: string | null
          service_type: string | null
          stage: string | null
          start_date: string | null
          status: string
          tax_info: Json | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          priority?: string | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status?: string
          tax_info?: Json | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name?: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          priority?: string | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status?: string
          tax_info?: Json | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
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
            referencedRelation: "projects"
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
          activity_log: Json | null
          assignee_id: string | null
          category: string | null
          checklist: Json | null
          created_at: string | null
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
          activity_log?: Json | null
          assignee_id?: string | null
          category?: string | null
          checklist?: Json | null
          created_at?: string | null
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
          activity_log?: Json | null
          assignee_id?: string | null
          category?: string | null
          checklist?: Json | null
          created_at?: string | null
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
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_returns: {
        Row: {
          client_id: string | null
          created_at: string | null
          due_date: string | null
          filed_date: string | null
          filing_type: string
          id: number
          status: string
          tax_year: number
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          filed_date?: string | null
          filing_type: string
          id?: never
          status: string
          tax_year: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          filed_date?: string | null
          filing_type?: string
          id?: never
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
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          steps: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          steps: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
          steps?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      project_status:
        | "todo"
        | "in_progress"
        | "review"
        | "blocked"
        | "completed"
        | "archived"
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