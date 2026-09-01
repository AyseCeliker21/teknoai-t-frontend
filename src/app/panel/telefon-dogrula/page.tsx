import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { OtpVerifyForm } from "@/components/OtpVerifyForm";
import { MessageCircle } from "lucide-react";

export const metadata = { title: "Telefon Doğrulama | TeknoAI-T" };

export default async function VerifyPhonePage() {
  const token = await getAccessToken();
  const profile = await apiFetch<AuthResponse["user"]>("/api/auth/me", { token });

  if (profile.phoneNumberConfirmed) {
    redirect("/panel");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle size={24} className="text-accent-hover" />
        <h1 className="text-2xl font-bold">Telefon Doğrulama</h1>
      </div>
      <p className="mb-6 text-muted">
        {profile.phoneNumber} numaralı WhatsApp hesabına gönderdiğimiz 6 haneli kodu gir.
      </p>
      <Card className="p-6">
        <OtpVerifyForm />
      </Card>
    </div>
  );
}
