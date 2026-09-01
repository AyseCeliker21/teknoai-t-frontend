import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { getAccessToken, getSessionUser } from "@/lib/session";
import type { PublicProfile, UserSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Avatar } from "@/components/Avatar";
import { BadgeList } from "@/components/BadgeList";
import { FollowButton } from "@/components/FollowButton";
import { formatDate } from "@/lib/utils";

async function fetchList(path: string, token: string | null) {
  return apiFetch<UserSummary[]>(path, { token }).catch(() => []);
}

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [token, me] = await Promise.all([getAccessToken(), getSessionUser()]);

  let profile: PublicProfile;
  try {
    profile = await apiFetch<PublicProfile>(`/api/users/${id}/profile`, { token });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const isOwnProfile = me?.id === id;
  const [followers, following, friends] = await Promise.all([
    fetchList(`/api/users/${id}/followers`, token),
    fetchList(`/api/users/${id}/following`, token),
    fetchList(`/api/users/${id}/friends`, token),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card className="p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={profile.fullName} avatarUrl={profile.avatarUrl} size={64} />
            <div>
              <h1 className="text-2xl font-bold">{profile.fullName}</h1>
              {profile.title && <p className="text-muted">{profile.title}</p>}
              <p className="mt-1 text-xs text-muted">Katılım: {formatDate(profile.createdAtUtc)}</p>
            </div>
          </div>

          {isOwnProfile ? (
            <LinkButton href="/panel/profil" variant="secondary" size="sm">
              Profilimi Düzenle
            </LinkButton>
          ) : me ? (
            <FollowButton
              userId={profile.id}
              initialIsFollowing={profile.isFollowedByCurrentUser}
              initialIsFriend={profile.isFriend}
            />
          ) : null}
        </div>

        {profile.bio && <p className="mt-6 whitespace-pre-line text-sm text-muted">{profile.bio}</p>}

        <div className="mt-6 flex gap-6 text-sm">
          <span>
            <strong>{profile.followerCount}</strong> <span className="text-muted">takipçi</span>
          </span>
          <span>
            <strong>{profile.followingCount}</strong> <span className="text-muted">takip</span>
          </span>
          <span>
            <strong>{profile.friendCount}</strong> <span className="text-muted">arkadaş</span>
          </span>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-semibold">Rozetler</h2>
        <BadgeList badges={profile.badges} />
      </Card>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <UserList title="Arkadaşlar" users={friends} />
        <UserList title="Takipçiler" users={followers} />
        <UserList title="Takip Edilenler" users={following} />
      </div>
    </div>
  );
}

function UserList({ title, users }: { title: string; users: UserSummary[] }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-muted">
        {title} ({users.length})
      </h3>
      {users.length === 0 ? (
        <p className="text-sm text-muted">Henüz kimse yok.</p>
      ) : (
        <ul className="space-y-2">
          {users.slice(0, 6).map((u) => (
            <li key={u.id}>
              <Link href={`/uye/${u.id}`} className="flex items-center gap-2 rounded-lg p-1 hover:bg-surface-2">
                <Avatar name={u.fullName} avatarUrl={u.avatarUrl} size={28} />
                <span className="truncate text-sm">{u.fullName}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
