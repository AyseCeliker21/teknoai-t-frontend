import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/session";

// SignalR's browser client connects directly to the .NET backend (a different
// origin from this BFF), so it can't rely on the httpOnly session cookie —
// it needs the raw access token to authenticate the hub connection. This
// route hands out the current (already-refreshed-if-needed) token to the
// authenticated caller only; nothing else can read it.
export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ accessToken: token });
}
