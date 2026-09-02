import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { GrantListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { grantCategoryLabel, formatDate } from "@/lib/utils";
import { ModerationControl } from "@/components/ModerationControl";

export const metadata = { title: "Hibe/Fon Onayı | Yönetim | TeknoAI-T" };

export default async function AdminGrantModerationPage() {
  const token = await getAccessToken();
  const result = await apiFetch<PagedResult<GrantListItem>>(
    "/api/grants/moderation/pending?page=1&pageSize=50",
    { token }
  ).catch(() => ({ items: [], page: 1, pageSize: 50, totalCount: 0, totalPages: 0 }) as PagedResult<GrantListItem>);

  return (
    <div>
      <h1 className="text-2xl font-bold">Hibe/Fon Onayı</h1>
      <p className="mt-1 text-muted">Üyelerin paylaştığı hibe/fon ilanlarını incele, onayla veya reddet.</p>

      <div className="mt-8 space-y-4">
        {result.items.length === 0 && <p className="text-muted">Onay bekleyen hibe/fon ilanı yok.</p>}
        {result.items.map((g) => (
          <Card key={g.id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="accent">{grantCategoryLabel(g.category)}</Badge>
                <h3 className="mt-2 font-medium">{g.title}</h3>
                <p className="text-sm text-muted">
                  {g.organization} · {g.authorName} · {formatDate(g.createdAtUtc)}
                </p>
              </div>
              <ModerationControl type="grants" id={g.id} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
