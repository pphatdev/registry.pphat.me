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
        { label: "Docs", href: "/docs", exact: false },
    ];

    return (
        <header
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[95%] max-w-6xl rounded-full h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${scrolled
                    ? "bg-background/80 backdrop-blur-xl border border-border/80 shadow-xl shadow-black/10"
                    : "border border-transparent"
                }`}
        >
            {/* Left: Logo & Branding */}
            <div className="flex items-center gap-2.5">
                <Link href="/" className="flex flex-col items-center justify-center group leading-none">
                    <div className="relative h-14 shrink-0 flex items-center justify-center pb-2">
                        <img
                            src="https://pphat.me/assets/logo/logo-transparent-dark-mode.png"
                            alt="pphat.me logo"
                            width={32}
                            height={32}
                            className="w-14 h-14 object-contain hidden dark:block"
                        />
                        <img
                            src="https://pphat.me/assets/logo/logo-transparent-light-mode.png"
                            alt="pphat.me logo"
                            width={32}
                            height={32}
                            className="w-14 h-14 object-contain dark:hidden"
                        />
                        <span className="font-bold z-50 py-1 absolute left-1/2 -translate-x-1/2 bottom-2 text-[9px] px-1.5 rounded-full bg-primary text-primary-foreground leading-none whitespace-nowrap">
                            Registry
                        </span>
                    </div>
                </Link>
            </div>

            {/* Right: Navigation Menu Items & Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden md:flex items-center gap-1.5">
                    {links.map((link) => {
                        const isActive = link.exact
                            ? pathname === link.href
                            : pathname?.startsWith(link.href);

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`group relative inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {isActive ? (
                                    <div className="absolute inset-0 rounded-full bg-primary/10 border border-primary/25 shadow-sm shadow-primary/10" />
                                ) : (
                                    <div className="absolute inset-0 rounded-full bg-muted/70 dark:bg-muted/50 border border-border/50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out" />
                                )}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/15 to-emerald-400/15 opacity-0 blur-xs group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                <span className="relative z-10 flex items-center justify-center gap-1.5 transition-transform duration-200 group-hover:scale-[1.02] leading-none">
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                <ThemeToggle />
                <a
                    href="https://github.com/pphatdev/registry"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                    title="GitHub"
                >
                    <GithubIcon width={16} height={16} />
                </a>
            </div>
        </header>
    );
}
