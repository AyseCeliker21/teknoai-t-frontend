import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import { refreshSession } from "@/lib/refresh";

export async function POST(request: NextRequest) {
  let token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Bu özelliği kullanmak için giriş yapmalısınız." }, { status: 401 });
  }

  const body = await request.text();

  const doFetch = (accessToken: string) =>
    fetch(`${API_URL}/api/assistant/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

  let upstream = await doFetch(token);

  if (upstream.status === 401) {
    const refreshed = await refreshSession();
    if (refreshed) {
      token = refreshed;
      upstream = await doFetch(token);
    }
  }

  if (!upstream.body) {
    return NextResponse.json({ message: "Asistan yanıt veremedi." }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ message: "Asistan şu anda yanıt veremiyor, lütfen tekrar giriş yapın." }, { status: upstream.status });
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
