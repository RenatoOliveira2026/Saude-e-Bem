import { trackEvent } from "@/lib/analytics/track-event";
import { resolveAffiliateUrl } from "@/lib/affiliates/mappers";
import { recordAffiliateClick } from "@/lib/supabase/services/affiliates.clicks";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const sourcePage = searchParams.get("source_page") ?? "";
  const sourceType = searchParams.get("source_type") ?? "direct";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("affiliate_links")
    .select("id, title, slug, affiliate_url, url")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(new URL("/recomendados", request.url));
  }

  const destination = resolveAffiliateUrl(data);
  if (!destination) {
    return NextResponse.redirect(new URL("/recomendados", request.url));
  }

  await recordAffiliateClick(data.id, sourcePage, sourceType);

  void trackEvent({
    eventType: "affiliate_click",
    sourcePage,
    sourceType,
    contentId: data.id,
    contentTitle: data.title ?? slug,
    metadata: { slug: data.slug ?? slug },
  });

  return NextResponse.redirect(destination);
}
