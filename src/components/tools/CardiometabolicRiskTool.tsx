"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { routes } from "@/lib/routes";
import {
  evaluateCardiometabolicRisk,
  parseCardiometabolicForm,
  riskLevelDescriptions,
  riskLevelLabels,
  type CardiometabolicResult,
  type RiskLevel,
} from "@/lib/tools/cardiometabolic-risk";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useState } from "react";

const levelBadgeVariant: Record<
  RiskLevel,
  "sage" | "gold" | "outline" | "forest"
> = {
  low: "sage",
  moderate: "gold",
  elevated: "outline",
  high: "forest",
};

const levelBarColor: Record<RiskLevel, string> = {
  low: "bg-sage",
  moderate: "bg-gold",
  elevated: "bg-gold-light",
  high: "bg-forest",
};

function ResultPanel({ result }: { result: CardiometabolicResult }) {
  const pct = Math.min(100, Math.round((result.score / result.maxScore) * 100));

  return (
    <div
      className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8"
      role="status"
      aria-live="polite"
    >
      <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted">
        Seu resultado
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant={levelBadgeVariant[result.level]} className="text-sm">
          Risco {riskLevelLabels[result.level].toLowerCase()}
        </Badge>
        <span className="text-sm text-muted">
          Pontuação {result.score} / {result.maxScore}
        </span>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-sage-muted">
        <div
          className={cn("h-full rounded-full transition-all", levelBarColor[result.level])}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-6 text-muted text-pretty">
        {riskLevelDescriptions[result.level]}
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            IMC estimado
          </dt>
          <dd className="mt-1 font-heading text-xl text-forest">{result.bmi}</dd>
        </div>
        <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Cintura
          </dt>
          <dd className="mt-1 font-heading text-sm text-forest">
            {result.waistRisk === "normal" && "Dentro da referência"}
            {result.waistRisk === "elevated" && "Acima do limite de atenção"}
            {result.waistRisk === "high" && "Acima do limite alto"}
          </dd>
        </div>
      </dl>

      {result.factors.length > 0 && (
        <div className="mt-6">
          <h3 className="font-heading text-sm font-semibold text-forest">
            Fatores identificados
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {result.factors.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-gold" aria-hidden>
                  •
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-heading text-sm font-semibold text-forest">
          Próximos passos
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {result.recommendations.map((r) => (
            <li key={r} className="text-pretty">
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={routes.protocolos} variant="primary" size="md">
          Ver protocolos
        </Button>
        <Button href={routes.ferramentas} variant="outline" size="md">
          Outras ferramentas
        </Button>
      </div>
    </div>
  );
}

export function CardiometabolicRiskTool() {
  const [result, setResult] = useState<CardiometabolicResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = parseCardiometabolicForm(new FormData(e.currentTarget));
    if ("error" in parsed) {
      setError(parsed.error);
      setResult(null);
      return;
    }
    setResult(evaluateCardiometabolicRisk(parsed));
    document.getElementById("resultado-risco")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <fieldset className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <legend className="font-heading text-lg font-semibold text-forest px-1">
            Medidas e perfil
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              name="age"
              type="number"
              label="Idade (anos)"
              min={18}
              max={100}
              required
              defaultValue={35}
            />
            <Select
              name="sex"
              label="Sexo biológico (referência de cintura)"
              options={[
                { value: "female", label: "Feminino" },
                { value: "male", label: "Masculino" },
              ]}
              defaultValue="female"
            />
            <Input
              name="heightCm"
              type="number"
              label="Altura (cm)"
              min={120}
              max={230}
              required
              defaultValue={165}
            />
            <Input
              name="weightKg"
              type="number"
              label="Peso (kg)"
              min={35}
              max={250}
              step="0.1"
              required
              defaultValue={70}
            />
            <div className="sm:col-span-2">
              <Input
                name="waistCm"
                type="number"
                label="Circunferência abdominal (cm)"
                hint="Meça na altura do umbigo, em pé, após expirar normalmente."
                min={50}
                max={200}
                required
                defaultValue={80}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <legend className="font-heading text-lg font-semibold text-forest px-1">
            Hábitos
          </legend>
          <Select
            name="activity"
            label="Atividade física habitual"
            options={[
              { value: "sedentary", label: "Sedentário (quase nenhuma)" },
              { value: "moderate", label: "Moderado (1–2x por semana)" },
              { value: "active", label: "Ativo (3+ vezes por semana)" },
            ]}
            defaultValue="moderate"
          />
          <YesNoField name="smokes" label="Você fuma atualmente?" />
        </fieldset>

        <fieldset className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <legend className="font-heading text-lg font-semibold text-forest px-1">
            Histórico de saúde
          </legend>
          <YesNoField
            name="familyHistory"
            label="Histórico familiar de diabetes ou doença cardiovascular?"
          />
          <YesNoField
            name="hypertension"
            label="Pressão arterial elevada ou diagnóstico de hipertensão?"
          />
          <YesNoField
            name="diabetes"
            label="Diabetes, pré-diabetes ou glicemia alterada?"
          />
        </fieldset>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="primary" size="lg">
            Calcular risco
          </Button>
          <p className="text-xs text-muted max-w-md">
            Triagem educativa com base em idade, IMC, cintura e fatores de estilo de vida.
            Não é diagnóstico médico.{" "}
            <Link href={routes.protocolos} className="text-forest underline-offset-2 hover:underline">
              Protocolos
            </Link>{" "}
            podem complementar seu plano preventivo.
          </p>
        </div>
      </form>

      {result && (
        <div id="resultado-risco">
          <ResultPanel result={result} />
        </div>
      )}
    </div>
  );
}

function YesNoField({ name, label }: { name: string; label: string }) {
  return (
    <fieldset>
      <legend className="mb-3 block font-heading text-sm font-medium text-forest">
        {label}
      </legend>
      <div className="flex flex-wrap gap-3">
        {[
          { value: "no", text: "Não" },
          { value: "yes", text: "Sim" },
        ].map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm has-[:checked]:border-sage has-[:checked]:bg-sage-muted"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={opt.value === "no"}
              className="accent-forest"
            />
            {opt.text}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
