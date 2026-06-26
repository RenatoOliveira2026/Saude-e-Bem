import { getGa4MeasurementId } from "./ga4-config";

/** Eventos de crescimento — GA4 apenas (Fase 9.5). Sem alterar analytics_events / DB. */
export type GrowthFunnelEvent =
  | "signup_complete"
  | "email_verified"
  | "checkout_start"
  | "payment_approved"
  | "premium_activated"
  | "premium_subscribe"
  | "article_read"
  | "protocol_started"
  | "download_library"
  | "library_download"
  | "trail_started"
  | "trail_completed"
  | "onboarding_complete"
  | "content_shared"
  | "recommendation_click";

export interface GrowthEventParams {
  source?: string;
  contentType?: string;
  contentSlug?: string;
  contentTitle?: string;
  planSlug?: string;
  trailSlug?: string;
  origin?: string;
}

function sendGrowthEvent(event: GrowthFunnelEvent, params: GrowthEventParams = {}): void {
  if (typeof window === "undefined") return;

  const measurementId = getGa4MeasurementId();
  if (!measurementId || !window.gtag) return;

  window.gtag("event", event, {
    send_to: measurementId,
    event_timestamp: Date.now(),
    source: params.source,
    content_type: params.contentType,
    content_slug: params.contentSlug,
    content_title: params.contentTitle,
    plan_slug: params.planSlug,
    trail_slug: params.trailSlug,
    origin: params.origin,
    page_path: window.location.pathname,
  });
}

export function sendGa4SignupComplete(params?: GrowthEventParams): void {
  sendGrowthEvent("signup_complete", params);
}

export function sendGa4EmailVerified(params?: GrowthEventParams): void {
  sendGrowthEvent("email_verified", params);
}

export function sendGa4CheckoutStart(params?: GrowthEventParams): void {
  sendGrowthEvent("checkout_start", params);
}

export function sendGa4PaymentApproved(params?: GrowthEventParams): void {
  sendGrowthEvent("payment_approved", params);
}

export function sendGa4PremiumActivated(params?: GrowthEventParams): void {
  sendGrowthEvent("premium_activated", params);
  sendGrowthEvent("premium_subscribe", params);
}

export function sendGa4PremiumSubscribe(params?: GrowthEventParams): void {
  sendGa4PremiumActivated(params);
}

export function sendGa4ProtocolStarted(params?: GrowthEventParams): void {
  sendGrowthEvent("protocol_started", params);
}

export function sendGa4DownloadLibrary(params?: GrowthEventParams): void {
  sendGrowthEvent("download_library", params);
  sendGrowthEvent("library_download", params);
}

export function sendGa4LibraryDownload(params?: GrowthEventParams): void {
  sendGa4DownloadLibrary(params);
}

export function sendGa4ArticleRead(params?: GrowthEventParams): void {
  sendGrowthEvent("article_read", params);
}

export function sendGa4TrailStarted(params?: GrowthEventParams): void {
  sendGrowthEvent("trail_started", params);
}

export function sendGa4TrailCompleted(params?: GrowthEventParams): void {
  sendGrowthEvent("trail_completed", params);
}

export function sendGa4OnboardingComplete(params?: GrowthEventParams): void {
  sendGrowthEvent("onboarding_complete", params);
}

export function sendGa4ContentShared(params?: GrowthEventParams): void {
  sendGrowthEvent("content_shared", params);
}

export function sendGa4RecommendationClick(params?: GrowthEventParams): void {
  sendGrowthEvent("recommendation_click", params);
}

/** Catálogo documentado para admin / GTM */
export const GROWTH_FUNNEL_EVENTS: {
  event: GrowthFunnelEvent;
  label: string;
  description: string;
}[] = [
  { event: "signup_complete", label: "Cadastro", description: "Formulário de cadastro enviado" },
  { event: "email_verified", label: "E-mail confirmado", description: "Confirmação via /auth/verify" },
  { event: "checkout_start", label: "Início checkout", description: "Usuário em /assinar" },
  { event: "payment_approved", label: "Pagamento aprovado", description: "PIX/cartão/boleto confirmado" },
  { event: "premium_activated", label: "Premium ativado", description: "Membership premium ativa" },
  { event: "article_read", label: "Leitura artigo", description: "Artigo aberto" },
  { event: "protocol_started", label: "Protocolo iniciado", description: "Página de protocolo aberta" },
  { event: "download_library", label: "Download biblioteca", description: "Material baixado" },
  { event: "trail_started", label: "Trilha iniciada", description: "Primeiro passo em trilha premium" },
  { event: "trail_completed", label: "Trilha concluída", description: "100% de uma trilha" },
  { event: "onboarding_complete", label: "Onboarding", description: "Wizard concluído" },
  { event: "content_shared", label: "Compartilhamento", description: "ShareButton" },
  {
    event: "recommendation_click",
    label: "Clique em recomendação",
    description: "Motor Fase 10.0 — Minha Jornada",
  },
];
