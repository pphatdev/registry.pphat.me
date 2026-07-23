import React from "react";
import { TerminalShowcase } from "@/components/TerminalShowcase";
import { renderMiniIcon } from "./VectorIcons";

interface HeroSectionProps {
    heroPkgManager: 'npm' | 'pnpm' | 'bun';
    setHeroPkgManager: (pkg: 'npm' | 'pnpm' | 'bun') => void;
    copyToClipboard: (text: string, id: string) => void;
    copiedCommand: string | null;
}

export function HeroSection({
    heroPkgManager,
    setHeroPkgManager,
    copyToClipboard,
    copiedCommand,
}: HeroSectionProps) {
    const installCmd = heroPkgManager === 'npm'
        ? "npm install -g @pphatdev/registry"
        : heroPkgManager === 'pnpm'
        ? "pnpm add -g @pphatdev/registry"
        : "bun add -g @pphatdev/registry";

    return (
        <section className="relative pt-16 sm:pt-28 pb-16 sm:pb-20 md:pb-24 overflow-hidden flex flex-col justify-center min-h-115 md:min-h-130">
            {/* Background Ambient Glows & Floating Random Vector Icons */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden select-none">
                <div className="absolute top-1/4 left-1/3 w-137.5 h-137.5 bg-primary/20 rounded-full blur-[110px] opacity-40 mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-1/2 right-1/4 w-112.5 h-112.5 bg-emerald-500/15 rounded-full blur-[90px] opacity-30 mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                
                {/* Ripple effect rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-primary/20 animate-ripple"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full border border-primary/10 animate-ripple" style={{ animationDelay: "1s" }}></div>

                <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

                {/* Floating Random Vector Background Icons */}
                <div className="absolute top-6 left-[7%] text-primary/25 dark:text-primary/30 rotate-12 [&_svg]:w-8 [&_svg]:h-8 md:[&_svg]:w-10 md:[&_svg]:h-10 transition-all">
                    {renderMiniIcon('sparkles')}
                </div>
                <div className="absolute top-10 right-[8%] text-emerald-500/25 dark:text-emerald-400/30 -rotate-12 [&_svg]:w-9 [&_svg]:h-9 md:[&_svg]:w-11 md:[&_svg]:h-11 transition-all">
                    {renderMiniIcon('code')}
                </div>
                <div className="absolute top-36 left-[3%] text-teal-400/20 dark:text-teal-400/25 -rotate-45 [&_svg]:w-7 [&_svg]:h-7 md:[&_svg]:w-9 md:[&_svg]:h-9 transition-all">
                    {renderMiniIcon('command')}
                </div>
                <div className="absolute top-32 right-[4%] text-primary/20 dark:text-primary/25 rotate-45 [&_svg]:w-8 [&_svg]:h-8 md:[&_svg]:w-10 md:[&_svg]:h-10 transition-all">
                    {renderMiniIcon('zap')}
                </div>
                <div className="absolute bottom-6 left-[10%] text-emerald-400/20 dark:text-emerald-400/25 rotate-12 [&_svg]:w-8 [&_svg]:h-8 md:[&_svg]:w-10 md:[&_svg]:h-10 transition-all">
                    {renderMiniIcon('shield')}
                </div>
                <div className="absolute bottom-4 right-[11%] text-teal-300/25 dark:text-teal-300/30 -rotate-12 [&_svg]:w-8 [&_svg]:h-8 md:[&_svg]:w-10 md:[&_svg]:h-10 transition-all">
                    {renderMiniIcon('globe')}
                </div>
                <div className="absolute top-3 left-[45%] text-primary/15 dark:text-primary/20 rotate-12 [&_svg]:w-6 [&_svg]:h-6 md:[&_svg]:w-8 md:[&_svg]:h-8 transition-all">
                    {renderMiniIcon('search')}
                </div>
                <div className="absolute bottom-2 right-[43%] text-emerald-500/15 dark:text-emerald-500/20 -rotate-18 [&_svg]:w-7 [&_svg]:h-7 md:[&_svg]:w-9 md:[&_svg]:h-9 transition-all">
                    {renderMiniIcon('arrow-right')}
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
                <div className="flex flex-col gap-8">

                    {/* Top Hero Headline Banner */}
                    <div className="flex flex-col items-center text-center gap-3.5 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs text-primary font-bold font-mono bg-primary/10 rounded-full border border-primary/20 shadow-xs backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            @pphatdev/registry v1.2.0
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-foreground mt-1">
                            @pphatdev/registry <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-teal-300">Documentation</span>
                        </h1>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl opacity-90">
                            A powerful and extremely fast CLI tool to instantly download and manage custom UI components and icons on-demand for Next.js, Nuxt 3, or raw SVG.
                        </p>

                        {/* HERO INSTALLATION PACKAGE MANAGER SWITCHER & QUICK COPY */}
                        <div className="w-full max-w-md mx-auto flex flex-col gap-2.5 mt-2">
                            {/* Package Manager Switcher Pills */}
                            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/40 w-fit mx-auto shadow-xs">
                                {(['npm', 'pnpm', 'bun'] as const).map(pkg => (
                                    <button
                                        key={pkg}
                                        onClick={() => setHeroPkgManager(pkg)}
                                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                            heroPkgManager === pkg
                                                ? 'bg-background text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                        }`}
                                    >
                                        {pkg}
                                    </button>
                                ))}
                            </div>

                            {/* Quick Copy CLI Command Box */}
                            <div className="flex items-center gap-3 bg-background/60 backdrop-blur-xl border border-border/60 p-2 pl-4 rounded-2xl w-full group hover:border-primary/50 transition-colors shadow-xs">
                                <span className="text-primary font-mono select-none font-bold">$</span>
                                <code className="text-primary text-xs sm:text-sm font-mono flex-1 text-left font-bold select-all">
                                    {installCmd}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(installCmd, 'hero-cli')}
                                    title="Copy installation command"
                                    className="p-2 flex items-center justify-center bg-muted/50 hover:bg-muted rounded-xl transition-all border border-border/40 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer active:scale-95"
                                >
                                    {copiedCommand === 'hero-cli' ? (
                                        <span className="text-[10px] whitespace-nowrap leading-tight pt-0 font-mono font-bold text-primary px-1">Copied</span>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* HERO REAL-LIFE ANIMATED TERMINAL STREAM WINDOW */}
                    <TerminalShowcase
                        heroPkgManager={heroPkgManager}
                        copyToClipboard={copyToClipboard}
                        copiedCommand={copiedCommand}
                    />

                </div>
            </div>
        </section>
    );
}
