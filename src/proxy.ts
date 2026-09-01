import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "tekno_at";
const USER_COOKIE = "tekno_user";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.has(ACCESS_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/yonetim")) {
    const userCookie = request.cookies.get(USER_COOKIE)?.value;
    let isAdmin = false;
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie) as { roles?: string[] };
        isAdmin = !!user.roles?.includes("Yonetici");
      } catch {
        isAdmin = false;
      }
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/yonetim/:path*"],
};
