"use client";

import { InlineFormatToolbar } from "@/components/admin/cms/InlineFormatToolbar";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { uploadCmsImageAction } from "@/lib/admin/actions/upload.actions";
import { validateImageFileSize } from "@/lib/admin/cms/upload-limits";
import type { ContentBlock } from "@/lib/admin/cms/content-blocks";
import { blocksToStorage } from "@/lib/admin/cms/content-blocks";
import { useEffect, useRef, useState } from "react";

interface RichContentEditorProps {
  label: string;
  name: string;
  initialBlocks: ContentBlock[];
  imageFolder?: string;
}

type ParagraphBlock = Extract<ContentBlock, { type: "paragraph" }>;

const ltrFieldStyle = { direction: "ltr", textAlign: "left" } as const;

function createBlock(type: ContentBlock["type"]): ContentBlock {
  if (type === "heading") return { type: "heading", text: "", level: 2 };
  if (type === "image") return { type: "image", url: "", alt: "" };
  if (type === "list") return { type: "list", items: [""], ordered: false };
  if (type === "blockquote") return { type: "blockquote", text: "" };
  if (type === "faq") return { type: "faq", items: [{ question: "", answer: "" }] };
  if (type === "divider") return { type: "divider" };
  return { type: "paragraph", text: "", html: "" };
}

const blockLabels: Record<ContentBlock["type"], string> = {
  paragraph: "Parágrafo",
  heading: "Título",
  image: "Imagem",
  list: "Lista",
  blockquote: "Citação",
  faq: "FAQ",
  divider: "Separador",
};

interface ParagraphBlockEditorProps {
  block: ParagraphBlock;
  editorRef: (el: HTMLDivElement | null) => void;
  onChange: (next: ParagraphBlock) => void;
}

/** Evita reset do DOM a cada keystroke (causa digitação invertida / cursor no início). */
function ParagraphBlockEditor({ block, editorRef, onChange }: ParagraphBlockEditorProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || document.activeElement === el) return;

    const html = block.html || block.text || "";
    if (el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }, [block.html, block.text]);

  return (
    <div
      ref={(el) => {
        innerRef.current = el;
        editorRef(el);
        if (el && !initializedRef.current) {
          el.innerHTML = block.html || block.text || "";
          initializedRef.current = true;
        }
      }}
      contentEditable
      suppressContentEditableWarning
      dir="ltr"
      style={ltrFieldStyle}
      className="min-h-[120px] rounded-lg border border-border bg-off-white px-3 py-2 text-sm leading-relaxed text-graphite outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
      onInput={(e) =>
        onChange({
          type: "paragraph",
          text: e.currentTarget.innerText,
          html: e.currentTarget.innerHTML,
        })
      }
    />
  );
}

export function RichContentEditor({
  label,
  name,
  initialBlocks,
  imageFolder = "conteudo",
}: RichContentEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialBlocks.length ? initialBlocks : [{ type: "paragraph", text: "", html: "" }],
  );
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const editableRefs = useRef<Record<number, HTMLDivElement | null>>({});

  function updateBlock(index: number, next: ContentBlock) {
    setBlocks((prev) => prev.map((b, i) => (i === index ? next : b)));
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function applyFormat(index: number, command: "bold" | "italic" | "link") {
    const el = editableRefs.current[index];
    if (!el) return;
    el.focus();
    if (command === "link") {
      const url = window.prompt("URL do link:");
      if (url) document.execCommand("createLink", false, url);
    } else if (command === "bold") {
      document.execCommand("bold");
    } else {
      document.execCommand("italic");
    }
    updateBlock(index, {
      type: "paragraph",
      text: el.innerText,
      html: el.innerHTML,
    });
  }

  async function uploadImageForBlock(index: number, file: File) {
    const sizeError = validateImageFileSize(file.size);
    if (sizeError) {
      window.alert(sizeError);
      return;
    }
    setUploadingIndex(index);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", imageFolder);
    const result = await uploadCmsImageAction({}, fd);
    setUploadingIndex(null);
    if (result.url) {
      const block = blocks[index];
      if (block?.type === "image") {
        updateBlock(index, { ...block, url: result.url });
      }
    }
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(blocksToStorage(blocks))} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-heading text-sm font-medium text-forest">{label}</p>
        <div className="flex flex-wrap gap-1">
          {(
            [
              ["paragraph", "Parágrafo"],
              ["heading", "Título"],
              ["list", "Lista"],
              ["blockquote", "Citação"],
              ["image", "Imagem"],
              ["divider", "Linha"],
            ] as const
          ).map(([type, btnLabel]) => (
            <Button
              key={type}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setBlocks((p) => [...p, createBlock(type)])}
            >
              + {btnLabel}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={`block-${index}`}
            className="rounded-xl border border-border bg-surface p-4 shadow-soft"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {blockLabels[block.type]}
              </span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => moveBlock(index, -1)}>
                  ↑
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => moveBlock(index, 1)}>
                  ↓
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeBlock(index)}>
                  Remover
                </Button>
              </div>
            </div>

            {block.type === "paragraph" && (
              <div className="space-y-2">
                <InlineFormatToolbar
                  onBold={() => applyFormat(index, "bold")}
                  onItalic={() => applyFormat(index, "italic")}
                  onLink={() => applyFormat(index, "link")}
                />
                <ParagraphBlockEditor
                  block={block}
                  editorRef={(el) => {
                    editableRefs.current[index] = el;
                  }}
                  onChange={(next) => updateBlock(index, next)}
                />
              </div>
            )}

            {block.type === "heading" && (
              <>
                <Textarea
                  label="Texto do título"
                  name={`block-${index}-h`}
                  value={block.text}
                  onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                  rows={2}
                />
                <select
                  className="mt-2 h-10 rounded-lg border border-border px-3 text-sm"
                  dir="ltr"
                  style={ltrFieldStyle}
                  value={block.level}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      level: Number(e.target.value) as 1 | 2 | 3,
                    })
                  }
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
              </>
            )}

            {block.type === "image" && (
              <>
                <Textarea
                  label="URL da imagem"
                  name={`block-${index}-img`}
                  value={block.url}
                  onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                  rows={2}
                />
                <Textarea
                  label="Texto alternativo"
                  name={`block-${index}-alt`}
                  value={block.alt ?? ""}
                  onChange={(e) => updateBlock(index, { ...block, alt: e.target.value })}
                  rows={1}
                />
                <input
                  ref={(el) => {
                    fileRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadImageForBlock(index, file);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingIndex === index}
                  onClick={() => fileRefs.current[index]?.click()}
                >
                  {uploadingIndex === index ? "Enviando…" : "Upload para cms-images"}
                </Button>
              </>
            )}

            {block.type === "list" && (
              <>
                <label className="mb-2 flex items-center gap-2 text-sm text-graphite">
                  <input
                    type="checkbox"
                    checked={Boolean(block.ordered)}
                    onChange={(e) =>
                      updateBlock(index, { ...block, ordered: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border"
                  />
                  Lista numerada
                </label>
                <Textarea
                  label="Itens (um por linha)"
                  name={`block-${index}-list`}
                  value={block.items.join("\n")}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      items: e.target.value.split("\n"),
                    })
                  }
                  rows={4}
                />
              </>
            )}

            {block.type === "blockquote" && (
              <Textarea
                label="Citação"
                name={`block-${index}-quote`}
                value={block.text}
                onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                rows={3}
              />
            )}

            {block.type === "divider" && (
              <hr className="border-t border-border" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
