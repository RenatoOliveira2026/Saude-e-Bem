import { getAdsensePublisherId } from "@/lib/ads/config";

/** ads.txt exigido pelo AdSense: autoriza o Google a vender os espaços do portal. */
export function GET() {
  const publisher = getAdsensePublisherId();
  const body = publisher
    ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`
    : "# AdSense ainda não configurado\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
