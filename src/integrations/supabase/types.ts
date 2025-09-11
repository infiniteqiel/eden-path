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
      todos: {
        Row: {
          business_id: string
          completed_at: string | null
          created_at: string
          description_md: string | null
          due_date: string | null
          effort: string
          evidence_chunk_ids: string[] | null
          id: string
          impact: string
          kb_action_id: string | null
          owner_user_id: string | null
          priority: string
          requirement_code: string | null
          status: string
          sub_area: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          completed_at?: string | null
          created_at?: string
          description_md?: string | null
          due_date?: string | null
          effort: string
          evidence_chunk_ids?: string[] | null
          id?: string
          impact: string
          kb_action_id?: string | null
          owner_user_id?: string | null
          priority: string
          requirement_code?: string | null
          status: string
          sub_area?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          completed_at?: string | null
          created_at?: string
          description_md?: string | null
          due_date?: string | null
          effort?: string
          evidence_chunk_ids?: string[] | null
          id?: string
          impact?: string
          kb_action_id?: string | null
          owner_user_id?: string | null
          priority?: string
          requirement_code?: string | null
          status?: string
          sub_area?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
