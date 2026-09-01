import { apiFetch } from "@/lib/api";
import { applySession, clearSession, getRefreshToken } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export async function refreshSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const auth = await apiFetch<AuthResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    await applySession(auth);
    return auth.accessToken;
  } catch {
    await clearSession();
    return null;
  }
}
