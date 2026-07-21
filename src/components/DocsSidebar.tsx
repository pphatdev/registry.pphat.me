"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CommandPalette from "./CommandPalette";

interface NavLink {
    href: string;
    label: string;
}

const NAV_LINKS: NavLink[] = [
    { href: "/docs", label: "Introduction" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/docs/configuration", label: "Configuration" },
];

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-28">
                <div className="mb-8">
                    <CommandPalette />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-4">Getting Started</h4>
                <nav className="flex flex-col border-l border-border/50">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                aria-current={isActive ? "page" : undefined}
                                className={`-ml-px pl-4 py-2 text-sm transition-colors border-l ${
                                    isActive 
                                        ? "text-primary font-semibold border-primary" 
                                        : "text-muted-foreground hover:text-foreground border-transparent hover:border-border"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
