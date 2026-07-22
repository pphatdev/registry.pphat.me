"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { GithubIcon } from "./icons/github";

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        // { label: "Registry Hub", href: "/", exact: true },
        { label: "Icons", href: "/icons", exact: false },
        { label: "Documentation", href: "/docs", exact: false },
    ];

    return (
        <header
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[95%] max-w-6xl rounded-full h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
                scrolled
                    ? "bg-background/80 backdrop-blur-xl border border-border/80 shadow-xl shadow-black/10"
                    : "border border-transparent"
            }`}
        >
            <div className="flex items-center gap-2">
                <Link href="/" className="font-bold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
                    @pphatdev/registry
                </Link>
                <span className="px-2 py-0.5 ml-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider border border-primary/20 uppercase shadow-sm">
                    v1.1.0
                </span>
            </div>

            <div className="flex items-center gap-4">
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
                                    isActive ? "text-foreground font-semibold" : "text-foreground/80 hover:text-foreground"
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
                <ThemeToggle />
                <a
                    href="https://github.com/pphatdev/registry"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center text-foreground hover:text-primary transition-colors hover:scale-110"
                    title="GitHub"
                >
                    <GithubIcon width={24} height={24} />
                </a>
            </div>
        </header>
    );
}
