import { getAdsenseClientId } from "@/lib/ads/config";

/**
 * Código do AdSense no <head>, já no HTML enviado pelo servidor.
 * O robô do AdSense procura o snippet no HTML inicial para verificar o site:
 * carregado depois (next/script afterInteractive), ele não era encontrado.
 * Só aparece quando o publicador está configurado.
 */
export function AdSenseScript() {
  const client = getAdsenseClientId();
  if (!client) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
