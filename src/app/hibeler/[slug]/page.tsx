import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { GrantDetail } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { grantCategoryLabel, formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export default async function GrantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let grant: GrantDetail;
  try {
    grant = await apiFetch<GrantDetail>(`/api/grants/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex items-center gap-3">
        <Badge variant="accent">{grantCategoryLabel(grant.category)}</Badge>
        <span className="text-sm text-muted">{grant.organization}</span>
      </div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{grant.title}</h1>
      <p className="mt-2 text-sm text-muted">
        <Link href={`/uye/${grant.authorId}`} className="hover:text-foreground hover:underline">
          {grant.authorName}
        </Link>{" "}
        · {formatDate(grant.createdAtUtc)}
      </p>
      <p className="mt-4 text-lg text-muted">{grant.summary}</p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {grant.amount && (
          <span>
            <strong>Tutar:</strong> {grant.amount}
          </span>
        )}
        {grant.deadlineAtUtc && (
          <span>
            <strong>Son Başvuru:</strong> {formatDate(grant.deadlineAtUtc)}
          </span>
        )}
      </div>

      {grant.applicationUrl && (
        <LinkButton href={grant.applicationUrl} variant="secondary" target="_blank" rel="noopener noreferrer" className="mt-6">
          <ExternalLink size={16} /> Başvuru Sayfası
        </LinkButton>
      )}

      <div className="mt-8">
        <MarkdownContent content={grant.bodyMarkdown} />
      </div>
    </article>
  );
}
