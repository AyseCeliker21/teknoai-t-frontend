import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "@/components/ProfileForm";
import { PasswordForm } from "@/components/PasswordForm";

export const metadata = { title: "Profilim | TeknoAI-T" };

export default async function ProfilePage() {
  const token = await getAccessToken();
  const profile = await apiFetch<AuthResponse["user"]>("/api/auth/me", { token });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profilim</h1>
        <p className="mt-1 text-muted">Bilgilerini güncel tut.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Profil Bilgileri</h2>
        <ProfileForm profile={profile} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Şifre Değiştir</h2>
        <PasswordForm />
      </Card>
    </div>
  );
}
