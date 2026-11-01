import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Ghanaian independent fashion`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f4",
    theme_color: "#302725",
    lang: siteConfig.language,
    categories: ["shopping", "lifestyle"],
  };
}
