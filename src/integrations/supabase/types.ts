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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          assigned_mechanic: string | null
          completion_notes: string | null
          created_at: string
          estimated_duration: number | null
          id: string
          notes: string | null
          owner_id: string
          scheduled_date: string
          service_center_id: string
          service_type: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          assigned_mechanic?: string | null
          completion_notes?: string | null
          created_at?: string
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          owner_id: string
          scheduled_date: string
          service_center_id: string
          service_type: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          assigned_mechanic?: string | null
          completion_notes?: string | null
          created_at?: string
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          owner_id?: string
          scheduled_date?: string
          service_center_id?: string
          service_type?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_center_id_fkey"
            columns: ["service_center_id"]
            isOneToOne: false
            referencedRelation: "service_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          component: Database["public"]["Enums"]["component_type"]
          confidence_score: number
          contributing_factors: Json | null
          created_at: string
          failure_probability: number
          id: string
          is_critical: boolean | null
          predicted_failure_date: string | null
          recommendation: string | null
          vehicle_id: string
        }
        Insert: {
          component: Database["public"]["Enums"]["component_type"]
          confidence_score: number
          contributing_factors?: Json | null
          created_at?: string
          failure_probability: number
          id?: string
          is_critical?: boolean | null
          predicted_failure_date?: string | null
          recommendation?: string | null
          vehicle_id: string
        }
        Update: {
          component?: Database["public"]["Enums"]["component_type"]
          confidence_score?: number
          contributing_factors?: Json | null
          created_at?: string
          failure_probability?: number
          id?: string
          is_critical?: boolean | null
          predicted_failure_date?: string | null
          recommendation?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rca_reports: {
        Row: {
          booking_id: string | null
          capa_suggestions: Json | null
          component: Database["public"]["Enums"]["component_type"] | null
          created_at: string
          created_by: string | null
          failure_description: string
          id: string
          root_cause: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          booking_id?: string | null
          capa_suggestions?: Json | null
          component?: Database["public"]["Enums"]["component_type"] | null
          created_at?: string
          created_by?: string | null
          failure_description: string
          id?: string
          root_cause?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          booking_id?: string | null
          capa_suggestions?: Json | null
          component?: Database["public"]["Enums"]["component_type"] | null
          created_at?: string
          created_by?: string | null
          failure_description?: string
          id?: string
          root_cause?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rca_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rca_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rca_reports_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_centers: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string | null
          id: string
          manager_id: string | null
          name: string
          operating_hours: Json | null
          phone: string | null
          rating: number | null
          services_offered: string[] | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email?: string | null
          id?: string
          manager_id?: string | null
          name: string
          operating_hours?: Json | null
          phone?: string | null
          rating?: number | null
          services_offered?: string[] | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          rating?: number | null
          services_offered?: string[] | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_centers_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry: {
        Row: {
          battery_voltage: number | null
          brake_pad_thickness: number | null
          created_at: string
          engine_temp: number | null
          error_codes: string[] | null
          id: string
          oil_pressure: number | null
          raw_data: Json | null
          timestamp: string
          tire_pressure: Json | null
          vehicle_id: string
        }
        Insert: {
          battery_voltage?: number | null
          brake_pad_thickness?: number | null
          created_at?: string
          engine_temp?: number | null
          error_codes?: string[] | null
          id?: string
          oil_pressure?: number | null
          raw_data?: Json | null
          timestamp?: string
          tire_pressure?: Json | null
          vehicle_id: string
        }
        Update: {
          battery_voltage?: number | null
          brake_pad_thickness?: number | null
          created_at?: string
          engine_temp?: number | null
          error_codes?: string[] | null
          id?: string
          oil_pressure?: number | null
          raw_data?: Json | null
          timestamp?: string
          tire_pressure?: Json | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          id: string
          last_service_date: string | null
          license_plate: string | null
          make: string
          mileage: number | null
          model: string
          owner_id: string
          status: Database["public"]["Enums"]["vehicle_status"]
          updated_at: string
          vin: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_service_date?: string | null
          license_plate?: string | null
          make: string
          mileage?: number | null
          model: string
          owner_id: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          vin: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          last_service_date?: string | null
          license_plate?: string | null
          make?: string
          mileage?: number | null
          model?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          vin?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      component_type:
        | "engine"
        | "transmission"
        | "brakes"
        | "battery"
        | "suspension"
        | "electrical"
        | "cooling_system"
        | "fuel_system"
      user_role:
        | "vehicle_owner"
        | "service_center_manager"
        | "fleet_admin"
        | "manufacturing_team"
        | "platform_admin"
      vehicle_status: "healthy" | "warning" | "critical"
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
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      component_type: [
        "engine",
        "transmission",
        "brakes",
        "battery",
        "suspension",
        "electrical",
        "cooling_system",
        "fuel_system",
      ],
      user_role: [
        "vehicle_owner",
        "service_center_manager",
        "fleet_admin",
        "manufacturing_team",
        "platform_admin",
      ],
      vehicle_status: ["healthy", "warning", "critical"],
    },
  },
} as const
