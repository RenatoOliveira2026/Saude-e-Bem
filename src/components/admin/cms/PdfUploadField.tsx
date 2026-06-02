"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  uploadCmsPdfAction,
  type UploadResult,
} from "@/lib/admin/actions/upload.actions";
import { validatePdfFileSize } from "@/lib/admin/cms/upload-limits";
import { useActionState, useEffect, useRef, useState, startTransition } from "react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PdfUploadFieldProps {
  name: string;
  folder?: string;
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
}

export function PdfUploadField({
  name,
  folder = "biblioteca",
  defaultUrl = "",
  onUrlChange,
}: PdfUploadFieldProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [localError, setLocalError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    fileName?: string;
    sizeBytes?: number;
    uploadedAt?: string;
  }>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadState, uploadAction, uploading] = useActionState(
    uploadCmsPdfAction,
    {} as UploadResult,
  );

  useEffect(() => {
    if (uploadState.url) {
      setUrl(uploadState.url);
      setMeta({
        fileName: uploadState.fileName,
        sizeBytes: uploadState.sizeBytes,
        uploadedAt: uploadState.uploadedAt,
      });
      onUrlChange?.(uploadState.url);
    }
  }, [uploadState, onUrlChange]);

  useEffect(() => {
    onUrlChange?.(url);
  }, [url, onUrlChange]);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-off-white p-4">
      <input type="hidden" name={name} value={url} />
      <p className="font-heading text-sm font-medium text-forest">Upload PDF</p>
      <p className="text-xs text-muted">Bucket: cms-pdfs</p>
      <Input
        label="URL do PDF"
        name={`${name}_display`}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        hint="Envie o arquivo ou cole a URL pública (PDF até 20 MB)"
      />
      {url && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
          <p className="font-medium text-forest">
            {meta.fileName ?? "PDF anexado"}
          </p>
          {meta.sizeBytes != null && (
            <p className="mt-1 text-muted">Tamanho: {formatBytes(meta.sizeBytes)}</p>
          )}
          {meta.uploadedAt && (
            <p className="mt-1 text-muted">
              Enviado em:{" "}
              {new Date(meta.uploadedAt).toLocaleString("pt-BR")}
            </p>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sage hover:underline"
          >
            Abrir PDF
          </a>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const sizeError = validatePdfFileSize(file.size);
            if (sizeError) {
              setLocalError(sizeError);
              e.target.value = "";
              return;
            }
            setLocalError(null);
            const fd = new FormData();
            fd.set("file", file);
            fd.set("folder", folder);
            startTransition(() => {
              uploadAction(fd);
            });
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
          {uploading ? "Enviando…" : "Enviar PDF"}
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
