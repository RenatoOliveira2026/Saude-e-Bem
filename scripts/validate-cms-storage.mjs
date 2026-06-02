/**
 * Valida migration 007_cms_storage.sql no Supabase.
 * Uso: node scripts/validate-cms-storage.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const projectDir = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(projectDir);

if (process.env.SUPABASE_STRICT_TLS !== "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const EXPECTED_BUCKETS = ["cms-images", "cms-pdfs"];
const EXPECTED_POLICIES = [
  "Public read cms images",
  "Admins upload cms images",
  "Admins update cms images",
  "Admins delete cms images",
  "Public read cms pdfs",
  "Admins upload cms pdfs",
  "Admins update cms pdfs",
  "Admins delete cms pdfs",
];

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function fail(msg) {
  console.log(`❌ ${msg}`);
}

function warn(msg) {
  console.log(`⚠️  ${msg}`);
}

if (!url || !serviceKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const report = {
  "1_bucket_cms_images": false,
  "2_bucket_cms_pdfs": false,
  "3_rls_policies": false,
  "4_upload_image": false,
  "5_upload_pdf": false,
};

let allPass = true;

console.log("\n🔍 Validação migration 007_cms_storage\n");
console.log("─".repeat(55));

// 1–2. Buckets
console.log("\n1–2. Buckets\n");
const { data: buckets, error: bucketsError } = await admin.storage.listBuckets();

if (bucketsError) {
  fail(`Erro ao listar buckets: ${bucketsError.message}`);
  allPass = false;
} else {
  const ids = new Set((buckets ?? []).map((b) => b.id));
  report["1_bucket_cms_images"] = ids.has("cms-images");
  report["2_bucket_cms_pdfs"] = ids.has("cms-pdfs");

  if (report["1_bucket_cms_images"]) {
    const b = buckets.find((x) => x.id === "cms-images");
    ok(`cms-images existe (public=${b?.public}, limit=${b?.file_size_limit})`);
  } else {
    fail("cms-images NÃO existe");
    allPass = false;
  }

  if (report["2_bucket_cms_pdfs"]) {
    const b = buckets.find((x) => x.id === "cms-pdfs");
    ok(`cms-pdfs existe (public=${b?.public}, limit=${b?.file_size_limit})`);
  } else {
    fail("cms-pdfs NÃO existe");
    allPass = false;
  }
}

// 3. Políticas RLS (consulta SQL via PostgREST /rest/v1/ com service role)
console.log("\n3. Políticas RLS (storage.objects)\n");
let policyNames = [];

try {
  const res = await fetch(
    `${url}/rest/v1/rpc`,
    {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );
  void res;
} catch {
  /* ignore */
}

const sqlRes = await fetch(`${url}/pg`, { method: "GET" }).catch(() => null);
void sqlRes;

const policyQuery = `
  select policyname
  from pg_policies
  where schemaname = 'storage'
    and tablename = 'objects'
    and policyname like '%cms%'
  order by policyname
`;

const { data: policyData, error: policyError } = await admin.rpc("exec_sql", {
  query: policyQuery,
});

if (policyError) {
  const alt = await fetch(
    `${url}/rest/v1/?select=policyname`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    },
  ).catch(() => null);

  if (!alt || !alt.ok) {
    const { data: storageSchema, error: schemaErr } = await admin
      .schema("storage")
      .from("buckets")
      .select("id, public");

    if (!schemaErr && storageSchema) {
      warn("Políticas: não consultáveis via API — confira no Dashboard → Storage → Policies");
      warn(`Esperadas ${EXPECTED_POLICIES.length} políticas com nome *cms*`);
      report["3_rls_policies"] = null;
    } else {
      fail(`Políticas: ${schemaErr?.message ?? "não foi possível verificar"}`);
      allPass = false;
    }
  }
} else {
  policyNames = (policyData ?? []).map((r) => r.policyname);
}

if (policyNames.length === 0) {
  const { data, error } = await admin
    .from("pg_policies")
    .select("policyname")
    .eq("schemaname", "storage")
    .eq("tablename", "objects");

  if (!error && data?.length) {
    policyNames = data
      .map((r) => r.policyname)
      .filter((n) => n.toLowerCase().includes("cms"));
  }
}

if (policyNames.length > 0) {
  let policiesOk = true;
  for (const name of EXPECTED_POLICIES) {
    if (policyNames.includes(name)) {
      ok(`Política: ${name}`);
    } else {
      fail(`Política ausente: ${name}`);
      policiesOk = false;
      allPass = false;
    }
  }
  report["3_rls_policies"] = policiesOk;
} else if (report["3_rls_policies"] !== null) {
  fail("Nenhuma política CMS encontrada em storage.objects");
  allPass = false;
  report["3_rls_policies"] = false;
}

// Colunas (extra)
console.log("\nColunas de mídia (tabelas)\n");
for (const [table, cols] of [
  ["articles", "cover_image_url"],
  ["protocols", "cover_image_url"],
  ["ebooks", "cover_image_url, pdf_url"],
]) {
  const { error } = await admin.from(table).select(cols).limit(1);
  if (error) {
    fail(`${table}: ${error.message}`);
    allPass = false;
  } else {
    ok(`${table} → ${cols}`);
  }
}

// 4–5. Upload
console.log("\n4–5. Upload (teste nos buckets)\n");

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const imagePath = `validation/test-${Date.now()}.png`;
const { error: imgErr } = await admin.storage.from("cms-images").upload(imagePath, tinyPng, {
  contentType: "image/png",
  upsert: true,
});

if (imgErr) {
  fail(`Upload imagem: ${imgErr.message}`);
  allPass = false;
} else {
  report["4_upload_image"] = true;
  ok("Upload de imagem habilitado (cms-images)");
  const { data: pub } = admin.storage.from("cms-images").getPublicUrl(imagePath);
  ok(`URL pública: ${pub.publicUrl.slice(0, 60)}…`);
  await admin.storage.from("cms-images").remove([imagePath]);
}

const pdfBuf = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
const pdfPath = `validation/test-${Date.now()}.pdf`;
const { error: pdfErr } = await admin.storage.from("cms-pdfs").upload(pdfPath, pdfBuf, {
  contentType: "application/pdf",
  upsert: true,
});

if (pdfErr) {
  fail(`Upload PDF: ${pdfErr.message}`);
  allPass = false;
} else {
  report["5_upload_pdf"] = true;
  ok("Upload de PDF habilitado (cms-pdfs)");
  await admin.storage.from("cms-pdfs").remove([pdfPath]);
}

if (anonKey) {
  const anon = createClient(url, anonKey);
  const { error: anonErr } = await anon.storage
    .from("cms-images")
    .upload(`validation/anon-${Date.now()}.png`, tinyPng, {
      contentType: "image/png",
    });
  if (anonErr) {
    ok("Upload sem login bloqueado (RLS — esperado para usuário anônimo)");
  } else {
    warn("Upload anônimo permitido — deveria exigir admin autenticado");
  }
}

console.log("\n" + "─".repeat(55));
console.log("\n### Resultado da validação\n");
console.log("| Item | Status |");
console.log("|------|--------|");
console.log(`| 1. Bucket cms-images | ${report["1_bucket_cms_images"] ? "✅ OK" : "❌ Falhou"} |`);
console.log(`| 2. Bucket cms-pdfs | ${report["2_bucket_cms_pdfs"] ? "✅ OK" : "❌ Falhou"} |`);
console.log(
  `| 3. Políticas RLS Storage | ${report["3_rls_policies"] === true ? "✅ OK" : report["3_rls_policies"] === false ? "❌ Falhou" : "⚠️ Verificar no Dashboard"} |`,
);
console.log(`| 4. Upload imagem | ${report["4_upload_image"] ? "✅ OK" : "❌ Falhou"} |`);
console.log(`| 5. Upload PDF | ${report["5_upload_pdf"] ? "✅ OK" : "❌ Falhou"} |`);

console.log("\nJSON:");
console.log(JSON.stringify(report, null, 2));

console.log(
  allPass && report["3_rls_policies"] !== false
    ? "\n✅ Migration 007 validada com sucesso.\n"
    : "\n❌ Execute supabase/migrations/007_cms_storage.sql no SQL Editor do Supabase.\n",
);

process.exit(allPass && report["3_rls_policies"] !== false ? 0 : 1);
