import type { MercadoPagoWebhookPayload } from "../types";

export function isMercadoPagoIpnNotification(input: {
  method: string;
  headers: Headers;
  queryType: string | null;
  queryDataId: string | null;
  queryTopic: string | null;
  queryId: string | null;
  payload: MercadoPagoWebhookPayload;
}): boolean {
  if (input.method === "GET" && input.queryTopic && input.queryId) {
    return (
      input.queryTopic.includes("payment") ||
      input.queryTopic.includes("preapproval") ||
      input.queryTopic === "subscription_preapproval"
    );
  }

  const topic =
    input.queryType ??
    input.payload.type ??
    input.payload.action ??
    "";
  const resourceId =
    input.queryDataId ?? input.payload.data?.id?.toString() ?? null;

  if (!resourceId) return false;

  return (
    topic.includes("payment") ||
    topic.includes("preapproval") ||
    topic === "subscription_preapproval" ||
    Boolean(input.payload.action?.includes("payment"))
  );
}

export function resolveIpnQueryParams(url: URL): {
  queryType: string | null;
  queryDataId: string | null;
  queryTopic: string | null;
  queryId: string | null;
} {
  return {
    queryType: url.searchParams.get("type"),
    queryDataId: url.searchParams.get("data.id"),
    queryTopic: url.searchParams.get("topic"),
    queryId: url.searchParams.get("id"),
  };
}
