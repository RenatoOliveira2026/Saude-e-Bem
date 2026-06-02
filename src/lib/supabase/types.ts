/**
 * Tipos do Supabase — expandir via CLI quando o schema crescer.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ProfileRow = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
};

type UserPreferenceRow = {
  id: string;
  user_id: string;
  goal: string | null;
  created_at: string;
};

type ContentStatus = "published" | "draft" | "archived";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: Json;
  category: string;
  category_label: string;
  author: string;
  author_role: string;
  read_time: string;
  published_at: string;
  featured: boolean;
  cover_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_image_url?: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

type ProtocolRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  objective: string;
  long_description: string;
  category: string;
  category_label: string;
  duration: string;
  level: string;
  benefits: Json;
  steps: Json;
  is_premium: boolean;
  featured: boolean;
  tag: string | null;
  participants: number;
  cover_image_url?: string | null;
  content?: Json;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_image_url?: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

type EbookRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string;
  category: string;
  category_label: string;
  icon: string;
  format: string;
  pages: number;
  highlights: Json;
  is_premium: boolean;
  downloads: number;
  featured: boolean;
  cover_image_url?: string | null;
  pdf_url?: string | null;
  content?: Json;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_image_url?: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

type AffiliateLinkRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  url: string;
  product_type: string;
  brand: string;
  producer_name: string;
  rating: number | null;
  reviews_count: number;
  editor_choice: boolean;
  benefits: string;
  target_audience: string;
  contraindications: string;
  current_price: number | null;
  old_price: number | null;
  installments: string;
  affiliate_platform: string;
  affiliate_url: string | null;
  official_url: string | null;
  commission_type: string;
  commission_value: string;
  cookie_duration: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  testimonial_1: string;
  testimonial_2: string;
  testimonial_3: string;
  image_url: string | null;
  video_url: string | null;
  active: boolean;
  featured: boolean;
  created_at: string;
};

type AffiliateClickRow = {
  id: string;
  affiliate_id: string;
  source_page: string;
  source_type: string;
  created_at: string;
};

type NewsletterLeadRow = {
  id: string;
  name: string;
  email: string;
  source: string;
  created_at: string;
};

type FavoriteRow = {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  created_at: string;
};

type AdminUserRow = {
  id: string;
  user_id: string;
  email: string;
  role: "super_admin" | "admin";
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: UserPreferenceRow;
        Insert: {
          id?: string;
          user_id: string;
          goal?: string | null;
          created_at?: string;
        };
        Update: {
          goal?: string | null;
        };
        Relationships: [];
      };
      articles: {
        Row: ArticleRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content?: Json;
          category: string;
          category_label: string;
          author: string;
          author_role: string;
          read_time: string;
          published_at: string;
          featured?: boolean;
          cover_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          og_image_url?: string | null;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ArticleRow>;
        Relationships: [];
      };
      protocols: {
        Row: ProtocolRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          objective: string;
          long_description: string;
          content?: Json;
          category: string;
          category_label: string;
          duration: string;
          level: string;
          benefits?: Json;
          steps?: Json;
          is_premium?: boolean;
          featured?: boolean;
          tag?: string | null;
          participants?: number;
          cover_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          og_image_url?: string | null;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProtocolRow>;
        Relationships: [];
      };
      ebooks: {
        Row: EbookRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          long_description: string;
          content?: Json;
          category: string;
          category_label: string;
          icon?: string;
          format?: string;
          pages?: number;
          highlights?: Json;
          is_premium?: boolean;
          downloads?: number;
          featured?: boolean;
          cover_image_url?: string | null;
          pdf_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          og_image_url?: string | null;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<EbookRow>;
        Relationships: [];
      };
      favorites: {
        Row: FavoriteRow;
        Insert: {
          id?: string;
          user_id: string;
          content_type: string;
          content_id: string;
          created_at?: string;
        };
        Update: Partial<FavoriteRow>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          role?: "super_admin" | "admin";
          created_at?: string;
        };
        Update: Partial<AdminUserRow>;
        Relationships: [];
      };
      affiliate_links: {
        Row: AffiliateLinkRow;
        Insert: Partial<AffiliateLinkRow> & {
          title: string;
          slug: string;
          category: string;
        };
        Update: Partial<AffiliateLinkRow>;
        Relationships: [];
      };
      affiliate_clicks: {
        Row: AffiliateClickRow;
        Insert: {
          id?: string;
          affiliate_id: string;
          source_page?: string;
          source_type?: string;
          created_at?: string;
        };
        Update: Partial<AffiliateClickRow>;
        Relationships: [];
      };
      newsletter_leads: {
        Row: NewsletterLeadRow;
        Insert: {
          id?: string;
          name: string;
          email: string;
          source?: string;
          created_at?: string;
        };
        Update: Partial<NewsletterLeadRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
      get_admin_role: { Args: Record<string, never>; Returns: "super_admin" | "admin" };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = ProfileRow;
export type UserPreference = UserPreferenceRow;
export type {
  ArticleRow,
  ProtocolRow,
  EbookRow,
  FavoriteRow,
  AdminUserRow,
  AffiliateLinkRow,
};

export interface UserProfileData {
  profile: Profile | null;
  preferences: UserPreference | null;
}
