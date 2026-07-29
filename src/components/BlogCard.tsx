import Link from "next/link";
import { formatPostDate, getCategoryLabel, type BlogPostMeta } from "@/lib/blog-format";

export default function BlogCard({ post }: { post: BlogPostMeta }) {
    return (
        <Link
            href={post.href}
            className="group flex flex-col p-6 rounded-none bg-background/60 dark:bg-[#0d1117]/80 border border-border/60 hover:border-primary/50 transition-all backdrop-blur-xl shadow-xs hover:shadow-md"
        >
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                <span className="px-2 py-0.5 rounded-none bg-primary/10 text-primary border border-primary/25">
                    {getCategoryLabel(post.category)}
                </span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                {post.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
            </p>

            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/40">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-none border border-border/40"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-1.5 mt-4 text-xs font-mono font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read post</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </div>
        </Link>
    );
}
