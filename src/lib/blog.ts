import "server-only";
import fs from "fs";
import path from "path";
import type { BlogCategory, BlogFrontmatter, BlogPostMeta } from "./blog-format";
import { getCategoryLabel } from "./blog-format";

export type { BlogCategory, BlogFrontmatter, BlogPostMeta } from "./blog-format";
export { formatPostDate, getCategoryLabel } from "./blog-format";

export interface BlogPost extends BlogPostMeta {
    content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(source: string): { data: Partial<BlogFrontmatter>; content: string } {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { data: {}, content: source };

    const [, block, content] = match;
    const data: Record<string, string | string[]> = {};

    for (const rawLine of block.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const idx = line.indexOf(":");
        if (idx === -1) continue;

        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();

        if (value.startsWith("[") && value.endsWith("]")) {
            const inner = value.slice(1, -1).trim();
            data[key] = inner
                ? inner.split(",").map((item) => stripQuotes(item.trim()))
                : [];
            continue;
        }

        data[key] = stripQuotes(value);
    }

    return { data: data as Partial<BlogFrontmatter>, content };
}

function stripQuotes(value: string): string {
    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }
    return value;
}

function readPostFile(slug: string): BlogPost | null {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;

    const source = fs.readFileSync(filePath, "utf8");
    const { data, content } = parseFrontmatter(source);

    if (!data.title || !data.date) return null;

    return {
        slug,
        href: `/blog/${slug}`,
        title: data.title,
        excerpt: data.excerpt ?? "",
        date: data.date,
        category: data.category ?? "guide",
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author ?? "PPhat",
        cover: data.cover,
        content,
    };
}

export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIR)) return [];
    return fs
        .readdirSync(BLOG_DIR)
        .filter((name) => name.endsWith(".mdx"))
        .map((name) => name.replace(/\.mdx$/, ""));
}

export function getAllPosts(): BlogPostMeta[] {
    return getAllPostSlugs()
        .map((slug) => readPostFile(slug))
        .filter((post): post is BlogPost => post !== null)
        .map(({ content: _content, ...meta }) => {
            void _content;
            return meta;
        })
        .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
    return readPostFile(slug);
}

export function getAllCategories(): BlogCategory[] {
    const counts = new Map<string, number>();
    for (const post of getAllPosts()) {
        counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
        .map(([slug, count]) => ({
            slug,
            label: getCategoryLabel(slug),
            count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
    return getAllPosts().filter((post) => post.category === category);
}
