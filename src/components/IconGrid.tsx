import React from "react";

// Fetch icons from the pphatdev/icons repository
async function fetchIcons() {
    try {
        const res = await fetch("https://raw.githubusercontent.com/pphatdev/icons/main/brands.json", {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const brands = await res.json();

        // Get first 18 icons for the demo
        const demoBrands = brands.slice(0, 18);

        const iconsWithSvg = await Promise.all(
            demoBrands.map(async (brand: any) => {
                try {
                    const iconRes = await fetch(`https://raw.githubusercontent.com/pphatdev/icons/main/${brand.target}`);
                    if (!iconRes.ok) return null;
                    const iconData = await iconRes.json();
                    return {
                        name: brand.name,
                        svgContent: iconData.files[0]?.content || ""
                    };
                } catch (e) {
                    return null;
                }
            })
        );

        return iconsWithSvg.filter(Boolean);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function IconGrid() {
    const icons = await fetchIcons();

    return (
        <section id="explore" className="py-20 relative">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold">Explore Icons</h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.1)]">All</button>
                        <button className="px-4 py-1.5 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">Brands</button>
                        <button className="px-4 py-1.5 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">Regular</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {icons.map((icon, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center justify-center p-6 gap-4 rounded-3xl glass-panel hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        >
                            <div
                                className="text-foreground/70 group-hover:text-primary transition-colors duration-300 group-hover:scale-110 transform flex items-center justify-center [&>svg]:w-8 [&>svg]:h-8"
                                dangerouslySetInnerHTML={{ __html: icon.svgContent }}
                            />
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center capitalize">
                                {icon.name}
                            </span>

                            {/* Copy tooltip on hover */}
                            <div className="absolute opacity-0 group-hover:opacity-100 -top-5 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded font-medium transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                                Copy SVG
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                            </div>
                        </div>
                    ))}
                    {icons.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            Failed to load icons or loading...
                        </div>
                    )}
                </div>

                <div className="mt-16 flex justify-center">
                    <button className="px-6 py-2.5 rounded-full border border-border bg-background hover:bg-primary/5 hover:border-primary/30 font-medium transition-all shadow-md">
                        Load More Icons
                    </button>
                </div>
            </div>
        </section>
    );
}
