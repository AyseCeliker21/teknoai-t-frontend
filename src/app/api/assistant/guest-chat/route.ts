import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

const GUEST_COUNT_COOKIE = "tekno_guest_chats";
const GUEST_CHAT_LIMIT = 3;

export async function POST(request: NextRequest) {
  const jar = await cookies();
  const current = Number(jar.get(GUEST_COUNT_COOKIE)?.value ?? "0");

  if (current >= GUEST_CHAT_LIMIT) {
    return NextResponse.json(
      { message: "Misafir sohbet hakkın doldu. Devam etmek için ücretsiz üye ol." },
      { status: 403 }
    );
  }

  const body = await request.text();

  const upstream = await fetch(`${API_URL}/api/assistant/guest-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!upstream.body) {
    return NextResponse.json({ message: "Asistan yanıt veremedi." }, { status: 502 });
  }

  jar.set(GUEST_COUNT_COOKIE, String(current + 1), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Guest-Chats-Remaining": String(GUEST_CHAT_LIMIT - current - 1),
    },
  });
}

export async function GET() {
  const jar = await cookies();
  const current = Number(jar.get(GUEST_COUNT_COOKIE)?.value ?? "0");
  return NextResponse.json({ remaining: Math.max(0, GUEST_CHAT_LIMIT - current) });
}
