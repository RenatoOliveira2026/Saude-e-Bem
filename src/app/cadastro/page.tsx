import { SignUpForm } from "@/components/auth/SignUpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastrar",
  description: "Crie sua conta Saúde & Bem e comece sua jornada de saúde.",
};

export default function CadastroPage() {
  return <SignUpForm />;
}
