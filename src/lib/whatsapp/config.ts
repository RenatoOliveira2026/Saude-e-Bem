export function getWhatsAppConfig() {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID ?? "",
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? "",
    appSecret: process.env.WHATSAPP_APP_SECRET ?? "",
    defaultCountryCode: process.env.WHATSAPP_DEFAULT_COUNTRY_CODE ?? "55",
    displayNumber: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER ?? "",
    cronSecret: process.env.WHATSAPP_CRON_SECRET ?? "",
    stubMode: process.env.WHATSAPP_STUB_MODE === "1",
  };
}

export function isWhatsAppConfigured(): boolean {
  const { accessToken, phoneNumberId } = getWhatsAppConfig();
  return Boolean(accessToken && phoneNumberId);
}

export function isWhatsAppStubMode(): boolean {
  return getWhatsAppConfig().stubMode || process.env.NODE_ENV === "development";
}

export function canSendWhatsApp(): boolean {
  return isWhatsAppConfigured() || isWhatsAppStubMode();
}

export function getWhatsAppConfigSummary() {
  const config = getWhatsAppConfig();
  return {
    configured: isWhatsAppConfigured(),
    stubMode: isWhatsAppStubMode(),
    displayNumber: config.displayNumber,
    webhookVerifyTokenConfigured: Boolean(config.webhookVerifyToken),
    appSecretConfigured: Boolean(config.appSecret),
  };
}

export function buildWhatsAppClickToChatUrl(message: string): string | null {
  const { displayNumber } = getWhatsAppConfig();
  if (!displayNumber) return null;
  const digits = displayNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
