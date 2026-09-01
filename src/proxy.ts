import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "tekno_at";
const USER_COOKIE = "tekno_user";

function getRoles(request: NextRequest): string[] {
  const userCookie = request.cookies.get(USER_COOKIE)?.value;
  if (!userCookie) return [];
  try {
    const user = JSON.parse(userCookie) as { roles?: string[] };
    return user.roles ?? [];
  } catch {
    return [];
  }
}

// Guests (not logged in) may only browse Haberler, Kadromuz, the home page,
// auth pages, and get a limited AI assistant trial. Everything else requires
// an account.
const MEMBER_ONLY_PATHS = ["/panel", "/projeler", "/makaleler", "/ilanlar", "/iletisim"];

// Within /yonetim, only these paths are open to İçerik Üretici (in addition
// to Sistem Yöneticisi, who can reach everything under /yonetim).
const CONTENT_PRIVILEGED_PATHS = ["/yonetim/haberler", "/yonetim/projeler"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(ACCESS_COOKIE);

  const isMemberOnly = MEMBER_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAdminArea = pathname === "/yonetim" || pathname.startsWith("/yonetim/");

  if ((isMemberOnly || isAdminArea) && !hasSession) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminArea) {
    const roles = getRoles(request);
    const isYonetici = roles.includes("Yonetici");
    const isIcerikUretici = roles.includes("IcerikUretici");

    if (!isYonetici && !isIcerikUretici) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }

    const isContentPath = CONTENT_PRIVILEGED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (isIcerikUretici && !isYonetici && !isContentPath) {
      return NextResponse.redirect(new URL("/yonetim/haberler", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel",
    "/panel/:path*",
    "/yonetim",
    "/yonetim/:path*",
    "/projeler",
    "/projeler/:path*",
    "/makaleler",
    "/makaleler/:path*",
    "/ilanlar",
    "/ilanlar/:path*",
    "/iletisim",
  ],
};
