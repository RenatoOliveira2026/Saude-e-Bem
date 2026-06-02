"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  uploadCmsImageAction,
  type UploadResult,
} from "@/lib/admin/actions/upload.actions";
import { validateImageFileSize } from "@/lib/admin/cms/upload-limits";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState, startTransition } from "react";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  folder: string;
  defaultUrl?: string;
  hint?: string;
  onUrlChange?: (url: string) => void;
}

export function ImageUploadField({
  label,
  name,
  folder,
  defaultUrl = "",
  hint,
  onUrlChange,
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadState, uploadAction, uploading] = useActionState(
    uploadCmsImageAction,
    {} as UploadResult,
  );

  useEffect(() => {
    if (uploadState.url) {
      setUrl(uploadState.url);
      onUrlChange?.(uploadState.url);
    }
  }, [uploadState.url, onUrlChange]);

  useEffect(() => {
    onUrlChange?.(url);
  }, [url, onUrlChange]);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    const sizeError = validateImageFileSize(file.size);
    if (sizeError) {
      setLocalError(sizeError);
      return;
    }
    setLocalError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    startTransition(() => {
      uploadAction(fd);
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-off-white p-4">
      <input type="hidden" name={name} value={url} />
      <Input
        label={label}
        name={`${name}_display`}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        hint={hint ?? "URL da imagem ou envie um arquivo abaixo (máx. 5 MB)"}
      />
      {url && (
        <div className="relative aspect-video max-h-48 overflow-hidden rounded-lg border border-border bg-surface">
          <Image src={url} alt="Capa" fill className="object-cover" unoptimized />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void handleFileChange(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Enviando…" : "Enviar imagem"}
        </Button>
        {uploadState.error && (
          <span className="text-sm text-red-600">{uploadState.error}</span>
        )}
        {localError && !uploadState.error && (
          <span className="text-sm text-red-600">{localError}</span>
        )}
      </div>
    </div>
  );
}
