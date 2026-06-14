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
  plan: "free" | "premium_monthly" | "premium_quarterly" | "premium_annual" | "admin";
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

type LibraryItemRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  category_label: string;
  item_type: string;
  tier: "free" | "premium";
  is_premium: boolean;
  image_url: string | null;
  estimated_read_time: string;
  featured: boolean;
  assets: Json;
  long_description: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

type MarketplaceProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  category_label: string;
  product_type: string;
  fulfillment: "digital" | "affiliate" | "own" | "subscription";
  is_premium: boolean;
  image_url: string | null;
  current_price: number | null;
  old_price: number | null;
  installments: string | null;
  featured: boolean;
  editor_choice: boolean;
  library_slug: string | null;
  affiliate_slug: string | null;
  health_tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
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
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
};

export type NewsletterLeadRow = {
  id: string;
  name: string | null;
  email: string;
  source: string;
  interest: string | null;
  lead_score: string;
  content_context: Record<string, unknown>;
  updated_at: string;
  last_interaction_at: string | null;
  interaction_count: number;
  esp_provider: string | null;
  esp_external_id: string | null;
  esp_synced_at: string | null;
  esp_sync_error: string | null;
  created_at: string;
  phone: string | null;
  whatsapp_opt_in: boolean;
  whatsapp_opt_in_at: string | null;
  whatsapp_opt_out_at: string | null;
};

export type LeadInteractionRow = {
  id: string;
  lead_id: string;
  event_type: string;
  title: string;
  description: string | null;
  source: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type LeadAutomationRunRow = {
  id: string;
  lead_id: string;
  sequence_id: string;
  status: string;
  current_step_index: number;
  steps_completed: unknown[];
  next_step_at: string | null;
  esp_provider: string | null;
  started_at: string;
  completed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type WhatsAppTemplateRow = {
  id: string;
  template_key: string;
  meta_name: string;
  language_code: string;
  category: string;
  status: string;
  body_preview: string | null;
  variables: unknown;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type WhatsAppMessageRow = {
  id: string;
  lead_id: string | null;
  user_id: string | null;
  direction: string;
  message_type: string;
  template_key: string | null;
  phone: string;
  body: string | null;
  status: string;
  provider_message_id: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
};

export type WhatsAppAutomationRunRow = {
  id: string;
  lead_id: string;
  sequence_id: string;
  status: string;
  current_step_index: number;
  steps_completed: unknown[];
  next_step_at: string | null;
  started_at: string;
  completed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type NewsletterSubscriberRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
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

type UserSavedProtocolRow = {
  id: string;
  user_id: string;
  protocol_id: string;
  status: "saved" | "in_progress" | "completed";
  notes: string | null;
  saved_at: string;
  updated_at: string;
};

type UserContentAccessRow = {
  id: string;
  user_id: string;
  content_type: "article" | "protocol" | "ebook";
  content_id: string;
  content_title: string;
  content_slug: string | null;
  source_path: string | null;
  created_at: string;
};

type UserContentHistoryRow = {
  id: string;
  user_id: string;
  content_type: "article" | "protocol" | "ebook";
  content_id: string;
  content_title: string;
  content_slug: string | null;
  source_path: string | null;
  access_count: number;
  completed: boolean;
  first_accessed_at: string;
  last_accessed_at: string;
};

type UserProtocolHistoryRow = {
  id: string;
  user_id: string;
  protocol_id: string;
  view_count: number;
  first_viewed_at: string;
  last_viewed_at: string;
};

type ProtocolCategoryRow = {
  slug: string;
  label: string;
  description: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

type ContentRankingRow = {
  id: string;
  content_type: "article" | "protocol" | "ebook";
  content_key: string;
  content_title: string;
  content_slug: string | null;
  view_count: number;
  download_count: number;
  score: number;
  ranking_period: "all_time" | "30d" | "7d";
  rank_position: number;
  updated_at: string;
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
  billing_plan_id: string | null;
  metadata: Record<string, unknown>;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FinancialEventRow = {
  id: string;
  user_id: string;
  payment_id: string | null;
  subscription_id: string | null;
  event_type: string;
  title: string;
  description: string | null;
  amount_cents: number | null;
  currency: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

type UserToolResultRow = {
  id: string;
  user_id: string;
  tool_slug: string;
  result_json: Json;
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
          membership_tier?: "free" | "premium";
          plan?: "free" | "premium_monthly" | "premium_quarterly" | "premium_annual" | "admin";
          club_joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          membership_tier?: "free" | "premium";
          plan?: "free" | "premium_monthly" | "premium_quarterly" | "premium_annual" | "admin";
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
      library_items: {
        Row: LibraryItemRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          long_description?: string;
          category: string;
          category_label: string;
          item_type: string;
          tier?: "free" | "premium";
          is_premium?: boolean;
          image_url?: string | null;
          estimated_read_time?: string;
          featured?: boolean;
          assets?: Json;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          og_image_url?: string | null;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<LibraryItemRow>;
        Relationships: [];
      };
      marketplace_products: {
        Row: MarketplaceProductRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          category_label: string;
          product_type: string;
          fulfillment: MarketplaceProductRow["fulfillment"];
          is_premium?: boolean;
          image_url?: string | null;
          current_price?: number | null;
          old_price?: number | null;
          installments?: string | null;
          featured?: boolean;
          editor_choice?: boolean;
          library_slug?: string | null;
          affiliate_slug?: string | null;
          health_tags?: string[];
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          og_image_url?: string | null;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<MarketplaceProductRow>;
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
          user_agent?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Update: Partial<AffiliateClickRow>;
        Relationships: [];
      };
      newsletter_leads: {
        Row: NewsletterLeadRow;
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          source?: string;
          interest?: string | null;
          lead_score?: string;
          content_context?: Record<string, unknown>;
          updated_at?: string;
          last_interaction_at?: string | null;
          interaction_count?: number;
          esp_provider?: string | null;
          esp_external_id?: string | null;
          esp_synced_at?: string | null;
          esp_sync_error?: string | null;
          created_at?: string;
        };
        Update: Partial<NewsletterLeadRow>;
        Relationships: [];
      };
      lead_interactions: {
        Row: LeadInteractionRow;
        Insert: {
          id?: string;
          lead_id: string;
          event_type: string;
          title: string;
          description?: string | null;
          source?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<LeadInteractionRow>;
        Relationships: [];
      };
      lead_automation_runs: {
        Row: LeadAutomationRunRow;
        Insert: {
          id?: string;
          lead_id: string;
          sequence_id: string;
          status?: string;
          current_step_index?: number;
          steps_completed?: unknown[];
          next_step_at?: string | null;
          esp_provider?: string | null;
          started_at?: string;
          completed_at?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<LeadAutomationRunRow>;
        Relationships: [];
      };
      whatsapp_templates: {
        Row: WhatsAppTemplateRow;
        Insert: Partial<WhatsAppTemplateRow>;
        Update: Partial<WhatsAppTemplateRow>;
        Relationships: [];
      };
      whatsapp_messages: {
        Row: WhatsAppMessageRow;
        Insert: Partial<WhatsAppMessageRow>;
        Update: Partial<WhatsAppMessageRow>;
        Relationships: [];
      };
      whatsapp_automation_runs: {
        Row: WhatsAppAutomationRunRow;
        Insert: Partial<WhatsAppAutomationRunRow>;
        Update: Partial<WhatsAppAutomationRunRow>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
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
      user_saved_protocols: {
        Row: UserSavedProtocolRow;
        Insert: {
          id?: string;
          user_id: string;
          protocol_id: string;
          status?: UserSavedProtocolRow["status"];
          notes?: string | null;
          saved_at?: string;
          updated_at?: string;
        };
        Update: Partial<UserSavedProtocolRow>;
        Relationships: [];
      };
      user_content_access: {
        Row: UserContentAccessRow;
        Insert: {
          id?: string;
          user_id: string;
          content_type: UserContentAccessRow["content_type"];
          content_id: string;
          content_title: string;
          content_slug?: string | null;
          source_path?: string | null;
          created_at?: string;
        };
        Update: Partial<UserContentAccessRow>;
        Relationships: [];
      };
      user_content_history: {
        Row: UserContentHistoryRow;
        Insert: {
          id?: string;
          user_id: string;
          content_type: UserContentHistoryRow["content_type"];
          content_id: string;
          content_title: string;
          content_slug?: string | null;
          source_path?: string | null;
          access_count?: number;
          completed?: boolean;
          first_accessed_at?: string;
          last_accessed_at?: string;
        };
        Update: Partial<UserContentHistoryRow>;
        Relationships: [];
      };
      protocol_categories: {
        Row: ProtocolCategoryRow;
        Insert: Partial<ProtocolCategoryRow> & Pick<ProtocolCategoryRow, "slug" | "label">;
        Update: Partial<ProtocolCategoryRow>;
        Relationships: [];
      };
      user_protocol_history: {
        Row: UserProtocolHistoryRow;
        Insert: {
          id?: string;
          user_id: string;
          protocol_id: string;
          view_count?: number;
          first_viewed_at?: string;
          last_viewed_at?: string;
        };
        Update: Partial<UserProtocolHistoryRow>;
        Relationships: [];
      };
      user_tool_results: {
        Row: UserToolResultRow;
        Insert: {
          id?: string;
          user_id: string;
          tool_slug: string;
          result_json?: Json;
          created_at?: string;
        };
        Update: Partial<UserToolResultRow>;
        Relationships: [];
      };
      content_rankings: {
        Row: ContentRankingRow;
        Insert: {
          id?: string;
          content_type: ContentRankingRow["content_type"];
          content_key: string;
          content_title: string;
          content_slug?: string | null;
          view_count?: number;
          download_count?: number;
          score?: number;
          ranking_period?: ContentRankingRow["ranking_period"];
          rank_position?: number;
          updated_at?: string;
        };
        Update: Partial<ContentRankingRow>;
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
          billing_plan_id?: string | null;
          metadata?: Record<string, unknown>;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PaymentRow>;
        Relationships: [];
      };
      financial_events: {
        Row: FinancialEventRow;
        Insert: {
          id?: string;
          user_id: string;
          payment_id?: string | null;
          subscription_id?: string | null;
          event_type: string;
          title: string;
          description?: string | null;
          amount_cents?: number | null;
          currency?: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<FinancialEventRow>;
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
      refresh_content_rankings: { Args: Record<string, never>; Returns: number };
      get_user_recommendations: {
        Args: {
          p_user_id: string;
          p_limit?: number;
          p_include_premium?: boolean;
        };
        Returns: Array<{
          kind: string;
          content_type: string;
          content_id: string;
          content_title: string;
          content_slug: string;
          category_label: string | null;
          is_premium: boolean;
          reason: string;
          score: number;
        }>;
      };
      record_protocol_view: {
        Args: { p_user_id: string; p_protocol_id: string };
        Returns: undefined;
      };
      save_user_tool_result: {
        Args: { p_tool_slug: string; p_result_json?: Json };
        Returns: string;
      };
      capture_newsletter_lead: {
        Args: {
          p_name: string;
          p_email: string;
          p_source: string;
          p_interest: string;
          p_lead_score: string;
          p_content_context?: Record<string, unknown>;
          p_phone?: string | null;
          p_whatsapp_opt_in?: boolean;
        };
        Returns: Array<{
          lead_id: string;
          is_existing: boolean;
          final_score: string;
          previous_score: string | null;
        }>;
      };
      lead_score_rank: {
        Args: { p_score: string };
        Returns: number;
      };
      get_finance_dashboard_stats: {
        Args: Record<string, never>;
        Returns: Record<string, unknown>;
      };
      get_whatsapp_dashboard_stats: {
        Args: Record<string, never>;
        Returns: Record<string, unknown>;
      };
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
  LibraryItemRow,
  MarketplaceProductRow,
  FavoriteRow,
  AdminUserRow,
  AffiliateLinkRow,
  SubscriptionRow,
  UserDownloadRow,
  UserSavedProtocolRow,
  UserContentAccessRow,
  UserContentHistoryRow,
  ContentRankingRow,
  PaymentRow,
  PaymentWebhookEventRow,
};

export interface UserProfileData {
  profile: Profile | null;
  preferences: UserPreference | null;
}
