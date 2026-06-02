import { RecoverPasswordForm } from "@/components/auth/RecoverPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description: "Recupere o acesso à sua conta Saúde & Bem.",
};

export default function RecuperarSenhaPage() {
  return <RecoverPasswordForm />;
}
