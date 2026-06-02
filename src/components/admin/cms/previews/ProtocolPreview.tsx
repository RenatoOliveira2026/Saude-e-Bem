"use client";

import type { ProtocolStep } from "@/lib/data/types";
import Image from "next/image";

interface ProtocolPreviewProps {
  title: string;
  description: string;
  objective: string;
  longDescription: string;
  categoryLabel: string;
  duration: string;
  level: string;
  benefits: string[];
  steps: ProtocolStep[];
  coverImageUrl?: string;
}

export function ProtocolPreview(props: ProtocolPreviewProps) {
  return (
    <article>
      <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-forest">
        {props.categoryLabel || "Protocolo"}
      </span>
      {props.coverImageUrl && (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-xl">
          <Image src={props.coverImageUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
      <h1 className="mt-4 font-heading text-2xl font-semibold text-forest">
        {props.title || "Título do protocolo"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {props.duration} · {props.level}
      </p>
      <p className="mt-4 text-graphite">{props.description}</p>
      <p className="mt-4 font-medium text-forest">Objetivo: {props.objective}</p>
      {props.longDescription && (
        <p className="mt-4 whitespace-pre-wrap text-graphite">{props.longDescription}</p>
      )}
      {props.benefits.length > 0 && (
        <ul className="mt-6 list-disc space-y-1 pl-5 text-graphite">
          {props.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {props.steps.length > 0 && (
        <ol className="mt-6 space-y-4">
          {props.steps.map((step, i) => (
            <li key={`${step.title}-${i}`}>
              <p className="font-medium text-forest">
                {i + 1}. {step.title}
              </p>
              <p className="text-sm text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
