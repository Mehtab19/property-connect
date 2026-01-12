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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          agency_name: string | null
          areas_served: string[] | null
          bio: string | null
          created_at: string
          id: string
          license_number: string | null
          rating: number | null
          specialization: string[] | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          agency_name?: string | null
          areas_served?: string[] | null
          bio?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          rating?: number | null
          specialization?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          agency_name?: string | null
          areas_served?: string[] | null
          bio?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          rating?: number | null
          specialization?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          agent_id: string | null
          appointment_type: string
          created_at: string
          id: string
          notes: string | null
          project_id: string | null
          property_id: string | null
          scheduled_date: string
          scheduled_time: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          appointment_type: string
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          property_id?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          appointment_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          property_id?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_preferences: {
        Row: {
          bathrooms_min: number | null
          bedrooms_max: number | null
          bedrooms_min: number | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          financing_status: string | null
          id: string
          move_in_timeline: string | null
          must_have_amenities: string[] | null
          notes: string | null
          preferred_areas: string[] | null
          preferred_cities: string[] | null
          property_types: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bathrooms_min?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          financing_status?: string | null
          id?: string
          move_in_timeline?: string | null
          must_have_amenities?: string[] | null
          notes?: string | null
          preferred_areas?: string[] | null
          preferred_cities?: string[] | null
          property_types?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bathrooms_min?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          financing_status?: string | null
          id?: string
          move_in_timeline?: string | null
          must_have_amenities?: string[] | null
          notes?: string | null
          preferred_areas?: string[] | null
          preferred_cities?: string[] | null
          property_types?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          property_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          property_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          property_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      developers: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          established_year: number | null
          headquarters_city: string | null
          id: string
          logo_url: string | null
          operating_cities: string[] | null
          registration_number: string | null
          total_projects: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          established_year?: number | null
          headquarters_city?: string | null
          id?: string
          logo_url?: string | null
          operating_cities?: string[] | null
          registration_number?: string | null
          total_projects?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          established_year?: number | null
          headquarters_city?: string | null
          id?: string
          logo_url?: string | null
          operating_cities?: string[] | null
          registration_number?: string | null
          total_projects?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      investor_preferences: {
        Row: {
          created_at: string
          financing_preference: string | null
          id: string
          interested_in_off_plan: boolean | null
          investment_budget_max: number | null
          investment_budget_min: number | null
          investment_horizon: string | null
          notes: string | null
          portfolio_size: number | null
          preferred_cities: string[] | null
          property_types: string[] | null
          risk_tolerance: string | null
          target_rental_yield_min: number | null
          target_roi_min: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          financing_preference?: string | null
          id?: string
          interested_in_off_plan?: boolean | null
          investment_budget_max?: number | null
          investment_budget_min?: number | null
          investment_horizon?: string | null
          notes?: string | null
          portfolio_size?: number | null
          preferred_cities?: string[] | null
          property_types?: string[] | null
          risk_tolerance?: string | null
          target_rental_yield_min?: number | null
          target_roi_min?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          financing_preference?: string | null
          id?: string
          interested_in_off_plan?: boolean | null
          investment_budget_max?: number | null
          investment_budget_min?: number | null
          investment_horizon?: string | null
          notes?: string | null
          portfolio_size?: number | null
          preferred_cities?: string[] | null
          property_types?: string[] | null
          risk_tolerance?: string | null
          target_rental_yield_min?: number | null
          target_roi_min?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          agent_id: string | null
          ai_summary: string | null
          created_at: string
          id: string
          lead_type: string
          mortgage_partner_id: string | null
          notes: string | null
          priority: string | null
          property_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          ai_summary?: string | null
          created_at?: string
          id?: string
          lead_type: string
          mortgage_partner_id?: string | null
          notes?: string | null
          priority?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          ai_summary?: string | null
          created_at?: string
          id?: string
          lead_type?: string
          mortgage_partner_id?: string | null
          notes?: string | null
          priority?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_mortgage_partner_id_fkey"
            columns: ["mortgage_partner_id"]
            isOneToOne: false
            referencedRelation: "mortgage_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_requests: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          meeting_type: string
          message: string | null
          phone: string
          preferred_contact: string
          preferred_date: string
          preferred_time: string
          property_id: string
          property_location: string | null
          property_title: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          meeting_type: string
          message?: string | null
          phone: string
          preferred_contact: string
          preferred_date: string
          preferred_time: string
          property_id: string
          property_location?: string | null
          property_title: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          meeting_type?: string
          message?: string | null
          phone?: string
          preferred_contact?: string
          preferred_date?: string
          preferred_time?: string
          property_id?: string
          property_location?: string | null
          property_title?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      mortgage_partners: {
        Row: {
          bank_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          features: string[] | null
          id: string
          interest_rate_max: number | null
          interest_rate_min: number | null
          logo_url: string | null
          max_loan_amount: number | null
          max_tenure_years: number | null
          processing_fee_percent: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          bank_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          features?: string[] | null
          id?: string
          interest_rate_max?: number | null
          interest_rate_min?: number | null
          logo_url?: string | null
          max_loan_amount?: number | null
          max_tenure_years?: number | null
          processing_fee_percent?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          bank_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          features?: string[] | null
          id?: string
          interest_rate_max?: number | null
          interest_rate_min?: number | null
          logo_url?: string | null
          max_loan_amount?: number | null
          max_tenure_years?: number | null
          processing_fee_percent?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          category: string
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          category?: string
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          phone: string | null
          status: string
          suspension_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          status?: string
          suspension_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          status?: string
          suspension_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          amenities: string[] | null
          area: string | null
          available_units: number | null
          city: string
          created_at: string
          description: string | null
          developer_id: string | null
          documents: string[] | null
          expected_completion: string | null
          id: string
          images: string[] | null
          name: string
          price_range_max: number | null
          price_range_min: number | null
          project_type: string | null
          status: string | null
          total_units: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area?: string | null
          available_units?: number | null
          city: string
          created_at?: string
          description?: string | null
          developer_id?: string | null
          documents?: string[] | null
          expected_completion?: string | null
          id?: string
          images?: string[] | null
          name: string
          price_range_max?: number | null
          price_range_min?: number | null
          project_type?: string | null
          status?: string | null
          total_units?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area?: string | null
          available_units?: number | null
          city?: string
          created_at?: string
          description?: string | null
          developer_id?: string | null
          documents?: string[] | null
          expected_completion?: string | null
          id?: string
          images?: string[] | null
          name?: string
          price_range_max?: number | null
          price_range_min?: number | null
          project_type?: string | null
          status?: string | null
          total_units?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          approved_at: string | null
          approved_by: string | null
          area: string
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          description: string | null
          documents: string[] | null
          id: string
          images: string[] | null
          parking: number
          price: number
          property_type: string
          rejection_reason: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          area: string
          bathrooms?: number
          bedrooms?: number
          city: string
          country?: string
          created_at?: string
          description?: string | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          parking?: number
          price: number
          property_type?: string
          rejection_reason?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          area?: string
          bathrooms?: number
          bedrooms?: number
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          parking?: number
          price?: number
          property_type?: string
          rejection_reason?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_analyses: {
        Row: {
          ai_summary: string | null
          appreciation_forecast: number | null
          confidence_score: number | null
          created_at: string
          id: string
          market_trends: Json | null
          property_id: string
          recommended_actions: string[] | null
          rental_yield: number | null
          risk_flags: string[] | null
          risk_score: number | null
          roi_estimate: number | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          appreciation_forecast?: number | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          market_trends?: Json | null
          property_id: string
          recommended_actions?: string[] | null
          rental_yield?: number | null
          risk_flags?: string[] | null
          risk_score?: number | null
          roi_estimate?: number | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          appreciation_forecast?: number | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          market_trends?: Json | null
          property_id?: string
          recommended_actions?: string[] | null
          rental_yield?: number | null
          risk_flags?: string[] | null
          risk_score?: number | null
          roi_estimate?: number | null
          user_id?: string
        }
        Relationships: []
      }
      property_comparisons: {
        Row: {
          comparison_data: Json | null
          created_at: string
          id: string
          name: string | null
          property_ids: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          comparison_data?: Json | null
          created_at?: string
          id?: string
          name?: string | null
          property_ids: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          comparison_data?: Json | null
          created_at?: string
          id?: string
          name?: string | null
          property_ids?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          filters: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          name?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "buyer"
        | "investor"
        | "developer"
        | "broker"
        | "mortgage_partner"
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
      app_role: [
        "admin",
        "buyer",
        "investor",
        "developer",
        "broker",
        "mortgage_partner",
      ],
    },
  },
} as const
