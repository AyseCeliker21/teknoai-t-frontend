import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { ListingDetail } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, formatDate } from "@/lib/utils";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let listing: ListingDetail;
  try {
    listing = await apiFetch<ListingDetail>(`/api/listings/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  if (listing.status !== "Approved") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex items-center gap-3">
        <Badge variant="accent">{categoryLabel(listing.category)}</Badge>
        <span className="text-sm text-muted">{formatDate(listing.createdAtUtc)}</span>
      </div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{listing.title}</h1>
      <p className="mt-2 text-sm text-muted">{listing.authorName}</p>
      <div className="mt-8">
        <MarkdownContent content={listing.bodyMarkdown} />
      </div>
      {listing.expiresAtUtc && (
        <p className="mt-8 text-sm text-muted">Son geçerlilik: {formatDate(listing.expiresAtUtc)}</p>
      )}
    </article>
  );
}
