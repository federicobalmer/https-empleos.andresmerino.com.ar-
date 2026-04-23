export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          location: string;
          work_type: Database["public"]["Enums"]["work_type"];
          summary: string;
          description: string;
          requirements: string[];
          salary_range: string | null;
          status: Database["public"]["Enums"]["job_status"];
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          location: string;
          work_type: Database["public"]["Enums"]["work_type"];
          summary: string;
          description: string;
          requirements?: string[];
          salary_range?: string | null;
          status?: Database["public"]["Enums"]["job_status"];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          location?: string;
          work_type?: Database["public"]["Enums"]["work_type"];
          summary?: string;
          description?: string;
          requirements?: string[];
          salary_range?: string | null;
          status?: Database["public"]["Enums"]["job_status"];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          full_name: string;
          email: string;
          phone: string;
          city: string;
          message: string | null;
          cv_path: string;
          cv_filename: string;
          status: Database["public"]["Enums"]["application_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          full_name: string;
          email: string;
          phone: string;
          city: string;
          message?: string | null;
          cv_path: string;
          cv_filename: string;
          status?: Database["public"]["Enums"]["application_status"];
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          city?: string;
          message?: string | null;
          cv_path?: string;
          cv_filename?: string;
          status?: Database["public"]["Enums"]["application_status"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: {
          check_user: string;
        };
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      job_status: "draft" | "published" | "paused" | "closed";
      work_type: "full_time" | "part_time" | "hybrid" | "remote";
      application_status: "nuevo" | "en_revision" | "entrevista" | "rechazado" | "contratado";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
