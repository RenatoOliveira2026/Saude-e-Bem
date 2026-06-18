import type { ContentBlock } from "@/lib/admin/cms/content-blocks";
import Image from "next/image";

function FaqBlock({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <dl className="space-y-5">
      {items.map((item) => (
        <div key={item.question} className="rounded-xl border border-border bg-surface p-5">
          <dt className="font-heading text-base font-semibold text-forest">{item.question}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContentBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-custom space-y-5">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "heading") {
          const Tag = block.level === 1 ? "h1" : block.level === 3 ? "h3" : "h2";
          const size =
            block.level === 1
              ? "text-3xl"
              : block.level === 3
                ? "text-lg"
                : "text-2xl";
          return (
            <Tag
              key={key}
              className={`font-heading font-semibold text-forest text-pretty ${size}`}
            >
              {block.text}
            </Tag>
          );
        }

        if (block.type === "image" && block.url) {
          return (
            <figure key={key} className="overflow-hidden rounded-xl border border-border">
              <div className="relative aspect-video">
                <Image
                  src={block.url}
                  alt={block.alt ?? ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {block.alt && (
                <figcaption className="px-3 py-2 text-xs text-muted">
                  {block.alt}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "list" && block.items.length > 0) {
          const ListTag = block.ordered ? "ol" : "ul";
          const listClass = block.ordered
            ? "list-decimal space-y-2 pl-5 text-graphite"
            : "list-disc space-y-2 pl-5 text-graphite";
          return (
            <ListTag key={key} className={listClass}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "blockquote" && block.text) {
          return (
            <blockquote
              key={key}
              className="border-l-4 border-sage pl-4 text-base italic text-muted"
            >
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "faq" && block.items.length > 0) {
          return <FaqBlock key={key} items={block.items} />;
        }

        if (block.type === "divider") {
          return <hr key={key} className="border-border" />;
        }

        if (block.type === "paragraph") {
          if (block.html?.trim()) {
            return (
              <div
                key={key}
                className="text-base leading-relaxed text-graphite text-pretty [&_a]:text-sage [&_a]:underline [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            );
          }
          if (block.text) {
            return (
              <p key={key} className="text-base leading-relaxed text-graphite text-pretty">
                {block.text}
              </p>
            );
          }
        }

        return null;
      })}
    </div>
  );
}
