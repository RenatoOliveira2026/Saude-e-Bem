"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import { sendGa4ContentShared } from "@/lib/analytics/growth-events";
import {
  buildWhatsAppShareUrl,
  buildTwitterShareUrl,
} from "@/lib/seo/share-metadata";
import { absoluteUrl } from "@/lib/seo/site-url";
import { useState } from "react";

export interface ShareButtonProps {
  title: string;
  description?: string;
  path: string;
  contentType: "article" | "protocol" | "library" | "trail";
  slug?: string;
  className?: string;
}

export function ShareButton({
  title,
  description,
  path,
  contentType,
  slug,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(path);
  const shareText = description ? `${title} — ${description}` : title;

  async function handleNativeShare() {
    sendGa4ContentShared({
      contentType,
      contentSlug: slug,
      contentTitle: title,
      source: "native",
    });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        return;
      } catch {
        /* usuário cancelou */
      }
    }
    await copyLink();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      sendGa4ContentShared({
        contentType,
        contentSlug: slug,
        contentTitle: title,
        source: "copy",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      <Button type="button" variant="outline" size="sm" onClick={handleNativeShare}>
        <Icon name="community" size={14} className="mr-1.5" />
        Compartilhar
      </Button>
      <a
        href={buildWhatsAppShareUrl(shareText, url)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:bg-surface-muted"
        onClick={() =>
          sendGa4ContentShared({
            contentType,
            contentSlug: slug,
            contentTitle: title,
            source: "whatsapp",
          })
        }
      >
        WhatsApp
      </a>
      <a
        href={buildTwitterShareUrl(shareText, url)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:bg-surface-muted"
        onClick={() =>
          sendGa4ContentShared({
            contentType,
            contentSlug: slug,
            contentTitle: title,
            source: "twitter",
          })
        }
      >
        X
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:bg-surface-muted"
      >
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
