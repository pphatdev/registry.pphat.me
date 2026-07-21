"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
    const pathname = usePathname();

    const links = [
        { label: "Icons", href: "/", exact: true },
        { label: "Components", href: "/components", exact: false },
        { label: "Documentation", href: "/docs", exact: false },
    ];

    return (
        <header className="sticky top-4 z-50 w-[calc(100%-2rem)] max-w-6xl mx-auto glass-panel border border-border/50 backdrop-blur-lg rounded-full h-16 flex items-center justify-between px-4 sm:px-6 shadow-xl shadow-black/5 mt-4">
            <div className="flex items-center gap-2">
                <Link href="/" className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
                    Registry
                </Link>
                <span className="px-2 py-0.5 ml-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider border border-primary/20 uppercase shadow-sm">
                    v1.0.0
                </span>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-sm font-medium text-foreground/60 transition duration-200">
                {links.map((link) => {
                    const isActive = link.exact 
                        ? pathname === link.href 
                        : pathname?.startsWith(link.href);

                    return (
                        <Link 
                            key={link.label}
                            href={link.href} 
                            className={`relative px-4 py-1.5 rounded-full transition-colors duration-200 ${
                                isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                            }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 h-full w-full rounded-full bg-foreground/10 ring-1 ring-foreground/20"></div>
                            )}
                            <span className="relative z-20">{link.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <a href="https://github.com/pphatdev/registry" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5.6 3.35 6.6 6.5 7a4.8 4.8 0 0 0-1 3.03V22" /><path d="M9 20c-5 1.5-5-2.5-7-3" /></svg>
                </a>
            </div>
        </header>
    );
}
