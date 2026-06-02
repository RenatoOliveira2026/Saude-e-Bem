"use client";

import Image from "next/image";

interface EbookPreviewProps {
  title: string;
  description: string;
  longDescription: string;
  categoryLabel: string;
  format: string;
  pages: number;
  highlights: string[];
  coverImageUrl?: string;
  pdfUrl?: string;
}

export function EbookPreview(props: EbookPreviewProps) {
  return (
    <article>
      <span className="inline-block rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-forest">
        {props.categoryLabel || "Biblioteca"}
      </span>
      {props.coverImageUrl && (
        <div className="relative mt-4 aspect-[3/4] max-h-64 overflow-hidden rounded-xl">
          <Image src={props.coverImageUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
      <h1 className="mt-4 font-heading text-2xl font-semibold text-forest">
        {props.title || "Título do material"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {props.format} · {props.pages} páginas
      </p>
      <p className="mt-4 text-graphite">{props.description}</p>
      {props.longDescription && (
        <p className="mt-4 whitespace-pre-wrap text-graphite">{props.longDescription}</p>
      )}
      {props.highlights.length > 0 && (
        <ul className="mt-6 list-disc space-y-1 pl-5 text-graphite">
          {props.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      {props.pdfUrl && (
        <p className="mt-6 text-sm font-medium text-sage">PDF anexado ✓</p>
      )}
    </article>
  );
}
