import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import CategoryFilter from "@/components/CategoryFilter";
import { getAllPosts, getAllCategories } from "@/lib/blog";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Blog",
    description: "Release notes, guides, and announcements from the @pphatdev/registry project.",
    openGraph: {
        title: "Blog | @pphatdev/registry",
        description: "Release notes, guides, and announcements from the @pphatdev/registry project.",
        type: "website",
        images: [
            {
                url: "/docs.png",
                width: 1200,
                height: 630,
                alt: "@pphatdev/registry blog",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | @pphatdev/registry",
        description: "Release notes, guides, and announcements from the @pphatdev/registry project.",
        images: ["/docs.png"],
    },
    alternates: {
        canonical: "https://registry.pphat.me/blog",
        types: {
            "application/rss+xml": "https://registry.pphat.me/blog/rss.xml",
        },
    },
};

export default function BlogIndexPage() {
    const posts = getAllPosts();
    const categories = getAllCategories();

    return (
        <div className="animate-[fade-up_0.5s_forwards]">
            <header className="mb-10">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-3">
                    <span>Blog</span>
                    <span>/</span>
                    <span className="text-foreground font-bold">All posts</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-foreground">
                    Release notes &amp; updates
                </h1>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Everything new in <code className="font-mono text-foreground font-bold">@pphatdev/registry</code> — CLI releases, workflow guides, and roadmap notes.
                </p>
            </header>

            <CategoryFilter categories={categories} totalCount={posts.length} />

            {posts.length === 0 ? (
                <div className="p-8 text-center rounded-none border border-dashed border-border/60 bg-muted/20 text-muted-foreground text-sm font-mono">
                    No posts yet. Check back soon.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
