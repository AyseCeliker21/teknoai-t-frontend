import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ArticleListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { ModerationControl } from "@/components/ModerationControl";

export const metadata = { title: "Makale Onayı | Yönetim | TeknoAI-T" };

export default async function AdminArticleModerationPage() {
  const token = await getAccessToken();
  const result = await apiFetch<PagedResult<ArticleListItem>>(
    "/api/articles/moderation/pending?page=1&pageSize=50",
    { token }
  ).catch(() => ({ items: [], page: 1, pageSize: 50, totalCount: 0, totalPages: 0 }) as PagedResult<ArticleListItem>);

  return (
    <div>
      <h1 className="text-2xl font-bold">Makale Onayı</h1>
      <p className="mt-1 text-muted">Üyelerin gönderdiği makaleleri incele, onayla veya reddet.</p>

      <div className="mt-8 space-y-4">
        {result.items.length === 0 && <p className="text-muted">Onay bekleyen makale yok.</p>}
        {result.items.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-medium">{a.title}</h3>
                <p className="text-sm text-muted">
                  {a.authorName} · {formatDate(a.publishedAtUtc) || "gönderildi"}
                </p>
                <p className="mt-2 text-sm text-muted">{a.summary}</p>
                {a.tags && <p className="mt-1 text-xs text-accent-hover">{a.tags}</p>}
              </div>
              <ModerationControl type="articles" id={a.id} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
