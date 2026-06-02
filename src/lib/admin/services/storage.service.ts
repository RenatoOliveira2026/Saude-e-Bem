import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/admin/utils";

const IMAGE_BUCKET = "cms-images";
const PDF_BUCKET = "cms-pdfs";

function buildObjectPath(folder: string, fileName: string): string {
  const safeName = slugify(fileName.replace(/\.[^.]+$/, "")) || "arquivo";
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  return `${folder}/${Date.now()}-${safeName}.${ext}`;
}

export async function uploadCmsFile(
  bucket: typeof IMAGE_BUCKET | typeof PDF_BUCKET,
  folder: string,
  file: File,
): Promise<string> {
  const supabase = await createClient();
  const path = buildObjectPath(folder, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export { IMAGE_BUCKET, PDF_BUCKET };
