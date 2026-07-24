import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import CopyCode from "@/components/CopyCode";

import { FLAT_DOCS } from "@/config/docs";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return FLAT_DOCS.map((doc) => ({
        slug: doc.slug === "index" ? [] : doc.slug.split("/"),
    }));
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug ? resolvedParams.slug.join("/") : "index";
    const docItem = FLAT_DOCS.find((item) => item.slug === slug);
    
    if (!docItem) {
        return {
            title: "Not Found | @pphatdev/registry",
        };
    }
    
    return {
        title: `${docItem.title} Docs`,
        description: `Explore documentation for ${docItem.title} on the @pphatdev/registry.`,
        openGraph: {
            title: `${docItem.title} Docs | @pphatdev/registry`,
            description: `Explore documentation for ${docItem.title} on the @pphatdev/registry.`,
            type: "article",
            images: [
                {
                    url: "/docs.png",
                    width: 1200,
                    height: 630,
                    alt: "Documentation Preview",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${docItem.title} Docs | @pphatdev/registry`,
            description: `Explore documentation for ${docItem.title} on the @pphatdev/registry.`,
            images: ["/docs.png"],
        },
    };
}
import React from "react";

const components = {
    CopyCode,
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-foreground" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2 className="scroll-m-20 border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0 mt-10 mb-4 text-foreground" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4 text-foreground" {...props} />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="leading-7 not-first:mt-6 text-muted-foreground font-sans" {...props} />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" {...props} />
    ),
    blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
        <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground font-sans" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground font-sans" {...props} />
    ),
    li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li className="pl-1" {...props} />,
    code: (props: React.HTMLAttributes<HTMLElement>) => {
        if (props.className?.includes('language-')) {
            return <code className={props.className} {...props} />;
        }
        return <code className="relative rounded bg-muted/60 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground border border-border/40" {...props} />;
    },
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
        <div className="relative mt-6 mb-6 rounded-xl overflow-hidden bg-[#09090b] border border-border/40 shadow-sm font-mono">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-[#18181b] text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-zinc-50 font-mono leading-relaxed select-text scrollbar-none" {...props} />
        </div>
    ),
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-8 border-border/40" {...props} />,
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className="w-full text-sm font-sans" {...props} />
        </div>
    ),
    tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="m-0 border-t border-border/40 p-0 even:bg-muted/20" {...props} />,
    th: (props: React.HTMLAttributes<HTMLTableCellElement>) => <th className="border border-border/40 px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right text-foreground" {...props} />,
    td: (props: React.HTMLAttributes<HTMLTableCellElement>) => <td className="border border-border/40 px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right text-muted-foreground" {...props} />,
};

export default async function DocsPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug ? resolvedParams.slug.join("/") : "index";

    const contentPath = path.join(process.cwd(), "content", "docs", `${slug}.mdx`);

    if (!fs.existsSync(contentPath)) {
        notFound();
    }

    const source = fs.readFileSync(contentPath, "utf8");
    const dateModified = fs.statSync(contentPath).mtime.toISOString();

    // Pagination links logic
    const currentIndex = FLAT_DOCS.findIndex((item) => item.slug === slug);
    const prevDoc = currentIndex > 0 ? FLAT_DOCS[currentIndex - 1] : null;
    const nextDoc = currentIndex < FLAT_DOCS.length - 1 ? FLAT_DOCS[currentIndex + 1] : null;
    const currentDoc = FLAT_DOCS[currentIndex];
    const canonicalUrl = `https://registry.pphat.me${currentDoc?.href ?? "/docs"}`;

    const techArticleJsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: `${currentDoc?.title ?? "Introduction"} — @pphatdev/registry Docs`,
        description: `Documentation for ${currentDoc?.title ?? "@pphatdev/registry"}.`,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        inLanguage: "en",
        datePublished: "2026-07-18",
        dateModified,
        author: {
            "@type": "Person",
            name: "Sophat LEAT (PPhat)",
            url: "https://pphat.me",
        },
        publisher: {
            "@type": "Person",
            name: "Sophat LEAT (PPhat)",
            url: "https://pphat.me",
        },
        image: "https://registry.pphat.me/docs.png",
        isPartOf: { "@id": "https://registry.pphat.me/#website" },
        about: { "@id": "https://registry.pphat.me/#app" },
    };

    return (
        <div className="animate-[fade-up_0.5s_forwards] max-w-3xl pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(techArticleJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            {/* Top Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
                <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
                <span>/</span>
                <span className="text-foreground font-bold capitalize">{slug === "index" ? "Introduction" : slug}</span>
            </div>

            {/* Content Viewport */}
            <div className="max-w-none">
                <MDXRemote source={source} components={components} />
            </div>

            {/* Bottom Pagination Links */}
            <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                {prevDoc ? (
                    <Link
                        href={prevDoc.href}
                        className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 hover:border-primary/40 transition-all flex items-center gap-3 group text-left cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary group-hover:-translate-x-0.5 transition-transform">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <div>
                            <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Previous</span>
                            <span className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">{prevDoc.title}</span>
                        </div>
                    </Link>
                ) : <div />}

                {nextDoc ? (
                    <Link
                        href={nextDoc.href}
                        className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 hover:border-primary/40 transition-all flex items-center gap-3 group text-right justify-end ml-auto cursor-pointer"
                    >
                        <div>
                            <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Next</span>
                            <span className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">{nextDoc.title}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                ) : <div />}
            </div>
        </div>
    );
}
