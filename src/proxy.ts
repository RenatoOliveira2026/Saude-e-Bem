import { authRoutes, adminProtectedRoutes, privateRoutes, clubPublicRoutes } from "@/lib/auth/routes";
import { routes } from "@/lib/routes";
import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

function isClubMemberRoute(pathname: string): boolean {
  if (!pathname.startsWith("/clube/")) return false;
  return !clubPublicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  function withSessionCookies(
    response: NextResponse,
    sessionResponse = supabaseResponse,
  ) {
    sessionResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });
    return response;
  }

  if (
    pathname.startsWith("/dev-login") &&
    process.env.NODE_ENV === "production"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = routes.home;
    return withSessionCookies(NextResponse.redirect(url), supabaseResponse);
  }

  if (pathname.startsWith("/admin/setup")) {
    const url = request.nextUrl.clone();
    url.pathname = routes.admin;
    url.search = "";
    return withSessionCookies(
      NextResponse.redirect(url),
      supabaseResponse,
    );
  }

  const isAdminPanel = adminProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivate =
    privateRoutes.some((route) => pathname.startsWith(route)) ||
    isClubMemberRoute(pathname) ||
    isAdminPanel;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !user) {
    const url = request.nextUrl.clone();
    url.pathname = routes.entrar;
    url.searchParams.set("redirect", pathname);
    return withSessionCookies(NextResponse.redirect(url));
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = routes.minhaJornada;
    return withSessionCookies(NextResponse.redirect(url));
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  return withSessionCookies(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|offline.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
