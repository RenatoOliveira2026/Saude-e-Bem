"use client";

import { Button } from "@/components/ui/Button";

interface CmsActionBarProps {
  pending: boolean;
  isEdit: boolean;
  onOpenPreview: () => void;
  previewUrl?: string;
}

export function CmsActionBar({
  pending,
  isEdit,
  onOpenPreview,
  previewUrl,
}: CmsActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-off-white px-4 py-3 lg:px-6">
      <Button
        type="submit"
        name="intent"
        value="draft"
        variant="outline"
        size="sm"
        disabled={pending}
      >
        {pending ? "Salvando…" : "Salvar rascunho"}
      </Button>
      <Button
        type="submit"
        name="intent"
        value="publish"
        variant="primary"
        size="sm"
        disabled={pending}
      >
        {pending ? "Salvando…" : isEdit ? "Publicar alterações" : "Publicar"}
      </Button>
      {isEdit && (
        <Button
          type="submit"
          name="intent"
          value="archive"
          variant="ghost"
          size="sm"
          disabled={pending}
        >
          Arquivar
        </Button>
      )}
      <Button type="button" variant="secondary" size="sm" onClick={onOpenPreview}>
        Preview
      </Button>
      {previewUrl && (
        <Button href={previewUrl} variant="ghost" size="sm" target="_blank">
          Abrir no site
        </Button>
      )}
    </div>
  );
}
