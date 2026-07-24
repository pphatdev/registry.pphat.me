import type { MetadataRoute } from "next";

const AI_USER_AGENTS = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "cohere-ai",
    "Meta-ExternalAgent",
    "Meta-ExternalFetcher",
    "Bytespider",
    "Amazonbot",
    "DuckAssistBot",
    "Diffbot",
];

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://registry.pphat.me";

    return {
        rules: [
            { userAgent: "*", allow: "/" },
            { userAgent: AI_USER_AGENTS, allow: "/" },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
