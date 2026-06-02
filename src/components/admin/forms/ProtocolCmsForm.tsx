"use client";

import { CmsEditorShell } from "@/components/admin/cms/CmsEditorShell";
import { CmsFeaturedSwitch } from "@/components/admin/cms/CmsFeaturedSwitch";
import { CmsSeoSection } from "@/components/admin/cms/CmsSeoSection";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { RichContentEditor } from "@/components/admin/cms/RichContentEditor";
import { ProtocolPreview } from "@/components/admin/cms/previews/ProtocolPreview";
import { Input, Select } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  createProtocolAction,
  updateProtocolAction,
} from "@/lib/admin/actions/protocols.actions";
import { parseContentBlocks } from "@/lib/admin/cms/content-blocks";
import { arrayToLines, linesToArray, linesToSteps, stepsToLines } from "@/lib/admin/utils";
import type { AdminActionState } from "@/lib/admin/types";
import { protocolCategories } from "@/lib/data/protocols";
import { categoryLabels, type Protocol } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import { useActionState, useMemo, useState } from "react";

const initialState: AdminActionState = {};

interface ProtocolCmsFormProps {
  protocol?: Protocol;
}

export function ProtocolCmsForm({ protocol }: ProtocolCmsFormProps) {
  const action = protocol ? updateProtocolAction : createProtocolAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const initialBlocks = useMemo(
    () =>
      protocol?.contentBlocks ??
      parseContentBlocks(protocol?.longDescription ?? ""),
    [protocol],
  );

  const [title, setTitle] = useState(protocol?.title ?? "");
  const [description, setDescription] = useState(protocol?.description ?? "");
  const [objective, setObjective] = useState(protocol?.objective ?? "");
  const [category, setCategory] = useState<string>(protocol?.category ?? "energia");
  const [duration, setDuration] = useState(protocol?.duration ?? "14 dias");
  const [level, setLevel] = useState<string>(protocol?.level ?? "Iniciante");
  const [benefitsText, setBenefitsText] = useState(
    protocol ? arrayToLines(protocol.benefits) : "",
  );
  const [stepsText, setStepsText] = useState(
    protocol ? stepsToLines(protocol.steps) : "",
  );
  const [coverImageUrl, setCoverImageUrl] = useState(protocol?.coverImageUrl ?? "");

  const categoryOptions = protocolCategories
    .filter((c) => c.id !== "todos")
    .map((c) => ({ value: c.id, label: c.label }));

  const previewUrl =
    protocol?.status === "published" && protocol.slug
      ? routes.protocolo(protocol.slug)
      : undefined;

  const benefits = linesToArray(benefitsText);
  const steps = linesToSteps(stepsText);

  return (
    <CmsEditorShell
      formAction={formAction}
      state={state}
      pending={pending}
      isEdit={Boolean(protocol)}
      previewUrl={previewUrl}
      preview={
        <ProtocolPreview
          title={title}
          description={description}
          objective={objective}
          longDescription={description}
          categoryLabel={categoryLabels[category as keyof typeof categoryLabels] ?? category}
          duration={duration}
          level={level}
          benefits={benefits}
          steps={steps}
          coverImageUrl={coverImageUrl}
        />
      }
    >
      {protocol && <input type="hidden" name="id" value={protocol.id} />}

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Input label="Título" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Slug" name="slug" defaultValue={protocol?.slug} hint="Vazio = automático" />
        </div>

        <Textarea label="Descrição curta" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
        <Input label="Objetivo" name="objective" value={objective} onChange={(e) => setObjective(e.target.value)} required />

        <ImageUploadField
          label="Capa do conteúdo"
          name="cover_image_url"
          folder="protocolos"
          defaultUrl={protocol?.coverImageUrl}
          onUrlChange={setCoverImageUrl}
        />

        <RichContentEditor
          label="Conteúdo do protocolo"
          name="content_blocks"
          initialBlocks={initialBlocks}
          imageFolder="protocolos"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Categoria" name="category" value={category} onChange={(e) => setCategory(e.target.value)} options={categoryOptions} />
          <Input label="Duração" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
          <Select
            label="Nível"
            name="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            options={[
              { value: "Iniciante", label: "Iniciante" },
              { value: "Intermediário", label: "Intermediário" },
              { value: "Avançado", label: "Avançado" },
            ]}
          />
          <Input label="Participantes" name="participants" type="number" min={0} defaultValue={protocol?.participants ?? 0} />
          <Input label="Tag" name="tag" defaultValue={protocol?.tag ?? ""} />
        </div>

        <Textarea label="Benefícios" name="benefits" value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} hint="Um por linha" rows={4} />
        <Textarea label="Passos" name="steps" value={stepsText} onChange={(e) => setStepsText(e.target.value)} hint="Título|Descrição por linha" rows={5} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_premium" defaultChecked={protocol?.isPremium} className="h-4 w-4 rounded" />
          Premium
        </label>

        <CmsFeaturedSwitch defaultChecked={protocol?.featured} />

        <CmsSeoSection
          ogFolder="protocolos"
          values={{
            seoTitle: protocol?.seoTitle,
            seoDescription: protocol?.seoDescription,
            seoKeywords: protocol?.seoKeywords,
            ogImageUrl: protocol?.ogImageUrl,
          }}
        />
      </div>
    </CmsEditorShell>
  );
}
