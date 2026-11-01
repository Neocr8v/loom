import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { journalArticles } from "@/app/journal/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteConfig.siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/journal", siteConfig.siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...journalArticles.map((article) => ({
      url: new URL(`/journal/${article.slug}`, siteConfig.siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
