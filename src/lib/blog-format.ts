export interface BlogFrontmatter {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    tags: string[];
    author: string;
    cover?: string;
}

export interface BlogPostMeta extends BlogFrontmatter {
    slug: string;
    href: string;
}

export interface BlogCategory {
    slug: string;
    label: string;
    count: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    release: "Release notes",
    guide: "Guides",
    changelog: "Changelog",
    announcement: "Announcements",
};

export function getCategoryLabel(slug: string): string {
    return CATEGORY_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function formatPostDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
