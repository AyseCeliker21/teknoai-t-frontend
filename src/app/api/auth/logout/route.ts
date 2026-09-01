import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { clearSession, getRefreshToken } from "@/lib/session";

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      /* best effort */
    }
  }

  await clearSession();
  return NextResponse.json({ ok: true });
}
