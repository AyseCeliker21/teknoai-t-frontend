import type { MetadataRoute } from "next";

const BASE_URL = "https://teknoai-t.com";

// Same list proxy.ts actually enforces with a 403 — this is the polite,
// advisory half for bots that bother to check robots.txt at all.
const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "GoogleOther",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Omgili",
  "Timpibot",
  "YouBot",
  "cohere-ai",
  "Cohere-training-data-crawler",
  "Kangaroo Bot",
  "Google-CloudVertexBot",
];

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
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
