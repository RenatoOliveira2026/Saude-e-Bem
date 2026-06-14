/**
 * Auditoria SEO estática — slugs, sitemap, links internos, probes.
 * Uso: node scripts/audit-seo.mjs [baseUrl]
 */
import nextEnv from "@next/env";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, "..");
loadEnvConfig(projectDir);

const PUBLIC_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KNOWN_PROBE_URLS = [
  "/14egx_67914425b671een",
  "/fcr81eeqjh2de45aalzunfow3_7wsbrdb",
  "/blog/14egx_67914425b671een",
  "/api/affiliates/fcr81eeqjh2de45aalzunfow3_7wsbrdb/go",
];

function isValidPublicSlug(slug) {
  return slug && slug.length <= 120 && PUBLIC_SLUG_PATTERN.test(slug);
}

function isLikelyBotProbePath(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") return false;
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length !== 1) return false;
  const segment = segments[0].toLowerCase();
  if (segment.includes("_")) return true;
  if (segment.length >= 24 && !segment.includes("-") && /^[a-z0-9]+$/i.test(segment)) {
    return true;
  }
  return false;
}

function collectAppRoutes(dir, prefix = "") {
  const routes = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (entry.startsWith("(") && entry.endsWith(")")) {
      routes.push(...collectAppRoutes(full, prefix));
      continue;
    }
    if (entry.startsWith("_")) continue;
    if (entry.startsWith("[")) {
      routes.push(`${prefix}/[dynamic]`);
      continue;
    }
    const pagePath = join(full, "page.tsx");
    try {
      statSync(pagePath);
      routes.push(`${prefix}/${entry}`);
    } catch {
      /* no page */
    }
    routes.push(...collectAppRoutes(full, `${prefix}/${entry}`));
  }
  return routes;
}

function grepBrokenInternalLinks() {
  const issues = [];
  const srcDir = join(projectDir, "src");
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?|md)$/.test(entry)) continue;
      const content = readFileSync(full, "utf8");
      if (content.includes('href="#"') || content.includes("href={'#'}") || content.includes('href={"#"}')) {
        issues.push(full.replace(projectDir + "\\", "").replace(projectDir + "/", ""));
      }
    }
  };
  walk(srcDir);
  return issues;
}

async function probeUrl(baseUrl, path) {
  try {
    const res = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
    const robots = res.headers.get("x-robots-tag") ?? "";
    return { path, status: res.status, robots };
  } catch (error) {
    return { path, status: "ERR", error: String(error) };
  }
}

const baseUrl = process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
const normalizedBase = baseUrl.startsWith("http") ? baseUrl.replace(/\/+$/, "") : `https://${baseUrl}`;

const appRoutes = collectAppRoutes(join(projectDir, "src", "app"));
const brokenLinks = grepBrokenInternalLinks();

let sitemapCount = 0;
let invalidSitemapSlugs = 0;
try {
  const sitemapRes = await fetch(`${normalizedBase}/sitemap.xml`);
  const xml = await sitemapRes.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  sitemapCount = locs.length;
  for (const loc of locs) {
    const path = loc.replace(normalizedBase, "");
    const slugMatch = path.match(/\/(?:blog|biblioteca|protocolos|marketplace|ferramentas|recomendados)\/([^/]+)/);
    if (slugMatch && !isValidPublicSlug(slugMatch[1])) invalidSitemapSlugs += 1;
  }
} catch {
  sitemapCount = -1;
}

const probeResults = [];
for (const path of KNOWN_PROBE_URLS) {
  probeResults.push(await probeUrl(normalizedBase, path));
}

console.log(
  JSON.stringify(
    {
      baseUrl: normalizedBase,
      appRouteCount: appRoutes.length,
      sitemapUrlCount: sitemapCount,
      invalidSitemapSlugs,
      brokenHashLinks: brokenLinks,
      botProbeDetection: KNOWN_PROBE_URLS.map((p) => ({
        path: p,
        detectedAsProbe: isLikelyBotProbePath(p) || !isValidPublicSlug(p.split("/").pop() ?? ""),
      })),
      liveProbes: probeResults,
    },
    null,
    2,
  ),
);
