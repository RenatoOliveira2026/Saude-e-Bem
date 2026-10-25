import { getAdsenseClientId } from "@/lib/ads/config";
import Script from "next/script";

/** Carrega o script do AdSense só quando o publicador está configurado. */
export function AdSenseScript() {
  const client = getAdsenseClientId();
  if (!client) return null;

  return (
    <Script
      id="adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
