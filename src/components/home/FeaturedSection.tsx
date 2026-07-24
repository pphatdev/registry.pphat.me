"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FramedContainer } from "./FramedContainer";

interface FeaturedSectionProps {
    copyToClipboard: (text: string, id: string) => void;
    copiedCommand: string | null;
}

const ICONS_REGISTRY = "https://raw.githubusercontent.com/pphatdev/icons/main";
const COMPONENTS_REGISTRY = "https://raw.githubusercontent.com/pphatdev/components/main";

type IndexEntry = { target?: string };

async function fetchRegistryTotal(baseUrl: string, signal: AbortSignal): Promise<number> {
    const idxRes = await fetch(`${baseUrl}/index.json`, { signal, cache: 'force-cache' });
    if (!idxRes.ok) throw new Error(`index ${idxRes.status}`);
    const index: IndexEntry[] = await idxRes.json();

    const categoryFiles = index.filter(e => e.target?.endsWith('.json') && !e.target.includes('/'));
    const directItems = index.filter(e => e.target?.includes('/'));

    const catCounts = await Promise.all(
        categoryFiles.map(async cat => {
            const res = await fetch(`${baseUrl}/${cat.target}`, { signal, cache: 'force-cache' });
            if (!res.ok) return 0;
            const list: unknown = await res.json();
            return Array.isArray(list) ? list.length : 0;
        })
    );

    return catCounts.reduce((a, b) => a + b, 0) + directItems.length;
}

type FeatureCard = {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
    ring: string;
    glow: string;
    href?: string;
    linkLabel?: string;
    stat?: string;
    /** Tailwind col-span class, e.g. 'lg:col-span-2' */
    colSpan?: string;
    /** Tailwind row-span class, e.g. 'lg:row-span-2' */
    rowSpan?: string;
};

const features: FeatureCard[] = [
    {
        id: 'icons',
        colSpan: 'lg:col-span-2',
        eyebrow: '01 · Icons Library',
        title: 'Brand & tech icons, ready to ship',
        description: 'A growing registry of brand and technology SVG icons — React, Vue, GitHub, Ansible and more — fetched on demand via the CLI. No icon font, no sprite, no bloat.',
        accent: 'text-primary',
        ring: 'ring-primary/25',
        glow: 'from-primary/25 to-transparent',
        href: '/icons',
        linkLabel: 'Browse Icon Studio',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
            </svg>
        ),
    },
    {
        id: 'components',
        rowSpan: 'lg:row-span-3',
        eyebrow: '02 · Components Library',
        title: 'Drop-in components',
        description: 'Buttons, cards, dialogs, inputs and more — copy-paste TSX primitives that inherit your theme tokens automatically. Being crafted with care.',
        stat: 'Soon',
        accent: 'text-emerald-500 dark:text-emerald-400',
        ring: 'ring-emerald-400/25',
        glow: 'from-emerald-400/25 to-transparent',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
        ),
    },
    {
        id: 'fast',
        eyebrow: '03 · Performance',
        title: 'One command, instant asset',
        description: 'Run `pphat add-icon <name>` and the SVG lands directly in your project. No download page, no manual copy-paste, no waiting.',
        stat: '<1s',
        accent: 'text-amber-500 dark:text-amber-400',
        ring: 'ring-amber-400/25',
        glow: 'from-amber-400/25 to-transparent',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        id: 'framework',
        eyebrow: '04 · Portable',
        title: 'Three output formats',
        description: 'Pass `-f svg`, `-f nextjs`, or `-f nuxtjs` to get the exact format your stack needs. Switch frameworks without touching your icon set.',
        stat: '3×',
        accent: 'text-sky-500 dark:text-sky-400',
        ring: 'ring-sky-400/25',
        glow: 'from-sky-400/25 to-transparent',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
            </svg>
        ),
    },
    {
        id: 'tree',
        eyebrow: '05 · Bundle',
        title: 'Zero runtime overhead',
        description: 'Icons are fetched as plain files and placed in your repo. Only what you import reaches your bundle — no registry loaded at runtime.',
        stat: '0kb',
        accent: 'text-teal-500 dark:text-teal-400',
        ring: 'ring-teal-400/25',
        glow: 'from-teal-400/25 to-transparent',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
                <path d="m7 6 5-4 5 4" />
            </svg>
        ),
    },
    {
        id: 'types',
        eyebrow: '06 · DX',
        title: 'Config once, reuse everywhere',
        description: 'Run `pphat init` once to create a pphatdev.json at your project root. Your preferred format and output paths are saved — no flags needed on subsequent runs.',
        stat: 'TS',
        accent: 'text-fuchsia-500 dark:text-fuchsia-400',
        ring: 'ring-fuchsia-400/25',
        glow: 'from-fuchsia-400/25 to-transparent',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </svg>
        ),
    },
];

export function FeaturedSection({ copyToClipboard, copiedCommand }: FeaturedSectionProps) {
    const cliCmd = "pphat add-icon <name>";

    const [counts, setCounts] = useState<{ icons?: number; components?: number }>({});

    useEffect(() => {
        const ctrl = new AbortController();
        Promise.allSettled([
            fetchRegistryTotal(ICONS_REGISTRY, ctrl.signal),
            fetchRegistryTotal(COMPONENTS_REGISTRY, ctrl.signal),
        ]).then(([iconsRes, componentsRes]) => {
            if (ctrl.signal.aborted) return;
            setCounts({
                icons: iconsRes.status === 'fulfilled' ? iconsRes.value : undefined,
                components: componentsRes.status === 'fulfilled' ? componentsRes.value : undefined,
            });
        });
        return () => ctrl.abort();
    }, []);

    const dynamicStat: Record<string, { value?: number; loaded: boolean }> = {
        icons: { value: counts.icons, loaded: counts.icons !== undefined },
        components: { value: counts.components, loaded: counts.components !== undefined },
    };

    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-muted/25 dark:bg-muted/15">
            {/* Radial dot texture — "showcase surface" */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(hsl(var(--border))_1.2px,transparent_1.2px)] bg-size-[24px_24px] opacity-70"
            />
            {/* Top / bottom fade so the pattern melts into neighboring sections */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-24 pointer-events-none -z-10 bg-linear-to-b from-background to-transparent" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 pointer-events-none -z-10 bg-linear-to-t from-background to-transparent" />
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/10 rounded-none blur-[120px] opacity-40" />
            </div>

            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <FramedContainer>
                <div className="flex flex-col gap-12">

                    {/* SECTION HEADER (centered, best-practice pattern) */}
                    <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs text-primary font-bold font-mono bg-primary/10 rounded-none border border-primary/20 shadow-xs backdrop-blur-md">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-none h-1.5 w-1.5 bg-primary" />
                            </span>
                            What&apos;s inside
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground">
                            Everything you need to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-teal-300">ship faster</span>
                        </h2>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl opacity-90">
                            A focused toolkit for teams who want a design system without the overhead — icons, components, and a CLI that gets out of your way.
                        </p>
                    </div>

                    {/* FEATURE CARDS BENTO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map(f => {
                            const cardBody = (
                                <>
                                    {/* hover glow */}
                                    <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-none bg-linear-to-br ${f.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* accent bar (top) */}
                                    <div className={`absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-current to-transparent ${f.accent} opacity-0 group-hover:opacity-60 transition-opacity`} />

                                    <div className="relative flex flex-col gap-4 h-full">
                                        {/* Top row: icon + stat */}
                                        <div className="flex items-start justify-between">
                                            <div className={`shrink-0 p-2.5 rounded-nonebg-background/60 border border-border/40 ring-1 ${f.ring} ${f.accent} transition-transform duration-300 group-hover:scale-105`}>
                                                {f.icon}
                                            </div>
                                            {(() => {
                                                const dyn = dynamicStat[f.id];
                                                if (dyn) {
                                                    if (!dyn.loaded) {
                                                        return (
                                                            <span
                                                                aria-label={`Loading ${f.id} count`}
                                                                className="text-[10px] font-mono font-bold bg-background/60 border border-border/40 rounded-none px-2 py-0.5 min-w-10 h-4 animate-pulse"
                                                            />
                                                        );
                                                    }
                                                    if (dyn.value && dyn.value > 0) {
                                                        return (
                                                            <span className={`text-[10px] font-mono font-bold ${f.accent} bg-background/60 border border-border/40 rounded-none px-2 py-0.5`}>
                                                                {dyn.value}
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }
                                                if (f.stat) {
                                                    return (
                                                        <span className={`text-[10px] font-mono font-bold ${f.accent} bg-background/60 border border-border/40 rounded-none px-2 py-0.5`}>
                                                            {f.stat}
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        {/* Eyebrow */}
                                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                                            {f.eyebrow}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-foreground leading-snug -mt-3">
                                            {f.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground leading-relaxed -mt-1">
                                            {f.description}
                                        </p>

                                        {/* Footer link (pushes to bottom) */}
                                        {f.href && (
                                            <div className="mt-auto pt-2">
                                                <span className={`inline-flex items-center gap-1 text-xs font-mono font-bold ${f.accent} group-hover:gap-2 transition-all`}>
                                                    {f.linkLabel}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 12h14" />
                                                        <path d="m12 5 7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            );

                            const spanCls = [f.colSpan, f.rowSpan].filter(Boolean).join(' ');
                            const className = `group relative p-6 rounded-none glass-panel border-border/40 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col${spanCls ? ` ${spanCls}` : ''}`;

                            return f.href ? (
                                <Link key={f.id} href={f.href} className={className}>
                                    {cardBody}
                                </Link>
                            ) : (
                                <div key={f.id} className={className}>
                                    {f.id === 'components' && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-none bg-background/60 backdrop-blur-sm pointer-events-none">
                                            <span className="text-[10px] font-mono font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded-none px-3 py-1 uppercase tracking-widest">
                                                Coming Soon
                                            </span>
                                            <p className="text-xs text-muted-foreground text-center max-w-[12rem]">
                                                Components are being crafted with care.
                                            </p>
                                        </div>
                                    )}
                                    {cardBody}
                                </div>
                            );
                        })}
                    </div>

                    {/* CLOSING CTA ROW */}
                    <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-none glass-panel border-border/40">
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Try it now</span>
                            <p className="text-sm font-medium text-foreground">Add your first icon in one command.</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                            <div className="flex items-center gap-3 bg-background/60 backdrop-blur-xl border border-border/60 py-2 pl-4 pr-2 rounded-none flex-1 sm:flex-initial min-w-0">
                                <span className="text-primary font-mono select-none font-bold text-xs shrink-0">$</span>
                                <code className="text-primary text-xs font-mono font-bold select-all truncate">{cliCmd}</code>
                                <button
                                    onClick={() => copyToClipboard(cliCmd, 'featured-cta')}
                                    title="Copy command"
                                    className="p-1.5 flex items-center justify-center bg-muted/50 hover:bg-muted rounded-none transition-all border border-border/40 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer active:scale-95"
                                >
                                    {copiedCommand === 'featured-cta' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <Link
                                href="/docs"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-primary text-primary-foreground text-xs font-mono font-bold hover:bg-primary/90 transition-colors shrink-0 shadow-xs"
                            >
                                Read docs
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                </div>
                </FramedContainer>
            </div>
        </section>
    );
}
