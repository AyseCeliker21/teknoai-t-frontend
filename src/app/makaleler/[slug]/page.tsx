import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { ArticleDetail } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { formatDate } from "@/lib/utils";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article: ArticleDetail;
  try {
    article = await apiFetch<ArticleDetail>(`/api/articles/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm text-muted">
        {article.authorName} · {formatDate(article.publishedAtUtc)}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{article.title}</h1>
      <p className="mt-4 text-lg text-muted">{article.summary}</p>
      {article.tags && <p className="mt-3 text-sm text-accent-hover">{article.tags}</p>}
      <div className="mt-8">
        <MarkdownContent content={article.contentMarkdown} />
      </div>
    </article>
  );
}
