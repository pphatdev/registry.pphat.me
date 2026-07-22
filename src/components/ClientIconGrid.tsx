"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CopyDrawer from "./CopyDrawer";

const IconCard = React.memo(function IconCard({ icon, size, strokeWidth, color, onCopy }: { icon: any, size: number, strokeWidth: number, color: string, onCopy: (icon: any) => void }) {
    const [svg, setSvg] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (icon.svgContent) {
            setSvg(icon.svgContent);
            setLoading(false);
            return;
        }

        if (icon.target) {
            fetch(`https://raw.githubusercontent.com/pphatdev/icons/main/${icon.target}`)
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(data => {
                    setSvg(data.files[0]?.content || "");
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [icon]);

    // Apply customizations directly to the raw SVG string for rendering
    const getCustomizedSvg = () => {
        if (!svg) return "";
        let customized = svg;
        if (customized.includes('width="')) {
            customized = customized.replace(/width="[^"]+"/, `width="${size}"`);
        } else {
            customized = customized.replace('<svg ', `<svg width="${size}" `);
        }
        if (customized.includes('height="')) {
            customized = customized.replace(/height="[^"]+"/, `height="${size}"`);
        } else {
            customized = customized.replace('<svg ', `<svg height="${size}" `);
        }
        if (customized.includes('stroke-width="')) {
            customized = customized.replace(/stroke-width="[^"]+"/, `stroke-width="${strokeWidth}"`);
        }
        return customized;
    };

    return (
        <div
            onClick={() => onCopy(icon)}
            className="group relative flex flex-col items-center justify-between p-4 gap-3 rounded-2xl bg-background/80 dark:bg-[#0d1117]/90 border border-border/60 hover:border-primary/60 shadow-xs hover:shadow-[0_12px_35px_rgba(var(--primary),0.2)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden backdrop-blur-xl"
        >
            {/* Ambient Radial Backlight Glow on Hover */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Top Badge Row */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono z-10">
                <span className="px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/40 font-semibold uppercase tracking-wider group-hover:border-primary/30 group-hover:text-primary transition-colors">
                    {icon.category || 'Vector'}
                </span>
                <span className="text-muted-foreground/60 group-hover:text-muted-foreground text-[9px] font-mono transition-colors">
                    {size}px
                </span>
            </div>

            {/* Icon CAD/Artboard Canvas Stage */}
            <div className="w-full min-h-[96px] rounded-xl bg-muted/20 dark:bg-zinc-950/70 border border-border/40 group-hover:border-primary/40 flex items-center justify-center relative transition-all duration-300 p-3 z-10 group-hover:bg-primary/5">
                <div
                    className="text-foreground/80 group-hover:text-primary transition-all duration-300 group-hover:scale-110 transform flex items-center justify-center"
                    style={{ color: color }}
                >
                    {loading ? (
                        <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: getCustomizedSvg() }} />
                    )}
                </div>
            </div>

            {/* Icon Label & Action Button Row */}
            <div className="w-full flex items-center justify-between gap-2 pt-0.5 z-10">
                <span className="text-xs font-mono font-bold text-foreground/90 group-hover:text-primary transition-colors truncate max-w-[110px]" title={icon.name}>
                    {icon.name}
                </span>

                {/* Get Code Quick Action Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCopy(icon);
                    }}
                    className="px-2 py-1 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground border border-primary/20 text-[10px] font-mono font-bold transition-all shrink-0 active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
                    title="Get Icon Code"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <span>Get</span>
                </button>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.icon.name === nextProps.icon.name &&
        prevProps.size === nextProps.size &&
        prevProps.strokeWidth === nextProps.strokeWidth &&
        prevProps.color === nextProps.color
    );
});

export default function ClientIconGrid({ icons }: { icons: any[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("q") || "";
    const initialFilter = searchParams.get("filter") || "All";
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [filter, setFilter] = useState(initialFilter);
    const [visibleCount, setVisibleCount] = useState(24);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Global Customization States
    const initialSize = searchParams.get("size") ? parseInt(searchParams.get("size") as string) : 48;
    const initialStroke = searchParams.get("stroke") ? parseFloat(searchParams.get("stroke") as string) : 2;
    const initialColor = searchParams.get("color") || "#037d5a"; // primary color
    
    const [globalSize, setGlobalSize] = useState(initialSize);
    const [globalStrokeWidth, setGlobalStrokeWidth] = useState(initialStroke);
    const [globalColor, setGlobalColor] = useState(initialColor);

    // Hash sync observer
    const sectionRef = useRef<HTMLElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (typeof window === "undefined") return;
                const currentUrl = new URL(window.location.href);
                if (entries[0].isIntersecting) {
                    if (currentUrl.hash !== "#explore") {
                        currentUrl.hash = "explore";
                        window.history.replaceState(null, "", currentUrl.toString());
                    }
                } else {
                    if (currentUrl.hash === "#explore") {
                        currentUrl.hash = "";
                        window.history.replaceState(null, "", currentUrl.toString());
                    }
                }
            },
            { threshold: 0.1, rootMargin: "-100px 0px -100px 0px" }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    // Sync state changes to URL with debounce to prevent excessive rendering
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (globalSize !== 48) params.set("size", globalSize.toString());
            else params.delete("size");

            if (globalStrokeWidth !== 2) params.set("stroke", globalStrokeWidth.toString());
            else params.delete("stroke");

            if (globalColor !== "#037d5a") params.set("color", globalColor);
            else params.delete("color");

            if (searchQuery) params.set("q", searchQuery);
            else params.delete("q");

            if (filter !== "All") params.set("filter", filter);
            else params.delete("filter");

            const hash = typeof window !== "undefined" ? window.location.hash : "";
            router.replace(`${pathname}?${params.toString()}${hash}`, { scroll: false });
        }, 400); // 400ms debounce
        
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalSize, globalStrokeWidth, globalColor, searchQuery, filter]);

    // Drawer State
    const [selectedIconForCopy, setSelectedIconForCopy] = useState<any | null>(null);

    const filteredIcons = icons.filter((icon) => {
        const matchesSearch = icon.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "All" || icon.category === filter;
        return matchesSearch && matchesFilter;
    });

    const displayedIcons = filteredIcons.slice(0, visibleCount);

    // Reset visible count when search or filter changes
    useEffect(() => {
        setVisibleCount(24);
    }, [searchQuery, filter]);

    // Infinite scroll observer
    useEffect(() => {
        if (visibleCount >= filteredIcons.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 24, filteredIcons.length));
                }
            },
            { rootMargin: "400px" }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [visibleCount, filteredIcons.length]);

    // Scroll To Top state
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleIconClick = (icon: any) => {
        setSelectedIconForCopy(icon);
    };

    return (
        <>
            <CopyDrawer 
                isOpen={!!selectedIconForCopy}
                onClose={() => setSelectedIconForCopy(null)}
                icon={selectedIconForCopy}
                size={globalSize}
                strokeWidth={globalStrokeWidth}
                color={globalColor}
            />


            <section id="explore" className="py-20 relative" ref={sectionRef}>
                <div className="container mx-auto max-w-6xl px-4">

                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary shadow-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="7" height="7" x="3" y="3" rx="1" />
                                    <rect width="7" height="7" x="14" y="3" rx="1" />
                                    <rect width="7" height="7" x="14" y="14" rx="1" />
                                    <rect width="7" height="7" x="3" y="14" rx="1" />
                                </svg>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Explore Icons</h2>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                                        {filteredIcons.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                                    Browse and export production-ready vector icons
                                </p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-72">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search icons by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-xs font-mono rounded-2xl bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-xs"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Left Sidebar: Global Customization Controller */}
                        <div className="w-full lg:w-72 shrink-0">
                            <div className="sticky top-24 space-y-5">
                                {/* Filter Card */}
                                <div className="rounded-2xl bg-background/80 dark:bg-[#0d1117]/80 border border-border/60 space-y-3.5 dark:shadow-xl backdrop-blur-xl">
                                    <div className="flex px-5 pt-2.5 items-center gap-2 pb-2 border-b border-border/30">
                                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">Category Filter</h3>
                                    </div>

                                    <div className="flex px-5 pb-3 flex-wrap lg:flex-col gap-1.5">
                                        {[
                                            { id: "All", label: "All Icons", count: icons.length },
                                            { id: "Brands", label: "Brands", count: icons.filter(i => i.category === 'Brands').length },
                                            { id: "Regular", label: "Regular", count: icons.filter(i => i.category === 'Regular').length }
                                        ].map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => setFilter(f.id)}
                                                className={`w-full px-3 py-2 text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                                                    filter === f.id
                                                        ? "bg-primary/10 text-primary border border-primary/30 font-bold shadow-xs"
                                                        : "bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent"
                                                }`}
                                            >
                                                <span>{f.label}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === f.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                    {f.count}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Customize Card */}
                                <div className="rounded-2xl bg-background/80 dark:bg-[#0d1117]/80 border border-border/60  gap-3 grid dark:shadow-xl backdrop-blur-xl">
                                    <div className="flex items-center justify-between border-b border-border/30">
                                        <div className="flex px-4 py-2.5 items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="4" x2="20" y1="21" y2="21" />
                                                    <line x1="4" x2="20" y1="14" y2="14" />
                                                    <line x1="4" x2="20" y1="7" y2="7" />
                                                    <circle cx="8" cy="14" r="2" />
                                                    <circle cx="16" cy="7" r="2" />
                                                    <circle cx="12" cy="21" r="2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">Icon Customizer</h3>
                                        </div>
                                    </div>

                                    {/* Size Control */}
                                    <div className="space-y-2.5 px-4">
                                        <div className="flex justify-between items-center text-xs font-mono">
                                            <label className="text-muted-foreground font-bold">Size</label>
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">{globalSize}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="16"
                                            max="96"
                                            step="4"
                                            value={globalSize}
                                            onChange={(e) => setGlobalSize(Number(e.target.value))}
                                            className="w-full accent-primary cursor-pointer h-1.5 rounded-lg bg-muted"
                                        />
                                        {/* Size Presets */}
                                        <div className="flex items-center gap-1 pt-1 overflow-x-auto scrollbar-none">
                                            {[24, 32, 48, 64].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setGlobalSize(s)}
                                                    className={`px-2 py-0.5 text-[10px] font-mono rounded-lg transition-all ${
                                                        globalSize === s
                                                            ? "bg-primary text-primary-foreground font-bold"
                                                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                                    }`}
                                                >
                                                    {s}px
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stroke Width Control */}
                                    {filter !== "Brands" && (
                                        <div className="space-y-2.5 px-4">
                                            <div className="flex justify-between items-center text-xs font-mono">
                                                <label className="text-muted-foreground font-bold">Stroke</label>
                                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">{globalStrokeWidth}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="3"
                                                step="0.25"
                                                value={globalStrokeWidth}
                                                onChange={(e) => setGlobalStrokeWidth(Number(e.target.value))}
                                                className="w-full accent-primary cursor-pointer h-1.5 rounded-lg bg-muted"
                                            />
                                            {/* Stroke Presets */}
                                            <div className="flex items-center gap-1 pt-1">
                                                {[1, 1.5, 2, 2.5, 3].map((sw) => (
                                                    <button
                                                        key={sw}
                                                        onClick={() => setGlobalStrokeWidth(sw)}
                                                        className={`px-2 py-0.5 text-[10px] font-mono rounded-lg transition-all ${
                                                            globalStrokeWidth === sw
                                                                ? "bg-primary text-primary-foreground font-bold"
                                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                                        }`}
                                                    >
                                                        {sw}px
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Control */}
                                    <div className="space-y-2.5 px-4 pb-5">
                                        <div className="flex justify-between items-center text-xs font-mono">
                                            <label className="text-muted-foreground font-bold">Color Theme</label>
                                            <button
                                                onClick={() => setGlobalColor("#037d5a")}
                                                className="text-[9px] text-muted-foreground hover:text-primary transition-colors underline"
                                            >
                                                Reset Color
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-border shrink-0 shadow-xs cursor-pointer hover:scale-105 transition-transform">
                                                <input
                                                    type="color"
                                                    value={globalColor}
                                                    onChange={(e) => setGlobalColor(e.target.value)}
                                                    className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={globalColor}
                                                onChange={(e) => setGlobalColor(e.target.value)}
                                                className="flex-1 px-3 py-1.5 text-xs bg-background border border-border/80 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none uppercase font-mono text-foreground font-bold"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {["#037d5a", "#38bdf8", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ffffff", "#000000"].map((preset) => (
                                                <button
                                                    key={preset}
                                                    onClick={() => setGlobalColor(preset)}
                                                    className={`w-6 h-6 rounded-lg border transition-all cursor-pointer shadow-xs ${
                                                        globalColor.toLowerCase() === preset.toLowerCase()
                                                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 border-primary"
                                                            : "border-border/60 hover:scale-105 opacity-85 hover:opacity-100"
                                                    }`}
                                                    style={{ backgroundColor: preset }}
                                                    title={preset}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content: Search, Filters, and Grid */}
                        <div className="flex-1 min-w-0">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                                {displayedIcons.map((icon, index) => (
                                    <IconCard
                                        key={`${icon.name}-${index}`}
                                        icon={icon}
                                        size={globalSize}
                                        strokeWidth={globalStrokeWidth}
                                        color={globalColor}
                                        onCopy={handleIconClick}
                                    />
                                ))}
                            </div>

                            {/* Empty Search / Filter State */}
                            {filteredIcons.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-3xl bg-background/50 border border-border/40 text-center gap-3">
                                    <div className="p-3 bg-muted/50 rounded-2xl border border-border/40 text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.3-4.3" />
                                        </svg>
                                    </div>
                                    <h4 className="text-sm font-mono font-bold text-foreground">No matching icons found</h4>
                                    <p className="text-xs text-muted-foreground max-w-xs">
                                        {searchQuery ? `No vector assets found for "${searchQuery}". Try searching for something else.` : "Loading icon library..."}
                                    </p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-bold hover:bg-primary/90 transition-all shadow-xs cursor-pointer mt-1"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Infinite Scroll Loader & Fallback Trigger */}
                            {filteredIcons.length > visibleCount && (
                                <div ref={loadMoreRef} className="mt-8 flex justify-center py-6">
                                    <button
                                        onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredIcons.length))}
                                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-muted/40 hover:bg-muted/80 text-foreground/80 hover:text-foreground border border-border/60 hover:border-primary/40 transition-all text-xs font-mono font-bold cursor-pointer shadow-xs active:scale-95 group"
                                        title="Click to load more icons manually"
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                                        <span>Load More Icons ({displayedIcons.length} of {filteredIcons.length})</span>
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* Floating Scroll To Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-primary text-primary-foreground border border-primary/30 shadow-[0_0_25px_rgba(var(--primary),0.35)] transition-all duration-300 cursor-pointer flex items-center justify-center backdrop-blur-xl active:scale-95 group ${
                    showScrollTop
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-6 pointer-events-none"
                }`}
                title="Scroll to Top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform">
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                </svg>
            </button>
        </>
    );
}
