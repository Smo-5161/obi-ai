import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/legal/cgu`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
