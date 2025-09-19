export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_chat_sessions: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          impact_area: string
          messages: Json | null
          session_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          impact_area: string
          messages?: Json | null
          session_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          impact_area?: string
          messages?: Json | null
          session_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analysis_jobs: {
        Row: {
          business_id: string
          completed_at: string | null
          created_at: string | null
          dataroom_id: string
          error_message: string | null
          id: string
          job_type: string
          metadata: Json | null
          progress_pct: number | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          completed_at?: string | null
          created_at?: string | null
          dataroom_id: string
          error_message?: string | null
          id?: string
          job_type: string
          metadata?: Json | null
          progress_pct?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          completed_at?: string | null
          created_at?: string | null
          dataroom_id?: string
          error_message?: string | null
          id?: string
          job_type?: string
          metadata?: Json | null
          progress_pct?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_jobs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_jobs_dataroom_id_fkey"
            columns: ["dataroom_id"]
            isOneToOne: false
            referencedRelation: "datarooms"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_results: {
        Row: {
          analysis_type: string
          business_id: string
          confidence_score: number | null
          created_at: string | null
          file_id: string | null
          findings: Json | null
          id: string
          impact_area: string | null
          recommendations: Json | null
          updated_at: string | null
        }
        Insert: {
          analysis_type?: string
          business_id: string
          confidence_score?: number | null
          created_at?: string | null
          file_id?: string | null
          findings?: Json | null
          id?: string
          impact_area?: string | null
          recommendations?: Json | null
          updated_at?: string | null
        }
        Update: {
          analysis_type?: string
          business_id?: string
          confidence_score?: number | null
          created_at?: string | null
          file_id?: string | null
          findings?: Json | null
          id?: string
          impact_area?: string | null
          recommendations?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      businesses: {
        Row: {
          company_number: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          legal_form: string | null
          name: string
          operating_months: number | null
          updated_at: string
          user_id: string
          workers_count: number | null
        }
        Insert: {
          company_number?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          legal_form?: string | null
          name: string
          operating_months?: number | null
          updated_at?: string
          user_id: string
          workers_count?: number | null
        }
        Update: {
          company_number?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          legal_form?: string | null
          name?: string
          operating_months?: number | null
          updated_at?: string
          user_id?: string
          workers_count?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          business_id: string
          created_at: string
          id: string
          impact_area: string | null
          level: string
          specific_area: string | null
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          impact_area?: string | null
          level: string
          specific_area?: string | null
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          impact_area?: string | null
          level?: string
          specific_area?: string | null
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      datarooms: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "datarooms_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          ai_reasoning: string | null
          confidence_score: number | null
          created_at: string | null
          file_id: string
          id: string
          impact_area: string
        }
        Insert: {
          ai_reasoning?: string | null
          confidence_score?: number | null
          created_at?: string | null
          file_id: string
          id?: string
          impact_area: string
        }
        Update: {
          ai_reasoning?: string | null
          confidence_score?: number | null
          created_at?: string | null
          file_id?: string
          id?: string
          impact_area?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_categories_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: true
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chunks: {
        Row: {
          chunk_index: number
          created_at: string | null
          dataroom_id: string
          file_id: string
          id: string
          page_number: number | null
          text_content: string
          token_count: number | null
        }
        Insert: {
          chunk_index: number
          created_at?: string | null
          dataroom_id: string
          file_id: string
          id?: string
          page_number?: number | null
          text_content: string
          token_count?: number | null
        }
        Update: {
          chunk_index?: number
          created_at?: string | null
          dataroom_id?: string
          file_id?: string
          id?: string
          page_number?: number | null
          text_content?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_dataroom_id_fkey"
            columns: ["dataroom_id"]
            isOneToOne: false
            referencedRelation: "datarooms"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          category_id: string | null
          content_type: string | null
          created_at: string | null
          dataroom_id: string
          extracted_text: string | null
          extraction_method: string | null
          extraction_status: string | null
          file_kind: string | null
          file_size_bytes: number | null
          id: string
          impact_area: string | null
          is_deleted: boolean | null
          original_name: string
          processed_at: string | null
          storage_bucket: string
          storage_path: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          category_id?: string | null
          content_type?: string | null
          created_at?: string | null
          dataroom_id: string
          extracted_text?: string | null
          extraction_method?: string | null
          extraction_status?: string | null
          file_kind?: string | null
          file_size_bytes?: number | null
          id?: string
          impact_area?: string | null
          is_deleted?: boolean | null
          original_name: string
          processed_at?: string | null
          storage_bucket?: string
          storage_path: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          category_id?: string | null
          content_type?: string | null
          created_at?: string | null
          dataroom_id?: string
          extracted_text?: string | null
          extraction_method?: string | null
          extraction_status?: string | null
          file_kind?: string | null
          file_size_bytes?: number | null
          id?: string
          impact_area?: string | null
          is_deleted?: boolean | null
          original_name?: string
          processed_at?: string | null
          storage_bucket?: string
          storage_path?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_dataroom_id_fkey"
            columns: ["dataroom_id"]
            isOneToOne: false
            referencedRelation: "datarooms"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_sub_areas: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          icon_type: string | null
          id: string
          impact_area: string
          is_user_created: boolean | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          icon_type?: string | null
          id?: string
          impact_area: string
          is_user_created?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          icon_type?: string | null
          id?: string
          impact_area?: string
          is_user_created?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_base_documents: {
        Row: {
          content: string
          created_at: string | null
          document_type: string
          embedding: string | null
          id: string
          impact_area: string | null
          metadata: Json | null
          requirement_codes: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          document_type: string
          embedding?: string | null
          id?: string
          impact_area?: string | null
          metadata?: Json | null
          requirement_codes?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          document_type?: string
          embedding?: string | null
          id?: string
          impact_area?: string | null
          metadata?: Json | null
          requirement_codes?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      task_file_mappings: {
        Row: {
          created_at: string
          file_id: string
          id: string
          mapped_at: string
          mapped_by: string | null
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_id: string
          id?: string
          mapped_at?: string
          mapped_by?: string | null
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_id?: string
          id?: string
          mapped_at?: string
          mapped_by?: string | null
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          anchor_quote: string | null
          business_id: string
          completed_at: string | null
          created_at: string
          deleted_at: string | null
          description_md: string | null
          due_date: string | null
          effort: string
          evidence_chunk_ids: string[] | null
          id: string
          impact: string
          kb_action_id: string | null
          kb_refs: Json | null
          owner_user_id: string | null
          priority: string
          rationale: string | null
          requirement_code: string | null
          status: string
          sub_area: string | null
          sub_area_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          anchor_quote?: string | null
          business_id: string
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          description_md?: string | null
          due_date?: string | null
          effort: string
          evidence_chunk_ids?: string[] | null
          id?: string
          impact: string
          kb_action_id?: string | null
          kb_refs?: Json | null
          owner_user_id?: string | null
          priority: string
          rationale?: string | null
          requirement_code?: string | null
          status: string
          sub_area?: string | null
          sub_area_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          anchor_quote?: string | null
          business_id?: string
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          description_md?: string | null
          due_date?: string | null
          effort?: string
          evidence_chunk_ids?: string[] | null
          id?: string
          impact?: string
          kb_action_id?: string | null
          kb_refs?: Json | null
          owner_user_id?: string | null
          priority?: string
          rationale?: string | null
          requirement_code?: string | null
          status?: string
          sub_area?: string | null
          sub_area_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_sub_area_id_fkey"
            columns: ["sub_area_id"]
            isOneToOne: false
            referencedRelation: "impact_sub_areas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_knowledge_documents: {
        Args: {
          match_count?: number
          query_embedding: string
          similarity_threshold?: number
        }
        Returns: {
          content: string
          document_type: string
          id: string
          impact_area: string
          requirement_codes: string[]
          similarity: number
          title: string
        }[]
      }
      seed_default_sub_areas: {
        Args: { p_business_id: string }
        Returns: undefined
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
