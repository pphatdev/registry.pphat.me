import { getAllPosts, getCategoryLabel } from "@/lib/blog";

export const dynamic = "force-static";

const SITE_URL = "https://registry.pphat.me";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export function GET() {
    const posts = getAllPosts();
    const buildDate = new Date().toUTCString();

    const items = posts
        .map((post) => {
            const url = `${SITE_URL}${post.href}`;
            const pubDate = new Date(post.date).toUTCString();
            const categoriesXml = [post.category, ...post.tags]
                .map((c) => `      <category>${escapeXml(c)}</category>`)
                .join("\n");
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <author>noreply@pphat.me (${escapeXml(post.author)})</author>
${categoriesXml}
      <source url="${SITE_URL}/blog/rss.xml">${escapeXml(getCategoryLabel(post.category))}</source>
    </item>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>@pphatdev/registry — Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Release notes, guides, and announcements from the @pphatdev/registry project.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>registry.pphat.me</generator>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    });
}
