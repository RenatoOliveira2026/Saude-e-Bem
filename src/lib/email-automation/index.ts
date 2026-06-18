export type {
  AutomationDispatchResult,
  EmailAutomationProviderId,
  EmailAutomationSequence,
  EmailAutomationStep,
  LeadAutomationPayload,
} from "./types";
export { EMAIL_AUTOMATION_SEQUENCES, getSequenceForLead } from "./sequences";
export { LAUNCH_EMAIL_TEMPLATES, LAUNCH_SEQUENCE_ID } from "./launch-templates";
export { triggerLeadAutomation, processPendingAutomationSteps } from "./dispatcher";
export {
  configuredEmailProviders,
  isEmailAutomationConfigured,
  syncLeadToProviders,
} from "./providers";
