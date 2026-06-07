export {
  buildWhatsAppClickToChatUrl,
  canSendWhatsApp,
  getWhatsAppConfig,
  getWhatsAppConfigSummary,
  isWhatsAppConfigured,
  isWhatsAppStubMode,
} from "./config";
export { sendWhatsAppTemplate } from "./client";
export {
  findLeadByEmailForWhatsApp,
  findLeadByPhone,
  insertWhatsAppMessage,
  listLeadWhatsAppMessages,
  listRecentWhatsAppMessages,
} from "./messages.service";
export {
  sendPremiumConfirmationWhatsApp,
  sendRenewalReminderWhatsApp,
  sendWelcomeWhatsApp,
  sendWhatsAppTemplateToLead,
} from "./outbound.service";
export { processWhatsAppWebhook } from "./inbound.service";
export {
  processDueWhatsAppAutomations,
  processRenewalReminders,
  startWhatsAppAutomation,
} from "./automation.service";
export {
  formatPhoneDisplay,
  normalizeWhatsAppPhone,
  validateWhatsAppPhone,
} from "./phone";
export { verifyWhatsAppWebhookSignature } from "./signature";
export type {
  SendTemplateInput,
  WhatsAppMessage,
  WhatsAppTemplate,
  WhatsAppTemplateKey,
  WhatsAppWebhookPayload,
} from "./types";
