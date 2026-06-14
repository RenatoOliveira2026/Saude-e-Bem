import { trackEvent } from "@/lib/analytics/track-event";
import { resolveAffiliateUrl } from "@/lib/affiliates/mappers";
import { isValidPublicSlug, notFoundSeoHeaders } from "@/lib/seo/slug";
import { recordAffiliateClick } from "@/lib/supabase/services/affiliates.clicks";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isValidPublicSlug(slug)) {
    return new NextResponse(null, {
      status: 404,
      headers: notFoundSeoHeaders(),
    });
  }

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
    return new NextResponse(null, {
      status: 404,
      headers: notFoundSeoHeaders(),
    });
  }

  const destination = resolveAffiliateUrl(data);
  if (!destination) {
    return new NextResponse(null, {
      status: 404,
      headers: notFoundSeoHeaders(),
    });
  }

  await recordAffiliateClick({
    affiliateId: data.id,
    sourcePage,
    sourceType,
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
  });

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
