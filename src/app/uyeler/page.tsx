import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken, getSessionUser } from "@/lib/session";
import type { PagedResult, UserSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { FollowButton } from "@/components/FollowButton";

export const metadata = { title: "Üyeler | TeknoAI-T" };

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const qs = q ? `&search=${encodeURIComponent(q)}` : "";

  const [token, me] = await Promise.all([getAccessToken(), getSessionUser()]);
  const [result, following] = await Promise.all([
    apiFetch<PagedResult<UserSummary>>(`/api/users?page=1&pageSize=48${qs}`).catch(
      () => ({ items: [], page: 1, pageSize: 48, totalCount: 0, totalPages: 0 }) as PagedResult<UserSummary>
    ),
    me ? apiFetch<UserSummary[]>(`/api/users/${me.id}/following`, { token }).catch(() => []) : Promise.resolve([]),
  ]);

  const followingIds = new Set(following.map((u) => u.id));

  return (
    <>
      <PageHeader title="Üyeler" description="Topluluk üyelerini keşfet, takip et, arkadaş ol." />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <form className="mb-8 max-w-sm">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="İsimle ara..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </form>

        {result.items.length === 0 ? (
          <p className="text-muted">Üye bulunamadı.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((u) => (
              <Card key={u.id} className="flex items-center justify-between gap-3 p-4">
                <Link href={`/uye/${u.id}`} className="flex min-w-0 items-center gap-3">
                  <Avatar name={u.fullName} avatarUrl={u.avatarUrl} size={44} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{u.fullName}</p>
                    {u.title && <p className="truncate text-sm text-muted">{u.title}</p>}
                  </div>
                </Link>
                {me && me.id !== u.id && (
                  <FollowButton userId={u.id} initialIsFollowing={followingIds.has(u.id)} initialIsFriend={false} />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
