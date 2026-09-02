import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { GrantListItem, PagedResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { grantCategoryLabel, formatDate } from "@/lib/utils";
import { HandCoins } from "lucide-react";

export const metadata = { title: "Hibeler / Fonlar | TeknoAI-T" };

const categories = ["Girisimcilik", "Akademik", "Teknoloji", "Egitim", "Diger"];

export default async function GrantsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const qs = category ? `&category=${category}` : "";
  const result = await apiFetch<PagedResult<GrantListItem>>(`/api/grants?page=1&pageSize=24${qs}`).catch(
    () => ({ items: [], page: 1, pageSize: 24, totalCount: 0, totalPages: 0 }) as PagedResult<GrantListItem>
  );

  return (
    <>
      <PageHeader
        title="Hibeler / Fonlar"
        description="Girişimciler, araştırmacılar ve öğrenciler için güncel hibe ve fon fırsatları."
        action={
          <LinkButton href="/panel/hibelerim" variant="heroSecondary">
            <HandCoins size={16} /> Hibe/Fon Paylaş
          </LinkButton>
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/hibeler"
            className={`rounded-full px-3.5 py-1.5 text-sm ${!category ? "bg-accent text-white" : "bg-surface-2 text-muted"}`}
          >
            Tümü
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/hibeler?category=${c}`}
              className={`rounded-full px-3.5 py-1.5 text-sm ${category === c ? "bg-accent text-white" : "bg-surface-2 text-muted"}`}
            >
              {grantCategoryLabel(c)}
            </Link>
          ))}
        </div>

        {result.items.length === 0 ? (
          <p className="text-muted">Bu kategoride hibe/fon ilanı bulunamadı.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((g) => (
              <Link key={g.id} href={`/hibeler/${g.slug}`}>
                <Card className="h-full p-5 transition-colors hover:border-accent/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent">{grantCategoryLabel(g.category)}</Badge>
                    {g.deadlineAtUtc && <span className="text-xs text-muted">Son: {formatDate(g.deadlineAtUtc)}</span>}
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug">{g.title}</h3>
                  <p className="mt-2 text-sm text-muted">{g.organization}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{g.summary}</p>
                  {g.amount && <p className="mt-3 text-xs text-accent-hover">{g.amount}</p>}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
