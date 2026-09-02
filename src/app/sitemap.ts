import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api";
import type { NewsListItem, GrantListItem, ProjectListItem, ListingListItem, PagedResult } from "@/lib/types";

const BASE_URL = "https://teknoai-t.com";

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
    lastModified: n.publishedAtUtc ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const grantRoutes: MetadataRoute.Sitemap = grants
    .filter((g) => g.status === "Approved")
    .map((g) => ({
      url: `${BASE_URL}/hibeler/${g.slug}`,
      lastModified: g.createdAtUtc,
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
      lastModified: l.createdAtUtc,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [...staticRoutes, ...newsRoutes, ...grantRoutes, ...projectRoutes, ...listingRoutes];
}
