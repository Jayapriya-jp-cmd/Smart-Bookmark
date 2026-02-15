// Type definitions for the Smart Bookmark App

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Database schema types for Supabase
export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: Bookmark;
        Insert: Omit<Bookmark, 'id' | 'created_at'>;
        Update: Partial<Omit<Bookmark, 'id' | 'user_id'>>;
      };
    };
  };
}
