"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({ next = "/panel" }: { next?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleCredential(response: { credential: string }) {
    setError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken: response.credential }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Google ile giriş başarısız oldu.");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  function init() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const container = containerRef.current;
    if (!clientId || !window.google || !container) return;

    window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      width: Math.max(200, Math.round(container.getBoundingClientRect().width)),
    });
  }

  return (
    <div>
      <Script src="https://accounts.google.com/gsi/client?hl=tr" strategy="afterInteractive" onLoad={init} />
      <div ref={containerRef} className="flex w-full justify-center" />
      {error && <p className="mt-2 text-center text-sm text-accent-hover">{error}</p>}
    </div>
  );
}
