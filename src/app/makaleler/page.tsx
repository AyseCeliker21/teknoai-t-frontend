import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { ArticleListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { PenLine } from "lucide-react";

export const metadata = { title: "Makaleler | TeknoAI-T" };

export default async function ArticlesPage() {
  const result = await apiFetch<PagedResult<ArticleListItem>>("/api/articles?page=1&pageSize=24").catch(
    () => ({ items: [], page: 1, pageSize: 24, totalCount: 0, totalPages: 0 }) as PagedResult<ArticleListItem>
  );

  return (
    <>
      <PageHeader
        title="Makaleler"
        description="Topluluk üyelerinin kaleme aldığı yazılar."
        action={
          <LinkButton href="/panel/makalelerim" variant="heroSecondary">
            <PenLine size={16} /> Makale Yaz
          </LinkButton>
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      {result.items.length === 0 ? (
        <p className="text-muted">Henüz yayınlanmış makale yok.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((a) => (
            <Link key={a.id} href={`/makaleler/${a.slug}`}>
              <Card className="h-full p-5 transition-colors hover:border-accent/50">
                <p className="text-xs text-muted">
                  {a.authorName} · {formatDate(a.publishedAtUtc)}
                </p>
                <h3 className="mt-2 font-semibold leading-snug">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{a.summary}</p>
                {a.tags && <p className="mt-3 text-xs text-accent-hover">{a.tags}</p>}
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
