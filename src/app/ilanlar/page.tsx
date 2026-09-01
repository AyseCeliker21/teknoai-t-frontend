import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { ListingListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { categoryLabel, formatDate } from "@/lib/utils";
import { Megaphone } from "lucide-react";

export const metadata = { title: "İlanlar | TeknoAI-T" };

const categories = ["Etkinlik", "IsIlani", "Duyuru", "Diger"];

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const qs = category ? `&category=${category}` : "";
  const result = await apiFetch<PagedResult<ListingListItem>>(`/api/listings?page=1&pageSize=24${qs}`).catch(
    () => ({ items: [], page: 1, pageSize: 24, totalCount: 0, totalPages: 0 }) as PagedResult<ListingListItem>
  );

  return (
    <>
      <PageHeader
        title="İlanlar"
        description="Etkinlikler, iş ilanları ve topluluk duyuruları."
        action={
          <LinkButton href="/panel/ilanlarim" variant="heroSecondary">
            <Megaphone size={16} /> İlan Ver
          </LinkButton>
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/ilanlar"
          className={`rounded-full px-3.5 py-1.5 text-sm ${!category ? "bg-accent text-white" : "bg-surface-2 text-muted"}`}
        >
          Tümü
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/ilanlar?category=${c}`}
            className={`rounded-full px-3.5 py-1.5 text-sm ${category === c ? "bg-accent text-white" : "bg-surface-2 text-muted"}`}
          >
            {categoryLabel(c)}
          </Link>
        ))}
      </div>

      {result.items.length === 0 ? (
        <p className="text-muted">Bu kategoride ilan bulunamadı.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((l) => (
            <Link key={l.id} href={`/ilanlar/${l.id}`}>
              <Card className="h-full p-5 transition-colors hover:border-accent/50">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">{categoryLabel(l.category)}</Badge>
                  <span className="text-xs text-muted">{formatDate(l.createdAtUtc)}</span>
                </div>
                <h3 className="mt-3 font-semibold leading-snug">{l.title}</h3>
                <p className="mt-2 text-sm text-muted">{l.authorName}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
