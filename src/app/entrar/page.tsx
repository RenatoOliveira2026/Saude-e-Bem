import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta Saúde & Bem.",
};

export default function EntrarPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
