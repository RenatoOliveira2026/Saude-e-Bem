import { getCurrentUser, getUserProfile } from "@/lib/auth/session";
import { billingProfileRedirectUrl, resolveBillingReturnPath } from "@/lib/billing/guards";
import { isBillingProfileComplete } from "@/lib/billing/profile";
import { routes } from "@/lib/routes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ complete: false, loggedIn: false });
  }

  const { profile } = await getUserProfile(user.id);
  const complete = isBillingProfileComplete(profile);
  const url = new URL(request.url);
  const next = resolveBillingReturnPath(
    url.searchParams.get("next"),
    url.searchParams.get("redirect"),
    routes.assinar,
  );

  return NextResponse.json({
    complete,
    loggedIn: true,
    redirectUrl: billingProfileRedirectUrl(next),
  });
}
