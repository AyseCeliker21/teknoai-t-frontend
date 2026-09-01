import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = { title: "Kayıt Ol | TeknoAI-T" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <h1 className="mb-8 text-center text-3xl font-extrabold">Topluluğa Katıl</h1>
      <Card className="p-6">
        <RegisterForm />
      </Card>
      <p className="mt-6 text-center text-sm text-muted">
        Zaten üye misin?{" "}
        <Link href="/giris" className="text-accent-hover hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
