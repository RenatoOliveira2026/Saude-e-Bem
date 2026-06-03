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
  membership_tier: "free" | "premium";
  club_joined_at: string | null;
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
  is_premium: boolean;
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

type NewsletterSubscriberRow = {
  id: string;
  name: string;
  email: string;
  source: string;
  status: string;
  provider: string | null;
  external_id: string | null;
  synced_at: string | null;
  sync_error: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type AnalyticsEventRow = {
  id: string;
  event_type: string;
  source_page: string;
  source_type: string;
  content_id: string | null;
  content_title: string | null;
  user_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

type FavoriteRow = {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  created_at: string;
};

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: "free" | "premium";
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "expired"
    | "pending";
  provider: "manual" | "stripe" | "internal" | "mercadopago";
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  mercadopago_preapproval_id: string | null;
  billing_plan_id: string | null;
  auto_renew: boolean;
  cancel_at_period_end: boolean;
  mercadopago_payer_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type PaymentWebhookEventRow = {
  id: string;
  provider: "mercadopago";
  event_key: string;
  topic: string;
  resource_id: string | null;
  payload: Record<string, unknown>;
  processed_at: string;
  result_message: string | null;
};

type UserDownloadRow = {
  id: string;
  user_id: string;
  content_type: "article" | "protocol" | "ebook";
  content_id: string;
  content_title: string;
  content_slug: string | null;
  created_at: string;
};

type PaymentRow = {
  id: string;
  user_id: string;
  subscription_id: string | null;
  provider: "mercadopago" | "manual" | "stripe" | "internal";
  external_id: string | null;
  preference_id: string | null;
  external_reference: string;
  status:
    | "pending"
    | "approved"
    | "authorized"
    | "in_process"
    | "in_mediation"
    | "rejected"
    | "cancelled"
    | "refunded"
    | "charged_back";
  payment_method:
    | "pix"
    | "credit_card"
    | "debit_card"
    | "ticket"
    | "account_money"
    | "unknown"
    | null;
  amount_cents: number;
  currency: string;
  description: string | null;
  metadata: Record<string, unknown>;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
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
          membership_tier?: "free" | "premium";
          club_joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          membership_tier?: "free" | "premium";
          club_joined_at?: string | null;
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
          is_premium?: boolean;
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
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: {
          id?: string;
          name: string;
          email: string;
          source?: string;
          status?: string;
          provider?: string | null;
          external_id?: string | null;
          synced_at?: string | null;
          sync_error?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<NewsletterSubscriberRow>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEventRow;
        Insert: {
          id?: string;
          event_type: string;
          source_page?: string;
          source_type?: string;
          content_id?: string | null;
          content_title?: string | null;
          user_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<AnalyticsEventRow>;
        Relationships: [];
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: {
          id?: string;
          user_id: string;
          plan?: "free" | "premium";
          status?: SubscriptionRow["status"];
          provider?: SubscriptionRow["provider"];
          current_period_start?: string | null;
          current_period_end?: string | null;
          canceled_at?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          mercadopago_preapproval_id?: string | null;
          billing_plan_id?: string | null;
          auto_renew?: boolean;
          cancel_at_period_end?: boolean;
          mercadopago_payer_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SubscriptionRow>;
        Relationships: [];
      };
      payment_webhook_events: {
        Row: PaymentWebhookEventRow;
        Insert: {
          id?: string;
          provider?: PaymentWebhookEventRow["provider"];
          event_key: string;
          topic: string;
          resource_id?: string | null;
          payload?: Record<string, unknown>;
          processed_at?: string;
          result_message?: string | null;
        };
        Update: Partial<PaymentWebhookEventRow>;
        Relationships: [];
      };
      user_downloads: {
        Row: UserDownloadRow;
        Insert: {
          id?: string;
          user_id: string;
          content_type: UserDownloadRow["content_type"];
          content_id: string;
          content_title: string;
          content_slug?: string | null;
          created_at?: string;
        };
        Update: Partial<UserDownloadRow>;
        Relationships: [];
      };
      payments: {
        Row: PaymentRow;
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          provider?: PaymentRow["provider"];
          external_id?: string | null;
          preference_id?: string | null;
          external_reference: string;
          status?: PaymentRow["status"];
          payment_method?: PaymentRow["payment_method"];
          amount_cents: number;
          currency?: string;
          description?: string | null;
          metadata?: Record<string, unknown>;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PaymentRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
      get_admin_role: { Args: Record<string, never>; Returns: "super_admin" | "admin" };
      user_has_active_premium: { Args: { p_user_id?: string }; Returns: boolean };
      touch_club_joined: { Args: { p_user_id: string }; Returns: undefined };
      expire_due_subscriptions: { Args: Record<string, never>; Returns: number };
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
  SubscriptionRow,
  UserDownloadRow,
  PaymentRow,
  PaymentWebhookEventRow,
};

export interface UserProfileData {
  profile: Profile | null;
  preferences: UserPreference | null;
}
