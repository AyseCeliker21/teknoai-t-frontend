import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ListingListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, formatDate } from "@/lib/utils";
import { ModerationControl } from "@/components/ModerationControl";

export const metadata = { title: "İlan Onayı | Yönetim | TeknoAI-T" };

export default async function AdminListingModerationPage() {
  const token = await getAccessToken();
  const result = await apiFetch<PagedResult<ListingListItem>>(
    "/api/listings/moderation/pending?page=1&pageSize=50",
    { token }
  ).catch(() => ({ items: [], page: 1, pageSize: 50, totalCount: 0, totalPages: 0 }) as PagedResult<ListingListItem>);

  return (
    <div>
      <h1 className="text-2xl font-bold">İlan Onayı</h1>
      <p className="mt-1 text-muted">Üyelerin gönderdiği ilanları incele, onayla veya reddet.</p>

      <div className="mt-8 space-y-4">
        {result.items.length === 0 && <p className="text-muted">Onay bekleyen ilan yok.</p>}
        {result.items.map((l) => (
          <Card key={l.id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="accent">{categoryLabel(l.category)}</Badge>
                <h3 className="mt-2 font-medium">{l.title}</h3>
                <p className="text-sm text-muted">
                  {l.authorName} · {formatDate(l.createdAtUtc)}
                </p>
              </div>
              <ModerationControl type="listings" id={l.id} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
