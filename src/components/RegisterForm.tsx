"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type Step = "form" | "otp";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/proxy/auth/phone/request-otp", {
        method: "POST",
        body: JSON.stringify({ phoneNumber }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.title || "Kod gönderilemedi.");
      }
      setStep("otp");
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
      const res = await fetch("/api/proxy/auth/phone/request-otp", {
        method: "POST",
        body: JSON.stringify({ phoneNumber }),
      });
      if (!res.ok) throw new Error("Kod tekrar gönderilemedi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setResending(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/proxy/auth/phone/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phoneNumber, code }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.title || "Kod hatalı ya da süresi dolmuş.");

      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, phoneNumber, password, verificationToken: data.verificationToken }),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.message || "Kayıt başarısız.");

      router.push("/panel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-accent-hover">
          <CheckCircle2 size={16} />
          {phoneNumber} numarasına doğrulama kodu gönderildi.
        </div>
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
        {error && <p className="text-sm text-accent-hover">{error}</p>}
        <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
          {loading ? "Doğrulanıyor ve kayıt oluyor…" : "Doğrula ve Kayıt Ol"}
        </Button>
        <div className="flex items-center justify-between text-sm">
          <button type="button" className="text-muted hover:text-foreground" onClick={() => setStep("form")}>
            ← Bilgileri düzenle
          </button>
          <button type="button" disabled={resending} className="text-accent-hover hover:underline" onClick={handleResend}>
            {resending ? "Gönderiliyor…" : "Kodu tekrar gönder"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleRequestOtp} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Ad Soyad</Label>
        <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="phoneNumber">WhatsApp Numarası</Label>
        <Input
          id="phoneNumber"
          type="tel"
          required
          placeholder="+905XXXXXXXXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="mt-1.5 text-xs text-muted">En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir.</p>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
        <Input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-accent-hover">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Kod gönderiliyor…" : "Telefonu Doğrula"}
      </Button>
    </form>
  );
}
