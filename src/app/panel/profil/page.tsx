import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { AuthResponse, PublicProfile } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ProfileForm } from "@/components/ProfileForm";
import { PasswordForm } from "@/components/PasswordForm";
import { BadgeList } from "@/components/BadgeList";

export const metadata = { title: "Profilim | TeknoAI-T" };

export default async function ProfilePage() {
  const token = await getAccessToken();
  const profile = await apiFetch<AuthResponse["user"]>("/api/auth/me", { token });
  const publicProfile = await apiFetch<PublicProfile>(`/api/users/${profile.id}/profile`, { token }).catch(
    () => null
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profilim</h1>
          <p className="mt-1 text-muted">Bilgilerini güncel tut.</p>
        </div>
        <LinkButton href={`/uye/${profile.id}`} variant="secondary" size="sm">
          Herkese Açık Profilimi Gör
        </LinkButton>
      </div>

      {publicProfile && (
        <Card className="p-6">
          <div className="flex gap-6 text-sm">
            <span>
              <strong>{publicProfile.followerCount}</strong> <span className="text-muted">takipçi</span>
            </span>
            <span>
              <strong>{publicProfile.followingCount}</strong> <span className="text-muted">takip</span>
            </span>
            <span>
              <strong>{publicProfile.friendCount}</strong> <span className="text-muted">arkadaş</span>
            </span>
          </div>
          <h2 className="mb-3 mt-6 font-semibold">Rozetlerim</h2>
          <BadgeList badges={publicProfile.badges} />
        </Card>
      )}

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
