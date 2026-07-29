import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

import { mdxComponents } from "@/components/MdxContent";
import {
    formatPostDate,
    getAllPosts,
    getAllPostSlugs,
    getCategoryLabel,
    getPostBySlug,
} from "@/lib/blog";

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
    return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return { title: "Not Found | @pphatdev/registry" };
    }

    const url = `https://registry.pphat.me${post.href}`;

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: `${post.title} | @pphatdev/registry`,
            description: post.excerpt,
            type: "article",
            url,
            publishedTime: post.date,
            authors: [post.author],
            tags: post.tags,
            images: [
                {
                    url: post.cover ?? "/docs.png",
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${post.title} | @pphatdev/registry`,
            description: post.excerpt,
            images: [post.cover ?? "/docs.png"],
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const allPosts = getAllPosts();
    const currentIndex = allPosts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const url = `https://registry.pphat.me${post.href}`;

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        datePublished: post.date,
        dateModified: post.date,
        keywords: post.tags.join(", "),
        author: {
            "@type": "Person",
            name: post.author,
            url: "https://pphat.me",
        },
        publisher: {
            "@type": "Person",
            name: "Sophat LEAT (PPhat)",
            url: "https://pphat.me",
        },
        image: `https://registry.pphat.me${post.cover ?? "/docs.png"}`,
        articleSection: getCategoryLabel(post.category),
    };

    return (
        <article className="animate-[fade-up_0.5s_forwards] max-w-3xl mx-auto pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
                }}
            />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <span>/</span>
                <Link
                    href={`/blog/category/${post.category}`}
                    className="hover:text-primary transition-colors"
                >
                    {getCategoryLabel(post.category)}
                </Link>
                <span>/</span>
                <span className="text-foreground font-bold truncate">{post.title}</span>
            </div>

            {/* Post header */}
            <header className="mb-10 pb-8 border-b border-border/40">
                <div className="flex items-center gap-2 mb-4">
                    <Link
                        href={`/blog/category/${post.category}`}
                        className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 transition-colors"
                    >
                        {getCategoryLabel(post.category)}
                    </Link>
                    <time
                        dateTime={post.date}
                        className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                    >
                        {formatPostDate(post.date)}
                    </time>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
                    {post.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-6 text-xs font-mono text-muted-foreground">
                    <span>By <span className="text-foreground font-bold">{post.author}</span></span>
                    {post.tags.length > 0 && (
                        <>
                            <span>·</span>
                            <div className="flex flex-wrap gap-1.5">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-none border border-border/40"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Post body */}
            <div className="max-w-none">
                <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            {/* Pagination */}
            <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                {prevPost ? (
                    <Link
                        href={prevPost.href}
                        className="w-full sm:w-auto px-4 py-3 rounded-none bg-muted/30 hover:bg-muted/60 border border-border/60 hover:border-primary/40 transition-all flex items-center gap-3 group text-left cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary group-hover:-translate-x-0.5 transition-transform">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <div>
                            <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Newer</span>
                            <span className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">{prevPost.title}</span>
                        </div>
                    </Link>
                ) : <div />}

                {nextPost ? (
                    <Link
                        href={nextPost.href}
                        className="w-full sm:w-auto px-4 py-3 rounded-none bg-muted/30 hover:bg-muted/60 border border-border/60 hover:border-primary/40 transition-all flex items-center gap-3 group text-right justify-end ml-auto cursor-pointer"
                    >
                        <div>
                            <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Older</span>
                            <span className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">{nextPost.title}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                ) : <div />}
            </div>
        </article>
    );
}
