"use client";

import { Button } from "@/components/ui/Button";

interface InlineFormatToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onLink: () => void;
}

export function InlineFormatToolbar({
  onBold,
  onItalic,
  onLink,
}: InlineFormatToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-off-white p-1">
      <Button type="button" variant="ghost" size="sm" onClick={onBold} className="min-w-9 font-bold">
        B
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onItalic} className="min-w-9 italic">
        I
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onLink} className="min-w-9">
        Link
      </Button>
    </div>
  );
}
