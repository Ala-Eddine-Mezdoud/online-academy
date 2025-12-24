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
      categories: {
        Row: {
          deleted_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          deleted_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          deleted_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: number
          message: string | null
          name: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      course_faq: {
        Row: {
          answer: string | null
          course_id: number | null
          deleted_at: string | null
          id: number
          question: string | null
        }
        Insert: {
          answer?: string | null
          course_id?: number | null
          deleted_at?: string | null
          id?: number
          question?: string | null
        }
        Update: {
          answer?: string | null
          course_id?: number | null
          deleted_at?: string | null
          id?: number
          question?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_faq_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_learnings: {
        Row: {
          content: string | null
          course_id: number | null
          deleted_at: string | null
          id: number
        }
        Insert: {
          content?: string | null
          course_id?: number | null
          deleted_at?: string | null
          id?: number
        }
        Update: {
          content?: string | null
          course_id?: number | null
          deleted_at?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_learnings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          comment: string | null
          course_id: number | null
          created_at: string | null
          deleted_at: string | null
          id: number
          rating: number | null
          student_id: string | null
        }
        Insert: {
          comment?: string | null
          course_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          rating?: number | null
          student_id?: string | null
        }
        Update: {
          comment?: string | null
          course_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          rating?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_syllabus: {
        Row: {
          content: string | null
          course_id: number | null
          deleted_at: string | null
          id: number
          title: string | null
          week_number: number | null
        }
        Insert: {
          content?: string | null
          course_id?: number | null
          deleted_at?: string | null
          id?: number
          title?: string | null
          week_number?: number | null
        }
        Update: {
          content?: string | null
          course_id?: number | null
          deleted_at?: string | null
          id?: number
          title?: string | null
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_syllabus_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          image: string | null
          id: number
          num_weeks: number | null
          overview: string | null
          price: number | null
          teacher_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: number
          num_weeks?: number | null
          overview?: string | null
          price?: number | null
          teacher_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: number
          num_weeks?: number | null
          overview?: string | null
          price?: number | null
          teacher_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: number | null
          deleted_at: string | null
          enrolled_at: string | null
          id: number
          progress: number | null
          student_id: string | null
        }
        Insert: {
          course_id?: number | null
          deleted_at?: string | null
          enrolled_at?: string | null
          id?: number
          progress?: number | null
          student_id?: string | null
        }
        Update: {
          course_id?: number | null
          deleted_at?: string | null
          enrolled_at?: string | null
          id?: number
          progress?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          course_id: number | null
          deleted_at: string | null
          end_time: string | null
          id: number
          session_link: string | null
          session_title: string | null
          start_time: string | null
          teacher_id: string | null
        }
        Insert: {
          course_id?: number | null
          deleted_at?: string | null
          end_time?: string | null
          id?: number
          session_link?: string | null
          session_title?: string | null
          start_time?: string | null
          teacher_id?: string | null
        }
        Update: {
          course_id?: number | null
          deleted_at?: string | null
          end_time?: string | null
          id?: number
          session_link?: string | null
          session_title?: string | null
          start_time?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name : string | null
          email : string | null
          phone_number: string | null
          profile_image: string | null
          role: string
          role_title: string | null
          updated_at: string | null
          wilaya: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id: string
          phone_number?: string | null
          profile_image?: string | null
          role: string
          role_title?: string | null
          updated_at?: string | null
          wilaya?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          phone_number?: string | null
          profile_image?: string | null
          role?: string
          role_title?: string | null
          updated_at?: string | null
          wilaya?: string | null
        }
        Relationships: []
      }
      teacher_links: {
        Row: {
          id: number
          platform: string | null
          teacher_id: string | null
          url: string | null
        }
        Insert: {
          id?: number
          platform?: string | null
          teacher_id?: string | null
          url?: string | null
        }
        Update: {
          id?: number
          platform?: string | null
          teacher_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_links_teacher_id_fkey"
            columns: ["teacher_id"]
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
