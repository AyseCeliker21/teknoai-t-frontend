"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function OtpVerifyForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proxy/auth/verify-phone", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || "Kod hatalı ya da süresi dolmuş.");
      }
      setMessage("Telefon numaran doğrulandı!");
      router.push("/panel");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/proxy/auth/resend-otp", { method: "POST" });
      if (!res.ok) throw new Error("Kod tekrar gönderilemedi.");
      setMessage("Yeni kod WhatsApp'a gönderildi.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="code">6 Haneli Kod</Label>
        <Input
          id="code"
          required
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
          className="text-center text-lg tracking-[0.5em]"
        />
      </div>
      {message && <p className="text-sm text-accent-hover">{message}</p>}
      <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
        {loading ? "Doğrulanıyor…" : "Doğrula"}
      </Button>
      <Button type="button" variant="ghost" disabled={resending} onClick={handleResend} className="w-full">
        {resending ? "Gönderiliyor…" : "Kodu tekrar gönder"}
      </Button>
    </form>
  );
}
