export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: string | null;
          daily_capacity_hours: number | null;
          avatar_url: string | null;
          created_at?: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: string | null;
          daily_capacity_hours?: number | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: string | null;
          daily_capacity_hours?: number | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: string;
          priority_score: number | null;
          deadline: string | null;
          created_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          status?: string;
          priority_score?: number | null;
          deadline?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          status?: string;
          priority_score?: number | null;
          deadline?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];
