"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SEARCH_DATA = [
    {
        group: "Documentation",
        items: [
            { id: "intro", title: "Introduction", href: "/docs" },
            { id: "install", title: "Installation", href: "/docs/installation" },
            { id: "config", title: "Configuration", href: "/docs/configuration" },
        ],
    },
    {
        group: "Quick Links",
        items: [
            { id: "github", title: "GitHub Repository", href: "https://github.com/pphatdev/registry", external: true },
            { id: "home", title: "Home Page", href: "/" },
        ],
    },
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filteredData = SEARCH_DATA.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
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
        setSelectedIndex(0);
    }, [query]);

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
    }, [isOpen, flatItems, selectedIndex]);

    const handleSelect = (item: any) => {
        if (item.external) {
            window.open(item.href, "_blank");
        } else {
            router.push(item.href);
        }
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="relative flex items-center w-full pl-3 pr-2 py-1.5 text-sm bg-muted/50 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/80 transition-all text-muted-foreground group focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <span className="flex-1 text-left">Search docs...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
                    <div 
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div 
                        className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden mx-4 flex flex-col max-h-[80vh] animate-[fade-down_0.2s_ease-out_forwards]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-4 py-3 border-b border-border">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mr-3 shrink-0">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                                ref={inputRef}
                                autoFocus
                                type="text"
                                placeholder="Search documentation..."
                                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded text-muted-foreground">
                                ESC
                            </kbd>
                        </div>
                        
                        <div className="overflow-y-auto p-2 flex-1">
                            {flatItems.length === 0 ? (
                                <div className="py-14 text-center text-sm text-muted-foreground">
                                    No results found for <span className="text-foreground font-medium">"{query}"</span>.
                                </div>
                            ) : (
                                filteredData.map((group) => (
                                    <div key={group.group} className="mb-4 last:mb-0">
                                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {group.group}
                                        </div>
                                        <div className="space-y-1">
                                            {group.items.map((item) => {
                                                const globalIndex = flatItems.findIndex((i) => i.id === item.id);
                                                const isSelected = selectedIndex === globalIndex;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleSelect(item)}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center transition-all ${
                                                            isSelected
                                                                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                                                : "text-foreground hover:bg-muted"
                                                        }`}
                                                    >
                                                        {item.title}
                                                        {item.external && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-auto opacity-70 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}>
                                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
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
                        
                        <div className="border-t border-border px-4 py-3 bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded shadow-sm font-mono text-[10px]">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded shadow-sm font-mono text-[10px]">↓</kbd>
                                    <span>Navigate</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded shadow-sm font-mono text-[10px]">↵</kbd>
                                    <span>Select</span>
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-foreground/50">Registry</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
