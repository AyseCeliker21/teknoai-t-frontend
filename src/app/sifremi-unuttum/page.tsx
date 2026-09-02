import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata = { title: "Şifremi Unuttum | TeknoAI-T" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <h1 className="mb-2 text-center text-3xl font-extrabold">Şifremi Unuttum</h1>
      <p className="mb-8 text-center text-sm text-muted">
        E-posta adresini gir, doğrulama kodu e-postana gönderelim.
      </p>
      <Card className="p-6">
        <ForgotPasswordForm />
      </Card>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/giris" className="text-accent-hover hover:underline">
          ← Giriş sayfasına dön
        </Link>
      </p>
    </div>
  );
}
