import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import BlogCard from "@/components/BlogCard";
import CategoryFilter from "@/components/CategoryFilter";
import {
    getAllCategories,
    getAllPosts,
    getCategoryLabel,
    getPostsByCategory,
} from "@/lib/blog";

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
    return getAllCategories().map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category } = await params;
    const label = getCategoryLabel(category);
    return {
        title: `${label} — Blog`,
        description: `${label} from the @pphatdev/registry project.`,
        openGraph: {
            title: `${label} — Blog | @pphatdev/registry`,
            description: `${label} from the @pphatdev/registry project.`,
            type: "website",
            images: [{ url: "/docs.png", width: 1200, height: 630, alt: label }],
        },
        alternates: {
            canonical: `https://registry.pphat.me/blog/category/${category}`,
        },
    };
}

export default async function BlogCategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const posts = getPostsByCategory(category);
    if (posts.length === 0) notFound();

    const categories = getAllCategories();
    const totalCount = getAllPosts().length;
    const label = getCategoryLabel(category);

    return (
        <div className="animate-[fade-up_0.5s_forwards]">
            <header className="mb-10">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-3">
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                    <span>/</span>
                    <span className="text-foreground font-bold">{label}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-foreground">
                    {label}
                </h1>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    {posts.length} post{posts.length === 1 ? "" : "s"} filed under <span className="font-mono text-foreground font-bold">{label.toLowerCase()}</span>.
                </p>
            </header>

            <CategoryFilter categories={categories} totalCount={totalCount} activeCategory={category} />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}
