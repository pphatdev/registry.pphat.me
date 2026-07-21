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
            className="group relative flex flex-col items-center justify-center p-6 gap-4 rounded-3xl glass-panel hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
            <div
                className="text-foreground/70 group-hover:text-primary transition-colors duration-300 group-hover:scale-110 transform flex items-center justify-center min-h-[64px]"
                style={{ color: color }}
            >
                {loading ? (
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: getCustomizedSvg() }} />
                )}
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center capitalize mt-2">
                {icon.name}
            </span>

            {/* Copy tooltip on hover */}
            <div className="absolute opacity-0 group-hover:opacity-100 -top-5 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded font-medium transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                Copy
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
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

    // Reset visible count when search or filter changes
    useEffect(() => {
        setVisibleCount(24);
    }, [searchQuery, filter]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => prev + 24);
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
    }, []);

    const filteredIcons = icons.filter((icon) => {
        const matchesSearch = icon.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "All" || icon.category === filter;
        return matchesSearch && matchesFilter;
    });

    const displayedIcons = filteredIcons.slice(0, visibleCount);

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

                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                        <h2 className="text-3xl font-bold">Explore Icons</h2>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative w-full sm:w-64">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search icons..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Left Sidebar: Global Customization Controller */}
                        <div className="w-full lg:w-72 shrink-0">
                            <div className="sticky top-24 space-y-6">
                                {/* Filter Card */}
                                <div className="glass-panel p-6 rounded-3xl space-y-4">
                                    <h3 className="text-xl font-bold mb-4">Filter Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["All", "Brands", "Regular"].map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${filter === f ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Customize Card */}
                                <div className="glass-panel p-6 rounded-3xl space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Customize</h3>
                                        <p className="text-xs text-muted-foreground mb-6">Apply styles to all icons</p>
                                    </div>

                                    {/* Size Control */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium text-foreground">Size</label>
                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{globalSize}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="16"
                                            max="128"
                                            step="4"
                                            value={globalSize}
                                            onChange={(e) => setGlobalSize(Number(e.target.value))}
                                            className="w-full accent-primary"
                                        />
                                    </div>

                                    {/* Stroke Width Control */}
                                    {filter !== "Brands" && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-foreground">Stroke</label>
                                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{globalStrokeWidth}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="3"
                                                step="0.25"
                                                value={globalStrokeWidth}
                                                onChange={(e) => setGlobalStrokeWidth(Number(e.target.value))}
                                                className="w-full accent-primary"
                                            />
                                        </div>
                                    )}

                                    {/* Color Control */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-foreground block">Color</label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform">
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
                                                className="flex-1 px-3 py-1.5 text-sm bg-background border border-border rounded-xl focus:ring-1 focus:ring-primary outline-none uppercase font-mono"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {["#037d5a", "#ffffff", "#000000", "#3b82f6", "#ef4444", "#10b981", "#f59e0b"].map((preset) => (
                                                <button
                                                    key={preset}
                                                    onClick={() => setGlobalColor(preset)}
                                                    className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform shadow-sm"
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
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
                                {filteredIcons.length === 0 && (
                                    <div className="col-span-full text-center py-10 text-muted-foreground">
                                        {icons.length === 0 ? "Failed to load icons or loading..." : "No icons found matching your search."}
                                    </div>
                                )}
                            </div>

                            {filteredIcons.length > visibleCount && (
                                <div ref={loadMoreRef} className="mt-8 flex justify-center py-8">
                                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
