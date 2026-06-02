import { DevLoginForm } from "@/components/auth/DevLoginForm";
import { isDevLoginAllowed } from "@/lib/auth/dev-login";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dev login",
  robots: { index: false, follow: false },
};

export default function DevLoginPage() {
  if (!isDevLoginAllowed()) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <DevLoginForm />
    </Suspense>
  );
}
