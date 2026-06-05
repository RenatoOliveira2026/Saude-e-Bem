import type { JsonLd } from "@/lib/seo/json-ld";

interface JsonLdScriptProps {
  data: JsonLd | JsonLd[];
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}
