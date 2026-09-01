import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { NewsDetail } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { formatDate } from "@/lib/utils";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let news: NewsDetail;
  try {
    news = await apiFetch<NewsDetail>(`/api/news/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm text-muted">
        {formatDate(news.publishedAtUtc)} · {news.authorName}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{news.title}</h1>
      <p className="mt-4 text-lg text-muted">{news.summary}</p>
      <div className="mt-8">
        <MarkdownContent content={news.contentMarkdown} />
      </div>
    </article>
  );
}
