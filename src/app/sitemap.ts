import { MetadataRoute } from "next";
import { FLAT_DOCS } from "@/config/docs";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || "https://pphat.me";

    // Base routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
    ];

    // Documentation routes
    const docsRoutes: MetadataRoute.Sitemap = FLAT_DOCS.map((doc) => ({
        url: `${baseUrl}${doc.href}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [...routes, ...docsRoutes];
}
