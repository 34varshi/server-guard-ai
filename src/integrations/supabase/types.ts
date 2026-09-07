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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          metric: string
          previous_value: number | null
          recommendation: string
          resolved_at: string | null
          risk_score: number
          server_id: string
          severity: string
          status: string
          threshold: number
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metric: string
          previous_value?: number | null
          recommendation: string
          resolved_at?: string | null
          risk_score?: number
          server_id: string
          severity: string
          status?: string
          threshold: number
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metric?: string
          previous_value?: number | null
          recommendation?: string
          resolved_at?: string | null
          risk_score?: number
          server_id?: string
          severity?: string
          status?: string
          threshold?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "alerts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          cpu_usage: number
          created_at: string
          disk_usage: number
          id: string
          memory_usage: number
          network_in_mb: number
          network_out_mb: number
          process_count: number
          recorded_at: string
          server_id: string
          uptime_seconds: number
        }
        Insert: {
          cpu_usage: number
          created_at?: string
          disk_usage: number
          id?: string
          memory_usage: number
          network_in_mb?: number
          network_out_mb?: number
          process_count?: number
          recorded_at?: string
          server_id: string
          uptime_seconds?: number
        }
        Update: {
          cpu_usage?: number
          created_at?: string
          disk_usage?: number
          id?: string
          memory_usage?: number
          network_in_mb?: number
          network_out_mb?: number
          process_count?: number
          recorded_at?: string
          server_id?: string
          uptime_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          created_at: string
          demo_mode: boolean
          description: string | null
          environment: string
          hostname: string
          id: string
          ip_address: string | null
          last_seen: string
          name: string
          operating_system: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          demo_mode?: boolean
          description?: string | null
          environment?: string
          hostname: string
          id?: string
          ip_address?: string | null
          last_seen?: string
          name: string
          operating_system: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          demo_mode?: boolean
          description?: string | null
          environment?: string
          hostname?: string
          id?: string
          ip_address?: string | null
          last_seen?: string
          name?: string
          operating_system?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      thresholds: {
        Row: {
          created_at: string
          critical_value: number
          id: string
          metric: string
          updated_at: string
          warning_value: number
        }
        Insert: {
          created_at?: string
          critical_value: number
          id?: string
          metric: string
          updated_at?: string
          warning_value: number
        }
        Update: {
          created_at?: string
          critical_value?: number
          id?: string
          metric?: string
          updated_at?: string
          warning_value?: number
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
