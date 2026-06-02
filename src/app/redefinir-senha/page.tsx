import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redefinir senha",
  description: "Defina uma nova senha para sua conta Saúde & Bem.",
};

export default function RedefinirSenhaPage() {
  return <ResetPasswordForm />;
}
