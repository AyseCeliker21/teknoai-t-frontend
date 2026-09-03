import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api";
import type { NewsListItem, GrantListItem, ProjectListItem, ListingListItem, PagedResult } from "@/lib/types";

const BASE_URL = "https://teknoai-t.com";

// The backend serializes *Utc fields without a timezone suffix and with up to
// 7 fractional-second digits (e.g. "2026-09-01T17:40:12.6445857") — not a
// valid W3C datetime, which Google's sitemap validator rejects outright.
// Passing a real Date through next's sitemap serializer instead of the raw
// string always yields a spec-compliant "...ss.sssZ" timestamp. The strings
// are UTC by name/convention but lack the 'Z', so append one before parsing
// (JS would otherwise read a timezone-less datetime string as local time).
function toValidDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const withZone = /[Zz]|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`;
  const date = new Date(withZone);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function fetchAllPages<T>(path: string): Promise<T[]> {
  const first = await apiFetch<PagedResult<T>>(`${path}${path.includes("?") ? "&" : "?"}page=1&pageSize=100`).catch(
    () => null
  );
  if (!first) return [];

  const items = [...first.items];
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await apiFetch<PagedResult<T>>(`${path}${path.includes("?") ? "&" : "?"}page=${page}&pageSize=100`).catch(
      () => null
    );
    if (next) items.push(...next.items);
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, grants, projects, listings] = await Promise.all([
    fetchAllPages<NewsListItem>("/api/news"),
    fetchAllPages<GrantListItem>("/api/grants"),
    fetchAllPages<ProjectListItem>("/api/projects"),
    fetchAllPages<ListingListItem>("/api/listings"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/kadromuz`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/haberler`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/hibeler`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/ilanlar`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/projeler`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/uyeler`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/iletisim`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${BASE_URL}/haberler/${n.slug}`,
    lastModified: toValidDate(n.publishedAtUtc),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const grantRoutes: MetadataRoute.Sitemap = grants
    .filter((g) => g.status === "Approved")
    .map((g) => ({
      url: `${BASE_URL}/hibeler/${g.slug}`,
      lastModified: toValidDate(g.createdAtUtc),
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projeler/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings
    .filter((l) => l.status === "Approved")
    .map((l) => ({
      url: `${BASE_URL}/ilanlar/${l.id}`,
      lastModified: toValidDate(l.createdAtUtc),
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [...staticRoutes, ...newsRoutes, ...grantRoutes, ...projectRoutes, ...listingRoutes];
}
