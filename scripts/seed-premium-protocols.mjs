/**
 * Insere/atualiza 10 protocolos premium no Supabase — Fase 7.1B
 * Uso: npm run seed:premium-protocols
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import {
  enrichLibraryItem,
  enrichProtocol,
  premiumProtocolId,
} from "./premium-protocols-71b-builder.mjs";
import { PREMIUM_PROTOCOL_DEFINITIONS } from "./premium-protocols-71b-data.mjs";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const protocols = PREMIUM_PROTOCOL_DEFINITIONS.map((def, index) => {
  const enriched = enrichProtocol(def, index);
  return {
    id: premiumProtocolId(index),
    slug: enriched.slug,
    title: enriched.title,
    description: enriched.description,
    objective: enriched.objective,
    long_description: enriched.longDescription,
    category: enriched.category,
    category_label: enriched.category_label,
    duration: enriched.duration,
    level: enriched.level,
    benefits: enriched.benefits,
    steps: enriched.steps,
    is_premium: enriched.is_premium,
    featured: enriched.featured,
    tag: enriched.tag,
    participants: enriched.participants,
    cover_image_url: enriched.cover_image_url,
    content: enriched.content,
    seo_title: enriched.seo_title,
    seo_description: enriched.seo_description,
    seo_keywords: enriched.seo_keywords,
    og_image_url: enriched.og_image_url,
    status: "published",
  };
});

const libraryItems = protocols.map((p, index) => enrichLibraryItem(p, index));

const { error: protocolError } = await supabase.from("protocols").upsert(protocols, {
  onConflict: "slug",
});

if (protocolError) {
  console.error("❌ Falha ao inserir protocolos:", protocolError.message);
  process.exit(1);
}

const { error: libraryError } = await supabase.from("library_items").upsert(libraryItems, {
  onConflict: "slug",
});

if (libraryError) {
  console.error("❌ Falha ao inserir biblioteca:", libraryError.message);
  process.exit(1);
}

console.log(`✅ ${protocols.length} protocolos premium sincronizados.`);
console.log(`✅ ${libraryItems.length} itens de biblioteca sincronizados.`);
