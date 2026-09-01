import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type { NewsDetail } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { NewsForm } from "@/components/NewsForm";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getAccessToken();
  const news = await apiFetch<NewsDetail>(`/api/news/admin/${id}`, { token });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Haberi Düzenle</h1>
      <Card className="p-6">
        <NewsForm id={id} initial={news} />
      </Card>
    </div>
  );
}
