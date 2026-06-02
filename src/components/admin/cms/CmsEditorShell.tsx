"use client";

import { AdminMessage } from "@/components/admin/AdminMessage";
import { CmsActionBar } from "@/components/admin/cms/CmsActionBar";
import { CmsPreviewModal } from "@/components/admin/cms/CmsPreviewModal";
import type { AdminActionState } from "@/lib/admin/types";
import { useState, type ReactNode } from "react";

interface CmsEditorShellProps {
  children: ReactNode;
  preview: ReactNode;
  state: AdminActionState;
  pending: boolean;
  isEdit: boolean;
  previewUrl?: string;
  formAction: (payload: FormData) => void;
}

export function CmsEditorShell({
  children,
  preview,
  state,
  pending,
  isEdit,
  previewUrl,
  formAction,
}: CmsEditorShellProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <form action={formAction} className="flex min-h-[calc(100vh-4rem)] flex-col">
      <CmsActionBar
        pending={pending}
        isEdit={isEdit}
        onOpenPreview={() => setPreviewOpen(true)}
        previewUrl={previewUrl}
      />

      <div className="border-b border-border px-4 py-3 lg:px-6">
        <AdminMessage error={state.error} success={state.success} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>

      <CmsPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        {preview}
      </CmsPreviewModal>
    </form>
  );
}
