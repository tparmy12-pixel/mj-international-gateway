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
      applications: {
        Row: {
          aadhaar_url: string | null
          admin_notes: string | null
          adults_count: number | null
          bank_statement_url: string | null
          children_count: number | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          departure_date: string | null
          email: string
          father_name: string | null
          full_address: string | null
          full_name: string
          gender: string | null
          id: string
          is_vip: boolean
          mobile_number: string
          nationality: string | null
          notes: string | null
          num_travelers: number | null
          order_address: string | null
          order_city: string | null
          order_created_at: string | null
          order_pincode: string | null
          order_state: string | null
          order_status: Database["public"]["Enums"]["order_status"]
          passport_back_url: string | null
          passport_expiry_date: string | null
          passport_front_url: string | null
          passport_issue_date: string | null
          passport_number: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          photo_url: string | null
          return_date: string | null
          services: string[] | null
          status: Database["public"]["Enums"]["application_status"]
          travel_purpose: string | null
          updated_at: string
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          aadhaar_url?: string | null
          admin_notes?: string | null
          adults_count?: number | null
          bank_statement_url?: string | null
          children_count?: number | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          departure_date?: string | null
          email: string
          father_name?: string | null
          full_address?: string | null
          full_name: string
          gender?: string | null
          id?: string
          is_vip?: boolean
          mobile_number: string
          nationality?: string | null
          notes?: string | null
          num_travelers?: number | null
          order_address?: string | null
          order_city?: string | null
          order_created_at?: string | null
          order_pincode?: string | null
          order_state?: string | null
          order_status?: Database["public"]["Enums"]["order_status"]
          passport_back_url?: string | null
          passport_expiry_date?: string | null
          passport_front_url?: string | null
          passport_issue_date?: string | null
          passport_number?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          photo_url?: string | null
          return_date?: string | null
          services?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          travel_purpose?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          aadhaar_url?: string | null
          admin_notes?: string | null
          adults_count?: number | null
          bank_statement_url?: string | null
          children_count?: number | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          departure_date?: string | null
          email?: string
          father_name?: string | null
          full_address?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          is_vip?: boolean
          mobile_number?: string
          nationality?: string | null
          notes?: string | null
          num_travelers?: number | null
          order_address?: string | null
          order_city?: string | null
          order_created_at?: string | null
          order_pincode?: string | null
          order_state?: string | null
          order_status?: Database["public"]["Enums"]["order_status"]
          passport_back_url?: string | null
          passport_expiry_date?: string | null
          passport_front_url?: string | null
          passport_issue_date?: string | null
          passport_number?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          photo_url?: string | null
          return_date?: string | null
          services?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          travel_purpose?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_status: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_status?: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_status?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      application_status:
        | "pending"
        | "processing"
        | "approved"
        | "rejected"
        | "completed"
      order_status: "none" | "created" | "billed"
      payment_status: "unpaid" | "partial" | "paid" | "refunded"
      subscription_plan: "unique" | "infinity" | "global"
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
      app_role: ["admin", "user"],
      application_status: [
        "pending",
        "processing",
        "approved",
        "rejected",
        "completed",
      ],
      order_status: ["none", "created", "billed"],
      payment_status: ["unpaid", "partial", "paid", "refunded"],
      subscription_plan: ["unique", "infinity", "global"],
    },
  },
} as const
