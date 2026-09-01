"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { WhatsAppBotStatus } from "@/lib/types";

const POLL_MS = 4000;

const STATUS_LABELS: Record<string, string> = {
  connected: "Bağlı",
  waiting_for_qr_scan: "QR kodu bekleniyor",
  starting: "Başlatılıyor",
  unreachable: "Ulaşılamıyor",
  not_configured: "Yapılandırılmamış",
  unknown: "Bilinmiyor",
};

export function WhatsAppQrPanel() {
  const [status, setStatus] = useState<WhatsAppBotStatus | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const qrUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/proxy/admin/whatsapp/status", { cache: "no-store" });
        if (!cancelled && res.ok) {
          const data = (await res.json()) as WhatsAppBotStatus;
          setStatus(data);

          if (data.configured && !data.connected) {
            const qrRes = await fetch(`/api/proxy/admin/whatsapp/qr?t=${Date.now()}`, { cache: "no-store" });
            if (!cancelled) {
              if (qrRes.ok) {
                const blob = await qrRes.blob();
                const url = URL.createObjectURL(blob);
                if (qrUrlRef.current) URL.revokeObjectURL(qrUrlRef.current);
                qrUrlRef.current = url;
                setQrUrl(url);
                setQrError(null);
              } else {
                const body = await qrRes.json().catch(() => null);
                setQrError(body?.message ?? "QR kodu şu anda mevcut değil.");
                if (qrUrlRef.current) {
                  URL.revokeObjectURL(qrUrlRef.current);
                  qrUrlRef.current = null;
                }
                setQrUrl(null);
              }
            }
          } else {
            if (qrUrlRef.current) {
              URL.revokeObjectURL(qrUrlRef.current);
              qrUrlRef.current = null;
            }
            setQrUrl(null);
            setQrError(null);
          }
        }
      } catch {
        if (!cancelled) setStatus({ configured: false, connected: false, status: "unreachable" });
      }
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (qrUrlRef.current) URL.revokeObjectURL(qrUrlRef.current);
    };
  }, []);

  const statusLabel = status ? STATUS_LABELS[status.status] ?? status.status : "Yükleniyor...";

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            status?.connected ? "bg-emerald-500" : status?.configured ? "bg-amber-500" : "bg-red-500"
          )}
        />
        <span className="font-medium">{statusLabel}</span>
      </div>

      {!status?.configured && (
        <p className="mt-4 text-sm text-muted">
          WhatsApp botu henüz yapılandırılmamış. Backend&apos;deki{" "}
          <code className="rounded bg-surface-2 px-1 py-0.5">WhatsApp:BotBaseUrl</code> ayarını bot servisinin
          adresine ayarlayın.
        </p>
      )}

      {status?.configured && status.connected && (
        <p className="mt-4 text-sm text-muted">
          WhatsApp botu bağlı ve OTP/duyuru mesajları gönderebilir. Bağlantıyı yenilemek gerekirse bot
          sunucusundaki oturum verisini (tokens/ klasörü) silip yeniden başlatın.
        </p>
      )}

      {status?.configured && !status.connected && (
        <div className="mt-6">
          <p className="text-sm text-muted">
            Telefonunda WhatsApp &gt; Ayarlar &gt; Bağlı Cihazlar &gt; Cihaz Bağla menüsünden bu QR kodu okut.
            Kod birkaç saniyede bir yenilenir.
          </p>
          <div className="mt-4 flex h-64 w-64 items-center justify-center rounded-xl border border-border bg-white p-3">
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrUrl} alt="WhatsApp bağlantı QR kodu" className="h-full w-full object-contain" />
            ) : (
              <p className="px-4 text-center text-sm text-muted">{qrError ?? "QR kodu yükleniyor..."}</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
