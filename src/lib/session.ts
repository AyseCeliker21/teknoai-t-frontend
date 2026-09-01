import { cookies } from "next/headers";
import type { AuthResponse, SessionUser } from "./types";

export const ACCESS_COOKIE = "tekno_at";
export const REFRESH_COOKIE = "tekno_rt";
export const USER_COOKIE = "tekno_user";

const isProd = process.env.NODE_ENV === "production";

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return !!user?.roles.includes("Yonetici");
}

export async function applySession(auth: AuthResponse) {
  const jar = await cookies();

  jar.set(ACCESS_COOKIE, auth.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: new Date(auth.accessTokenExpiresAtUtc),
  });

  jar.set(REFRESH_COOKIE, auth.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  const user: SessionUser = {
    id: auth.user.id,
    fullName: auth.user.fullName,
    email: auth.user.email,
    roles: auth.user.roles,
  };

  jar.set(USER_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete(USER_COOKIE);
}
