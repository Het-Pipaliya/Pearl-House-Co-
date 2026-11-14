import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/db";
import { SITE_URL } from "@/lib/siteUrl";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic"; // reflects products added in the admin

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = ["", "/shop", "/custom", "/about", "/contact", "/shipping", "/privacy", "/terms", "/custom-order-policy"];
  const products = await getProducts().catch(() => []);
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 })),
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/shop?category=${encodeURIComponent(c)}`, lastModified: now, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/shop/${p.slug}`, lastModified: new Date(p.createdAt), priority: 0.6 })),
  ];
}
