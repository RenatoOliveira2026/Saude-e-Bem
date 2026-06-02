"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface AdminDeleteButtonProps {
  label?: string;
  onDelete: () => Promise<{ error?: string; success?: string }>;
}

export function AdminDeleteButton({
  label = "Excluir",
  onDelete,
}: AdminDeleteButtonProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Confirmar exclusão? Esta ação não pode ser desfeita.")) {
          return;
        }
        startTransition(async () => {
          const result = await onDelete();
          if (!result.error) router.refresh();
        });
      }}
    >
      {pending ? "Excluindo…" : label}
    </Button>
  );
}
