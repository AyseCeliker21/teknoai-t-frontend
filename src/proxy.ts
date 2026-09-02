import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "tekno_at";
const REFRESH_COOKIE = "tekno_rt";
const USER_COOKIE = "tekno_user";
const API_URL = process.env.API_URL ?? "http://localhost:5250";
const isProd = process.env.NODE_ENV === "production";

interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

interface RefreshedAuth {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  user: SessionUser;
}

function parseUserCookie(value: string | undefined): SessionUser | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as SessionUser;
  } catch {
    return null;
  }
}

async function trySilentRefresh(refreshToken: string): Promise<RefreshedAuth | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    return (await res.json()) as RefreshedAuth;
  } catch {
    return null;
  }
}

// Request cookies only carry name/value (no attributes), so the downstream
// Server Component sees the refreshed token for this same request.
function applyRequestCookies(request: NextRequest, auth: RefreshedAuth) {
  request.cookies.set(ACCESS_COOKIE, auth.accessToken);
  request.cookies.set(REFRESH_COOKIE, auth.refreshToken);
  request.cookies.set(USER_COOKIE, JSON.stringify(auth.user));
}

// Response cookies carry full attributes and are what the browser stores
// for future requests — mirrors session.ts's applySession.
function applyResponseCookies(response: NextResponse, auth: RefreshedAuth) {
  response.cookies.set(ACCESS_COOKIE, auth.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: new Date(auth.accessTokenExpiresAtUtc),
  });
  response.cookies.set(REFRESH_COOKIE, auth.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(USER_COOKIE, JSON.stringify(auth.user), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

// Guests (not logged in) may only browse Haberler, Kadromuz, and the home
// page. Everything else requires an account.
const MEMBER_ONLY_PATHS = ["/panel", "/projeler", "/hibeler", "/ilanlar", "/iletisim", "/uyeler", "/uye"];

// Within /yonetim, only these paths are open to İçerik Üretici (in addition
// to Sistem Yöneticisi, who can reach everything under /yonetim).
const CONTENT_PRIVILEGED_PATHS = ["/yonetim/haberler", "/yonetim/projeler"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let user = parseUserCookie(request.cookies.get(USER_COOKIE)?.value);
  let hasSession = request.cookies.has(ACCESS_COOKIE);
  let refreshedAuth: RefreshedAuth | null = null;
  let refreshFailed = false;

  // The access-token cookie is short-lived (matches the JWT's own expiry) and
  // routinely disappears mid-session while the 30-day refresh-token cookie is
  // still good. Previously that alone triggered a redirect to /giris, even
  // though the session could have been silently renewed — the navbar kept
  // showing the user as logged in (it reads the long-lived tekno_user cookie)
  // while every gated page bounced them to a forced re-login. Refresh here
  // first, on every request, so both the navbar and route access stay in
  // sync with the real session state.
  if (!hasSession) {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      refreshedAuth = await trySilentRefresh(refreshToken);
      if (refreshedAuth) {
        hasSession = true;
        user = refreshedAuth.user;
        applyRequestCookies(request, refreshedAuth);
      } else {
        // The refresh token itself is dead (expired/revoked) even though the
        // long-lived tekno_user cookie is still sitting there — without this,
        // the navbar would keep claiming the user is logged in on pages that
        // aren't gated (home, kadromuz, haberler).
        refreshFailed = true;
        user = null;
        request.cookies.delete(ACCESS_COOKIE);
        request.cookies.delete(REFRESH_COOKIE);
        request.cookies.delete(USER_COOKIE);
      }
    }
  }

  const isMemberOnly = MEMBER_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAdminArea = pathname === "/yonetim" || pathname.startsWith("/yonetim/");

  if ((isMemberOnly || isAdminArea) && !hasSession) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminArea) {
    const roles = user?.roles ?? [];
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

  const response = NextResponse.next({ request });
  if (refreshedAuth) {
    applyResponseCookies(response, refreshedAuth);
  } else if (refreshFailed) {
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    response.cookies.delete(USER_COOKIE);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/proxy).*)"],
};
