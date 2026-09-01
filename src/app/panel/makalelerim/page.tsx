import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { ArticleListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { statusLabel, formatDate } from "@/lib/utils";
import { ArticleForm } from "@/components/ArticleForm";

export const metadata = { title: "Makalelerim | TeknoAI-T" };

export default async function MyArticlesPage() {
  const token = await getAccessToken();
  const articles = await apiFetch<ArticleListItem[]>("/api/articles/mine", { token }).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Makalelerim</h1>
        <p className="mt-1 text-muted">Gönderdiğin makaleler admin onayından sonra yayınlanır.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni Makale</h2>
        <ArticleForm />
      </Card>

      <div className="space-y-3">
        {articles.length === 0 && <p className="text-muted">Henüz makale göndermedin.</p>}
        {articles.map((a) => (
          <Card key={a.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{a.title}</h3>
              <p className="text-sm text-muted">{formatDate(a.publishedAtUtc) || "Henüz yayınlanmadı"}</p>
            </div>
            <Badge variant={statusVariant(a.status)}>{statusLabel(a.status)}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
