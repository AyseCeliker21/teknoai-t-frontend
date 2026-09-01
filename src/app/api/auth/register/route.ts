import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";
import { applySession } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const auth = await apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    await applySession(auth);
    return NextResponse.json({ user: auth.user });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof ApiError ? err.message : "Kayıt sırasında bir hata oluştu.";
    return NextResponse.json({ message }, { status });
  }
}
