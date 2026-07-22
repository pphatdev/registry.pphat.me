"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CommandPalette from "./CommandPalette";
import { DOCS_CONFIG } from "@/config/docs";

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
                <CommandPalette />

                {DOCS_CONFIG.map((group) => (
                    <div key={group.title} className="rounded-2xl bg-background/80 dark:bg-[#0d1117]/80 border border-border/60 space-y-3.5 dark:shadow-xl backdrop-blur-xl">
                        <div className="flex px-5 pt-2.5 items-center gap-2 pb-2 border-b border-border/30">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                {group.icon}
                            </div>
                            <h4 className="text-[11px] font-mono font-bold text-foreground uppercase tracking-wider">{group.title}</h4>
                        </div>

                        <nav className="flex px-5 pb-3 flex-col gap-1.5">
                            {group.items.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link 
                                        key={link.href} 
                                        href={link.href} 
                                        aria-current={isActive ? "page" : undefined}
                                        className={`w-full px-3 py-2 text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                                            isActive 
                                                ? "bg-primary/10 text-primary border border-primary/30 font-bold shadow-xs" 
                                                : "bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className={isActive ? "text-primary" : "text-muted-foreground/70"}>
                                                {link.icon}
                                            </span>
                                            <span>{link.title}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>
        </aside>
    );
}
