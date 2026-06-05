export type {
  AutomationDispatchResult,
  EmailAutomationProviderId,
  EmailAutomationSequence,
  EmailAutomationStep,
  LeadAutomationPayload,
} from "./types";
export { EMAIL_AUTOMATION_SEQUENCES, getSequenceForLead } from "./sequences";
export { triggerLeadAutomation, processPendingAutomationSteps } from "./dispatcher";
export {
  configuredEmailProviders,
  isEmailAutomationConfigured,
  syncLeadToProviders,
} from "./providers";
