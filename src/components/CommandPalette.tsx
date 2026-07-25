"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface SearchItem {
    id: string;
    title: string;
    description?: string;
    href: string;
    external?: boolean;
    category?: string;
    icon?: React.ReactNode;
}

const SEARCH_DATA: { group: string; items: SearchItem[] }[] = [
    {
        group: "Documentation",
        items: [
            {
                id: "intro",
                title: "Introduction",
                description: "Overview of @pphatdev/registry CLI & Icon Studio",
                href: "/docs",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                )
            },
            {
                id: "install",
                title: "Installation Guide",
                description: "CLI setup with npx, npm, pnpm & bun",
                href: "/docs/installation",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" x2="20" y1="19" y2="19" />
                    </svg>
                )
            },
            {
                id: "config",
                title: "Configuration (config.json)",
                description: "Save persistent paths and framework formats",
                href: "/docs/configuration",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" x2="20" y1="21" y2="21" />
                        <line x1="4" x2="20" y1="14" y2="14" />
                        <line x1="4" x2="20" y1="7" y2="7" />
                        <circle cx="8" cy="14" r="2" />
                        <circle cx="16" cy="7" r="2" />
                        <circle cx="12" cy="21" r="2" />
                    </svg>
                )
            },
        ],
    },
    {
        group: "Icon Explorer & Studio",
        items: [
            {
                id: "explore-icons",
                title: "Explore Vector Icons",
                description: "Browse 200+ customizable vector assets",
                href: "/icons#explore",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                )
            },
            {
                id: "playground",
                title: "Interactive Studio Playground",
                description: "Test vector sizes, rotation & export Next/Nuxt TSX",
                href: "/#playground",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                    </svg>
                )
            },
            {
                id: "brands-category",
                title: "Brands Icons Category",
                description: "Popular brand logos & tech icons",
                href: "/icons?filter=Brands#explore",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                    </svg>
                )
            },
        ],
    },
    {
        group: "Quick Links",
        items: [
            {
                id: "github",
                title: "GitHub Repository",
                description: "pphatdev/registry official source code",
                href: "https://github.com/pphatdev/registry",
                external: true,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5.6 3.35 6.6 6.5 7a4.8 4.8 0 0 0-1 3.03V22" />
                    </svg>
                )
            },
            {
                id: "home",
                title: "Home Page",
                description: "Overview & CLI showcase",
                href: "/",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                )
            },
        ],
    },
];

export default function CommandPalette() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const filteredData = SEARCH_DATA.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        ),
    })).filter((group) => group.items.length > 0);

    const flatItems = filteredData.flatMap((g) => g.items);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedIndex(0);
    }, [query]);

    const handleSelect = useCallback((item: SearchItem) => {
        if (item.external) {
            window.open(item.href, "_blank");
        } else {
            router.push(item.href);
        }
        setIsOpen(false);
    }, [router]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "Escape") {
                setIsOpen(false);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % (flatItems.length || 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + flatItems.length) % (flatItems.length || 1));
            } else if (e.key === "Enter") {
                e.preventDefault();
                const item = flatItems[selectedIndex];
                if (item) handleSelect(item);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isOpen, flatItems, selectedIndex, handleSelect]);

    const modalContent = isOpen ? (
        <div className="fixed inset-0 z-9999 flex items-start justify-center pt-[15vh] sm:pt-[12vh] px-4 pointer-events-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
                onClick={() => setIsOpen(false)}
            />

            {/* Command Palette Card */}
            <div 
                className="relative w-full max-w-xl bg-background dark:bg-[#0d1117] ring-1 ring-border/80 rounded-none shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[75vh] z-10 outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input Bar */}
                <div className="flex items-center px-4 py-3.5 border-b border-border/60 bg-muted/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-3 shrink-0">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        ref={inputRef}
                        autoFocus
                        type="text"
                        placeholder="Search documentation, guides & tools..."
                        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-xs sm:text-sm font-mono focus:ring-0"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-2 py-1 text-[10px] font-mono bg-muted/60 hover:bg-muted ring-1 ring-border/60 rounded-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none"
                    >
                        ESC
                    </button>
                </div>
                
                {/* Search Results List */}
                <div className="overflow-y-auto p-2 flex-1 scrollbar-none">
                    {flatItems.length === 0 ? (
                        <div className="py-12 text-center text-xs font-mono text-muted-foreground flex flex-col items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <span>No results found for &quot;<span className="text-foreground font-bold">{query}</span>&quot;</span>
                        </div>
                    ) : (
                        filteredData.map((group) => (
                            <div key={group.group} className="mb-3 last:mb-0">
                                <div className="px-3 py-1 text-[10px] font-mono font-bold text-muted-foreground/80 uppercase tracking-wider">
                                    {group.group}
                                </div>
                                <div className="space-y-1 mt-1">
                                    {group.items.map((item) => {
                                        const globalIndex = flatItems.findIndex((i) => i.id === item.id);
                                        const isSelected = selectedIndex === globalIndex;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                className={`px-3 py-2.5 rounded-nonetext-xs font-mono cursor-pointer flex items-center gap-3 transition-colors duration-150 ease-out outline-none ${
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground font-bold shadow-xs ring-1 ring-primary/40"
                                                        : "text-foreground hover:bg-muted/50"
                                                }`}
                                            >
                                                <span className={isSelected ? "text-primary-foreground" : "text-primary"}>
                                                    {item.icon}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="truncate">{item.title}</div>
                                                    {item.description && (
                                                        <div className={`text-[10px] truncate ${isSelected ? "text-primary-foreground/80 font-normal" : "text-muted-foreground"}`}>
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                                {item.external && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}>
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {/* Footer Bar */}
                <div className="border-t border-border/60 px-4 py-2.5 bg-muted/20 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-background ring-1 ring-border/60 rounded text-foreground font-bold">↑</kbd>
                            <kbd className="px-1 py-0.5 bg-background ring-1 ring-border/60 rounded text-foreground font-bold">↓</kbd>
                            <span>Navigate</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-background ring-1 ring-border/60 rounded text-foreground font-bold">↵</kbd>
                            <span>Select</span>
                        </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 font-bold">
                        @pphatdev/registry
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            {/* Search Trigger Pill Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative flex items-center w-full px-3.5 py-2 text-xs font-mono bg-background/80 dark:bg-[#0d1117]/80 ring-1 ring-border/80 hover:ring-primary/50 rounded-nonehover:bg-muted/40 transition-all text-muted-foreground group outline-none focus:ring-2 focus:ring-primary/50 shadow-xs cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary shrink-0">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <span className="flex-1 whitespace-nowrap text-left">Search docs & features...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-muted/60 border border-border/60 rounded-none text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-colors">
                    <span className="text-[11px]">⌘</span>K
                </kbd>
            </button>

            {/* Render Modal via Portal on Body */}
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
