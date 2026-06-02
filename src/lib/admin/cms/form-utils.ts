export type ContentPublishStatus = "published" | "draft" | "archived";

export function resolvePublishStatus(formData: FormData): ContentPublishStatus {
  const intent = formData.get("intent")?.toString();
  if (intent === "publish") return "published";
  if (intent === "archive") return "archived";
  if (intent === "draft") return "draft";

  const status = formData.get("status")?.toString();
  if (status === "published" || status === "archived") return status;
  return "draft";
}

export function optionalUrl(formData: FormData, key: string): string | null {
  const value = formData.get(key)?.toString().trim();
  return value || null;
}

export function parseSeoFields(formData: FormData) {
  const get = (key: string) => formData.get(key)?.toString().trim() ?? "";
  return {
    seo_title: get("seo_title") || null,
    seo_description: get("seo_description") || null,
    seo_keywords: get("seo_keywords") || null,
    og_image_url: optionalUrl(formData, "og_image_url"),
  };
}
