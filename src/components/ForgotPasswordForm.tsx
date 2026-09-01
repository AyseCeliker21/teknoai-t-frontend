"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type Step = "email" | "code";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [codeChecking, setCodeChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestCode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Kod gönderilemedi.");
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await fetch("/api/proxy/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } finally {
      setResending(false);
    }
  }

  async function handleVerifyCode(value: string) {
    setError(null);
    setCodeChecking(true);
    try {
      const res = await fetch("/api/proxy/auth/forgot-password/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code: value }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setResetToken(null);
        throw new Error(data?.title || "Kod hatalı.");
      }
      setResetToken(data.resetToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setCodeChecking(false);
    }
  }

  function handleCodeChange(value: string) {
    const digits = value.replace(/[^0-9]/g, "");
    setCode(digits);
    setResetToken(null);
    if (digits.length === 6) {
      handleVerifyCode(digits);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (!resetToken) return;

    setLoading(true);
    try {
      const res = await fetch("/api/proxy/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, resetToken, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || "Şifre sıfırlanamadı.");
      }
      router.push("/giris");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={handleRequestCode} className="space-y-4">
        <div>
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <p className="text-sm text-accent-hover">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Kod gönderiliyor…" : "Kod Gönder"}
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Kayıtlı WhatsApp numarana bir kod gönderdik (eğer bu e-posta kayıtlıysa).
      </p>
      <div>
        <Label htmlFor="code">6 Haneli Kod</Label>
        <Input
          id="code"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="text-center text-lg tracking-[0.5em]"
        />
        {codeChecking && <p className="mt-1.5 text-xs text-muted">Kontrol ediliyor…</p>}
      </div>

      {resetToken && (
        <form onSubmit={handleResetPassword} className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm text-accent-hover">
            <CheckCircle2 size={16} />
            Kod doğrulandı, yeni şifreni belirleyebilirsin.
          </div>
          <div>
            <Label htmlFor="newPassword">Yeni Şifre</Label>
            <Input
              id="newPassword"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sıfırlanıyor…" : "Şifreyi Sıfırla"}
          </Button>
        </form>
      )}

      {error && <p className="text-sm text-accent-hover">{error}</p>}

      <div className="flex items-center justify-between text-sm">
        <button type="button" className="text-muted hover:text-foreground" onClick={() => setStep("email")}>
          ← E-postayı değiştir
        </button>
        <button type="button" disabled={resending} className="text-accent-hover hover:underline" onClick={handleResend}>
          {resending ? "Gönderiliyor…" : "Kodu tekrar gönder"}
        </button>
      </div>
    </div>
  );
}
