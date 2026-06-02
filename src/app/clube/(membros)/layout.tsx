import { ClubShell } from "@/components/club";
import { getClubMembership } from "@/lib/club/access";
import { requireUser } from "@/lib/auth/session";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clube — Área de membros",
  robots: { index: false, follow: false },
};

export default async function ClubMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const membership = await getClubMembership(user.id);
  const pathname = (await headers()).get("x-pathname") ?? "";

  return (
    <ClubShell activePath={pathname} isPremium={membership.isPremium}>
      {children}
    </ClubShell>
  );
}
