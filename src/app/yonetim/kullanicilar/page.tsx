import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { AdminUserListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { UserRoleControl } from "@/components/UserRoleControl";

export const metadata = { title: "Kullanıcılar | Yönetim | TeknoAI-T" };

export default async function AdminUsersPage() {
  const token = await getAccessToken();
  const users = await apiFetch<AdminUserListItem[]>("/api/admin/users", { token }).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Kullanıcılar</h1>
      <p className="mt-1 text-muted">Rolleri yönetin ve hesapları kilitleyin.</p>

      <div className="mt-8 space-y-3">
        {users.map((u) => (
          <Card key={u.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{u.fullName}</h3>
              <p className="text-sm text-muted">
                {u.email} · Katılım: {formatDate(u.createdAtUtc)}
                {u.lockedOut && <span className="ml-2 text-accent-hover">(Kilitli)</span>}
              </p>
            </div>
            <UserRoleControl userId={u.id} roles={u.roles} lockedOut={u.lockedOut} />
          </Card>
        ))}
      </div>
    </div>
  );
}
