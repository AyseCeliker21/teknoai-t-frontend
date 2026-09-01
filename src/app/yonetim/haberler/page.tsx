import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { NewsListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { NewsForm } from "@/components/NewsForm";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Pencil } from "lucide-react";

export const metadata = { title: "Haberler | Yönetim | TeknoAI-T" };

export default async function AdminNewsPage() {
  const token = await getAccessToken();
  const result = await apiFetch<PagedResult<NewsListItem>>("/api/news/admin?page=1&pageSize=50", { token }).catch(
    () => ({ items: [], page: 1, pageSize: 50, totalCount: 0, totalPages: 0 }) as PagedResult<NewsListItem>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Haberler</h1>
        <p className="mt-1 text-muted">Haber ekleyin, düzenleyin veya kaldırın.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Yeni Haber</h2>
        <NewsForm />
      </Card>

      <div className="space-y-3">
        {result.items.map((n) => (
          <Card key={n.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{n.title}</h3>
              <p className="text-sm text-muted">{formatDate(n.publishedAtUtc) || "Taslak"}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/yonetim/haberler/${n.id}/duzenle`}>
                <Button variant="secondary" size="sm">
                  <Pencil size={14} /> Düzenle
                </Button>
              </Link>
              <DeleteButton url={`/api/proxy/news/${n.id}`} confirmText="Bu haberi silmek istediğine emin misin?" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
