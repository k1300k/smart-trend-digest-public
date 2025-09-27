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
      keywords: {
        Row: {
          id: string
          value: string
          weight: number
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          value: string
          weight: number
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          value?: string
          weight?: number
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      sources: {
        Row: {
          id: string
          name: string
          url: string
          type: 'blog' | 'news' | 'social'
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          url: string
          type: 'blog' | 'news' | 'social'
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          url?: string
          type?: 'blog' | 'news' | 'social'
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      persons: {
        Row: {
          id: string
          name: string
          platform: string
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          platform: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          platform?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      settings: {
        Row: {
          id: string
          email: string
          send_time: string
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          email: string
          send_time: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          send_time?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
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
  }
}