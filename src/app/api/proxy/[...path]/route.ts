import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import { refreshSession } from "@/lib/refresh";

async function forward(request: NextRequest, path: string[]) {
  const search = request.nextUrl.search;
  const targetUrl = `${API_URL}/api/${path.join("/")}${search}`;

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  let token = await getAccessToken();

  const doFetch = (accessToken: string | null) =>
    fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body,
      cache: "no-store",
    });

  let upstream = await doFetch(token);

  if (upstream.status === 401 && token) {
    token = await refreshSession();
    if (token) {
      upstream = await doFetch(token);
    }
  }

  const responseBody = await upstream.text();
  return new NextResponse(responseBody || null, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(request, path);
}
