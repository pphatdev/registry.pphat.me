import Link from "next/link";
import type { BlogCategory } from "@/lib/blog-format";

export default function CategoryFilter({
    categories,
    totalCount,
    activeCategory,
}: {
    categories: BlogCategory[];
    totalCount: number;
    activeCategory?: string;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-8">
            <Link
                href="/blog"
                aria-current={!activeCategory ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-none border transition-all ${
                    !activeCategory
                        ? "bg-primary/10 text-primary border-primary/40 shadow-xs"
                        : "bg-muted/30 text-muted-foreground border-border/60 hover:text-foreground hover:border-primary/30"
                }`}
            >
                All
                <span className="text-[10px] opacity-70">({totalCount})</span>
            </Link>
            {categories.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                    <Link
                        key={cat.slug}
                        href={`/blog/category/${cat.slug}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-none border transition-all ${
                            isActive
                                ? "bg-primary/10 text-primary border-primary/40 shadow-xs"
                                : "bg-muted/30 text-muted-foreground border-border/60 hover:text-foreground hover:border-primary/30"
                        }`}
                    >
                        {cat.label}
                        <span className="text-[10px] opacity-70">({cat.count})</span>
                    </Link>
                );
            })}
            <a
                href="/blog/rss.xml"
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-none border border-border/60 bg-muted/30 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                title="Subscribe via RSS"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                </svg>
                RSS
            </a>
        </div>
    );
}
