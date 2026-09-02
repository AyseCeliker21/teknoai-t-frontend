import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import { refreshSession } from "@/lib/refresh";

async function forward(request: NextRequest, path: string[]) {
  const search = request.nextUrl.search;
  const targetUrl = `${API_URL}/api/${path.join("/")}${search}`;

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;
  // Most callers send JSON via fetch(..., { body: JSON.stringify(x) }) without setting a
  // Content-Type header, so the browser defaults it to "text/plain" — force application/json
  // for those. Only multipart file uploads (FormData) need their real Content-Type preserved,
  // since it carries the boundary parameter the backend needs to parse the body.
  const incomingContentType = request.headers.get("Content-Type");
  const contentType = incomingContentType?.startsWith("multipart/form-data")
    ? incomingContentType
    : "application/json";

  let token = await getAccessToken();

  const doFetch = (accessToken: string | null) =>
    fetch(targetUrl, {
      method: request.method,
      headers: {
        ...(hasBody ? { "Content-Type": contentType } : {}),
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

  const responseBody = await upstream.arrayBuffer();
  return new NextResponse(responseBody.byteLength > 0 ? responseBody : null, {
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
