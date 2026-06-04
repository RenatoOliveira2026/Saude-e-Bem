"use client";

import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  evaluateWaterIntake,
  parseWaterIntakeForm,
  type WaterIntakeResult,
} from "@/lib/tools/water-intake";
import { usePersistToolResult } from "@/lib/health-profile/use-persist-tool-result";
import { useState } from "react";
import { ToolDisclaimer, ToolFieldset, ToolResultPanel, scrollToResult } from "./tool-ui";

export function WaterIntakeTool() {
  const [result, setResult] = useState<WaterIntakeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { persist, saved, status, message } = usePersistToolResult("consumo-agua");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = parseWaterIntakeForm(new FormData(e.currentTarget));
    if ("error" in parsed) {
      setError(parsed.error);
      setResult(null);
      return;
    }
    const evaluated = evaluateWaterIntake(
      parsed.weightKg,
      parsed.activity,
      parsed.climate,
    );
    setResult(evaluated);
    void persist(evaluated as unknown as Record<string, unknown>);
    scrollToResult();
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <ToolFieldset title="Seu perfil">
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
          <Select
            name="activity"
            label="Nível de atividade física"
            options={[
              { value: "sedentary", label: "Sedentário" },
              { value: "moderate", label: "Moderado (1–3x/semana)" },
              { value: "active", label: "Ativo (4+ vezes/semana)" },
            ]}
            defaultValue="moderate"
          />
          <Select
            name="climate"
            label="Clima habitual"
            options={[
              { value: "mild", label: "Ameno / temperado" },
              { value: "warm", label: "Quente na maior parte do ano" },
              { value: "hot", label: "Muito quente ou alta umidade" },
            ]}
            defaultValue="mild"
          />
        </ToolFieldset>
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="primary" size="lg">
            Calcular hidratação
          </Button>
          <ToolDisclaimer />
        </div>
      </form>
      {result && (
        <ToolResultPanel
          badge={`${result.litersPerDay} L / dia`}
          subtitle={`~${result.glasses250ml} copos de 250 ml`}
          recommendations={result.recommendations}
          saved={saved}
          saveStatus={status}
          saveMessage={message}
        >
          <p className="text-muted text-pretty">{result.guidance}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Volume
              </dt>
              <dd className="mt-1 font-heading text-xl text-forest">
                {result.millilitersPerDay} ml
              </dd>
            </div>
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Litros
              </dt>
              <dd className="mt-1 font-heading text-xl text-forest">
                {result.litersPerDay} L
              </dd>
            </div>
          </dl>
        </ToolResultPanel>
      )}
    </div>
  );
}
