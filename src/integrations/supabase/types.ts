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
      analysis_counter: {
        Row: {
          created_at: string | null
          id: string
          total_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          total_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          total_count?: number | null
        }
        Relationships: []
      }
      blog_post_drafts: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          rich_content: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          rich_content?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          rich_content?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_drafts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          rich_content: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          rich_content?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          rich_content?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gambling_sites: {
        Row: {
          created_at: string
          features: string[]
          id: string
          logo: string | null
          min_payout: string
          name: string
          payment_methods: string[]
          rakeback: string
          referral_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: string[]
          id?: string
          logo?: string | null
          min_payout: string
          name: string
          payment_methods?: string[]
          rakeback: string
          referral_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: string[]
          id?: string
          logo?: string | null
          min_payout?: string
          name?: string
          payment_methods?: string[]
          rakeback?: string
          referral_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_recommendations: {
        Row: {
          created_at: string | null
          id: string
          product_asin: string | null
          product_image: string | null
          product_price: string | null
          product_title: string | null
          product_url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_asin?: string | null
          product_image?: string | null
          product_price?: string | null
          product_title?: string | null
          product_url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_asin?: string | null
          product_image?: string | null
          product_price?: string | null
          product_title?: string | null
          product_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          is_admin?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          bonus_percentage: number | null
          code: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          bonus_percentage?: number | null
          code: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          bonus_percentage?: number | null
          code?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referred_users: {
        Row: {
          created_at: string
          has_met_spend: boolean | null
          id: string
          referred_user_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          has_met_spend?: boolean | null
          id?: string
          referred_user_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          has_met_spend?: boolean | null
          id?: string
          referred_user_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referred_users_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referred_users_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skin_quiz_responses: {
        Row: {
          answer: string | null
          created_at: string | null
          id: string
          question_id: number | null
          user_id: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string | null
          id?: string
          question_id?: number | null
          user_id?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string | null
          id?: string
          question_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_site_connections: {
        Row: {
          created_at: string
          id: string
          site_id: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          site_id: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          site_id?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_site_connections_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "gambling_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_site_connections_user_id_fkey"
            columns: ["user_id"]
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
      increment_analysis_counter: {
        Args: Record<PropertyKey, never>
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
