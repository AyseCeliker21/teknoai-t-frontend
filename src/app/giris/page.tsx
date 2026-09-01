import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Giriş Yap | TeknoAI-T" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <h1 className="mb-8 text-center text-3xl font-extrabold">Giriş Yap</h1>
      <Card className="p-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </Card>
      <p className="mt-6 text-center text-sm text-muted">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="text-accent-hover hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
