import type { MetadataRoute } from "next";

const BASE_URL = "https://teknoai-t.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/panel", // member panel — authenticated area, nothing to index
          "/yonetim", // admin area
          "/api/", // backend proxy routes, not pages
          "/uye/", // individual member profiles — public but not meant for bulk indexing
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
