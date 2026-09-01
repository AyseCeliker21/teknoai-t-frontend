import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { NewsListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Haberler | TeknoAI-T" };

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const result = await apiFetch<PagedResult<NewsListItem>>(`/api/news?page=${page}&pageSize=9`).catch(
    () => ({ items: [], page: 1, pageSize: 9, totalCount: 0, totalPages: 0 }) as PagedResult<NewsListItem>
  );

  return (
    <>
      <PageHeader title="Haberler" description="Topluluktan güncel gelişmeler ve duyurular." />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      {result.items.length === 0 ? (
        <p className="text-muted">Henüz haber eklenmedi.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((n) => (
            <Link key={n.id} href={`/haberler/${n.slug}`}>
              <Card className="h-full p-5 transition-colors hover:border-accent/50">
                <p className="text-xs text-muted">{formatDate(n.publishedAtUtc)}</p>
                <h3 className="mt-2 font-semibold leading-snug">{n.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{n.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {result.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/haberler?page=${p}`}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                p === page ? "bg-accent text-white" : "bg-surface-2 text-muted hover:text-foreground"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
