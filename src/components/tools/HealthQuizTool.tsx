"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";
import {
  evaluateHealthQuiz,
  parseHealthQuizForm,
  quizQuestions,
  type HealthQuizResult,
} from "@/lib/tools/health-quiz";
import { usePersistToolResult } from "@/lib/health-profile/use-persist-tool-result";
import Link from "next/link";
import { useState } from "react";
import { ToolDisclaimer, ToolFieldset, ToolResultPanel, scrollToResult } from "./tool-ui";

export function HealthQuizTool() {
  const [result, setResult] = useState<HealthQuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { persist, saved, status, message } = usePersistToolResult("quiz-saude-bem");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const answers = parseHealthQuizForm(new FormData(e.currentTarget));
    if ("error" in answers) {
      setError(answers.error);
      setResult(null);
      return;
    }
    const evaluated = evaluateHealthQuiz(answers);
    if ("error" in evaluated) {
      setError(evaluated.error);
      setResult(null);
      return;
    }
    setResult(evaluated);
    void persist(evaluated as unknown as Record<string, unknown>);
    scrollToResult();
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <ToolFieldset title="Questionário rápido">
          <div className="space-y-8">
            {quizQuestions.map((q) => (
              <QuizQuestionField key={q.id} question={q} />
            ))}
          </div>
        </ToolFieldset>
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="primary" size="lg">
            Ver meu perfil
          </Button>
          <ToolDisclaimer>
            Quiz educativo com base em hábitos relatados. Resultado orientativo, não
            diagnóstico clínico.
          </ToolDisclaimer>
        </div>
      </form>
      {result && (
        <ToolResultPanel
          badge={result.profileTitle}
          subtitle={`${result.profileIcon} Perfil dominante`}
          recommendations={result.recommendations}
          saved={saved}
          saveStatus={status}
          saveMessage={message}
        >
          <p className="text-muted text-pretty">{result.profileDescription}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.traits.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="font-heading text-sm font-semibold text-forest">
              Categorias de protocolos recomendadas
            </h3>
            <ul className="mt-4 space-y-3">
              {result.protocolCategories.map((cat) => (
                <li
                  key={cat.categorySlug}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-sage-muted/30 px-4 py-3"
                >
                  <span className="font-heading text-sm text-forest">
                    {cat.categoryLabel}
                  </span>
                  <Link
                    href={routes.protocolos}
                    className="text-sm font-medium text-forest underline-offset-2 hover:underline"
                  >
                    Explorar protocolos →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </ToolResultPanel>
      )}
    </div>
  );
}

function QuizQuestionField({
  question,
}: {
  question: (typeof quizQuestions)[number];
}) {
  return (
    <fieldset>
      <legend className="mb-1 block font-heading text-sm font-medium text-forest">
        {question.label}
      </legend>
      {question.hint && (
        <p className="mb-3 text-xs text-muted-light">{question.hint}</p>
      )}
      <div className="space-y-2">
        {question.options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm has-[:checked]:border-sage has-[:checked]:bg-sage-muted"
          >
            <input
              type="radio"
              name={question.id}
              value={opt.value}
              required
              className="mt-0.5 accent-forest"
            />
            <span className="text-graphite">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
