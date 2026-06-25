"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { Icon, IconBox } from "@/components/icons";
import { updateProfile, type AuthActionState } from "@/lib/auth/actions";
import { sendGa4OnboardingComplete } from "@/lib/analytics/growth-events";
import { goalSelectOptions } from "@/lib/journey/constants";
import type { OnboardingData } from "@/lib/onboarding/types";
import { ONBOARDING_STORAGE_KEY } from "@/lib/onboarding/types";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

interface OnboardingWizardProps {
  data: OnboardingData;
}

export function OnboardingWizard({ data }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(data.plan.goalKey ?? "");
  const [state, formAction, pending] = useActionState(updateProfile, {} as AuthActionState);

  const firstName = data.displayName.split(" ")[0];
  const steps = data.hasGoal
    ? ["Boas-vindas", "Seu plano", "Começar"]
    : ["Boas-vindas", "Objetivo", "Seu plano", "Começar"];

  function finishOnboarding() {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, new Date().toISOString());
    }
    sendGa4OnboardingComplete({ source: "wizard" });
    router.push(routes.minhaJornada);
  }

  const planItems = [data.plan.trail, data.plan.protocol, data.plan.article].filter(
    Boolean,
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-forest" : "bg-sage-muted"}`}
            aria-hidden
          />
        ))}
      </div>

      {step === 0 && (
        <Card className="p-8 text-center">
          <Badge variant="gold" className="mb-4">
            Bem-vindo
          </Badge>
          <h1 className="font-heading text-3xl text-forest">
            Olá, {firstName}! 👋
          </h1>
          <p className="mt-4 text-muted leading-relaxed">
            Vamos personalizar sua jornada com trilhas, protocolos e artigos
            alinhados ao seu objetivo de saúde.
          </p>
          <Button className="mt-8" variant="primary" onClick={() => setStep(1)}>
            Começar
          </Button>
        </Card>
      )}

      {!data.hasGoal && step === 1 && (
        <Card className="p-8">
          <h2 className="font-heading text-2xl text-forest">Qual seu principal objetivo?</h2>
          <p className="mt-2 text-sm text-muted">
            Usamos isso para sugerir trilhas e conteúdos relevantes.
          </p>
          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="name" value={data.displayName} />
            <Select
              name="goal"
              label="Objetivo principal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              options={goalSelectOptions}
              required
            />
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            <Button type="submit" variant="primary" disabled={pending || !goal}>
              {pending ? "Salvando…" : "Continuar"}
            </Button>
          </form>
          {state.success && (
            <Button className="mt-4" variant="outline" onClick={() => setStep(2)}>
              Avançar
            </Button>
          )}
        </Card>
      )}

      {step === (data.hasGoal ? 1 : 2) && (
        <Card className="p-8">
          <h2 className="font-heading text-2xl text-forest">Seu plano inicial</h2>
          <p className="mt-2 text-sm text-muted">
            {data.plan.goalLabel
              ? `Curadoria para: ${data.plan.goalLabel}`
              : "Recomendações para começar com o pé direito."}
          </p>
          <ul className="mt-6 space-y-4">
            {planItems.map((item) =>
              item ? (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="flex items-start gap-4 rounded-xl border border-border p-4 transition hover:border-forest/30"
                  >
                    <IconBox name={item.icon} />
                    <div>
                      <p className="font-medium text-forest">{item.title}</p>
                      <p className="text-sm text-muted">{item.description}</p>
                      {item.badge && (
                        <Badge variant="outline" className="mt-2">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </a>
                </li>
              ) : null,
            )}
          </ul>
          <Button className="mt-8" variant="primary" onClick={() => setStep(data.hasGoal ? 2 : 3)}>
            Continuar
          </Button>
        </Card>
      )}

      {step === steps.length - 1 && (
        <Card className="p-8 text-center">
          <Icon name="checklist" size={32} className="mx-auto text-forest" />
          <h2 className="mt-4 font-heading text-2xl text-forest">Tudo pronto!</h2>
          <p className="mt-3 text-muted">
            Conclua os passos da sua jornada para desbloquear medalhas e avançar nas
            trilhas premium.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="gold" onClick={finishOnboarding}>
              Ir para Minha Jornada
            </Button>
            <Button href={routes.clubeTrilhas} variant="outline">
              Ver trilhas
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
