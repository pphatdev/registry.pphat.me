import React, { useState } from "react";
import { IconType, renderVectorPath, renderMiniIcon, getIconSvgPaths } from "./VectorIcons";

interface InteractivePlaygroundProps {
    copyToClipboard: (text: string, id: string) => void;
    copiedCommand: string | null;
}

export function InteractivePlayground({
    copyToClipboard,
    copiedCommand,
}: InteractivePlaygroundProps) {
    const [selectedIcon, setSelectedIcon] = useState<IconType>('arrow-right');
    const [selectedFormat, setSelectedFormat] = useState<'nextjs' | 'nuxtjs' | 'svg'>('nextjs');
    const [canvasBg, setCanvasBg] = useState<'dots' | 'checker' | 'cad'>('cad');

    // Interactive Playground Sliders & Toggles
    const [iconSize, setIconSize] = useState<number>(32);
    const [strokeWidth, setStrokeWidth] = useState<number>(2);
    const [rotationAngle, setRotationAngle] = useState<number>(0);
    const [colorTheme, setColorTheme] = useState<string>('currentColor');

    const getCliCommand = () => {
        return `npx @pphatdev/registry add ${selectedIcon} --type ${selectedFormat}`;
    };

    const getCodeSnippet = () => {
        const componentName = `${selectedIcon.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Icon`;
        const innerPaths = getIconSvgPaths(selectedIcon);

        const colorProp = colorTheme !== 'currentColor' ? ` color="${colorTheme}"` : '';
        const rotateStyle = rotationAngle !== 0 ? ` style={{ transform: 'rotate(${rotationAngle}deg)' }}` : '';
        const rotateAttr = rotationAngle !== 0 ? ` transform="rotate(${rotationAngle})"` : '';

        if (selectedFormat === 'nextjs') {
            return `import React, { forwardRef } from 'react';\n\nexport const ${componentName} = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (\n    <svg ref={ref} width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"${colorProp}${rotateStyle} strokeLinecap="round" strokeLinejoin="round" {...props}>\n        ${innerPaths}\n    </svg>\n));`;
        } else if (selectedFormat === 'nuxtjs') {
            const vueRotateStyle = rotationAngle !== 0 ? ` :style="{ transform: 'rotate(${rotationAngle}deg)' }"` : '';
            return `<template>\n    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${colorProp}${vueRotateStyle} stroke-linecap="round" stroke-linejoin="round">\n        ${innerPaths}\n    </svg>\n</template>`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${colorTheme === 'currentColor' ? 'currentColor' : colorTheme}" stroke-width="2"${rotateAttr} stroke-linecap="round" stroke-linejoin="round">\n    ${innerPaths}\n</svg>`;
    };

    const getHighlightedCodeHtml = () => {
        const raw = getCodeSnippet();
        if (!raw) return "";

        const escaped = raw
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // VS Code Dark+ Tokenizer
        const tokenRegex = /("[\s\S]*?"|'[\s\S]*?')|(&lt;\/?[a-zA-Z0-9_-]+)|(&gt;|\/&gt;)|(\b(?:import|from|export|const|default|function|return|template|ref)\b)|(\b(?:React|forwardRef|SVGProps|SVGSVGElement|displayName|[A-Z][a-zA-Z0-9]*Icon)\b)|(\b[a-zA-Z0-9_-]+=(?=(?:[^"]*"[^"]*")*[^"]*$))/g;

        return escaped.replace(tokenRegex, (match, str, tag, tagEnd, keyword, type, attr) => {
            if (str) return `<span style="color: #ce9178;">${str}</span>`;
            if (tag) {
                const parts = tag.split(/(&lt;\/?)/);
                return `<span style="color: #808080;">${parts[1]}</span><span style="color: #569cd6;">${parts[2]}</span>`;
            }
            if (tagEnd) return `<span style="color: #808080;">${tagEnd}</span>`;
            if (keyword) return `<span style="color: #c586c0; font-weight: 500;">${keyword}</span>`;
            if (type) return `<span style="color: #4ec9b0;">${type}</span>`;
            if (attr) {
                const attrName = attr.slice(0, -1);
                return `<span style="color: #9cdcfe;">${attrName}</span><span style="color: #d4d4d4;">=</span>`;
            }
            return match;
        });
    };

    const iconList: { id: IconType; label: string }[] = [
        { id: 'arrow-right', label: 'Arrow' },
        { id: 'search', label: 'Search' },
        { id: 'code', label: 'Code' },
        { id: 'sparkles', label: 'Sparkles' },
        { id: 'command', label: 'Cmd' },
        { id: 'zap', label: 'Zap' },
        { id: 'shield', label: 'Shield' },
        { id: 'globe', label: 'Globe' }
    ];

    return (
        <section className="relative py-4 md:py-6 pt-12 bg-background">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col gap-4">
                    {/* Section Header Title & Description */}
                    <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                        <div className="flex flex-col gap-2 mt-10">
                            {/* Title with Glowing Icon Container */}
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/15 dark:bg-primary/10 rounded-2xl border border-primary/30 text-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m18 16 4-4-4-4" />
                                        <path d="m6 8-4 4 4 4" />
                                        <path d="m14.5 4-5 16" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                    Icon <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-300">Playground</span>
                                </h2>
                            </div>

                            {/* Refined Description */}
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                                Customize vector dimensions, rotation angles, colors, and live presets in real-time. Export production-ready TSX, Vue, or raw SVG code directly to your codebase.
                            </p>
                        </div>

                        {/* Right Side Quick Specs Summary Pill */}
                        {/* <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-muted/40 border border-border/40 text-xs font-mono text-muted-foreground shrink-0 self-start md:self-end shadow-xs">
                            <span className="flex items-center gap-1 text-foreground font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                3 Formats
                            </span>
                            <span className="text-border">•</span>
                            <span>8 Presets</span>
                            <span className="text-border">•</span>
                            <span>Instant CLI Copy</span>
                        </div> */}
                    </div>

                    {/* UNIFIED INTERACTIVE PLAYGROUND STAGE CARD */}
                    <div className="w-full rounded-3xl glass-panel mt-10 border-border/5 flex flex-col overflow-hidden">

                        {/* Window Header Bar with Edge-to-Edge Divider */}
                        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider ml-1">@pphatdev/registry</span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full">v1.1.0 Playground</span>
                        </div>

                        {/* 2-SIDE GRID LAYOUT (EQUAL HEIGHT STRETCH) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch px-4 sm:px-5 py-4">

                            {/* SIDE 1 (LEFT 6 COLS): ONLY FOR PREVIEW ICONS */}
                            <div className="lg:col-span-6 flex flex-col justify-between gap-3.5 h-full">
                                <div className="flex items-center justify-between h-8 border-b border-border/30 pb-2">
                                    <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        Vector Icon Preview
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground">Stage: <strong className="text-foreground">{iconSize}×{iconSize}px</strong></span>
                                </div>

                                {/* Vector Asset Selector Row */}
                                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                                    {iconList.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedIcon(item.id)}
                                            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${selectedIcon === item.id
                                                    ? 'bg-primary/10 text-primary border border-primary/30 font-bold shadow-xs scale-[1.02]'
                                                    : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-transparent'
                                                }`}
                                        >
                                            <span className={`${selectedIcon === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {renderMiniIcon(item.id)}
                                            </span>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Vector Artboard Viewport Canvas */}
                                <div
                                    className={`relative flex-1 min-h-[300px] rounded-2xl border border-border/70 flex flex-col items-center justify-center transition-all overflow-hidden ${canvasBg === 'dots'
                                            ? 'bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] bg-[size:16px_16px] bg-background'
                                            : canvasBg === 'checker'
                                                ? 'bg-[linear-gradient(45deg,#80808018_25%,transparent_25%),linear-gradient(-45deg,#80808018_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#80808018_75%),linear-gradient(-45deg,transparent_75%,#80808018_75%)] bg-[size:20px_20px] bg-background'
                                                : 'bg-slate-950 dark:bg-[#0d1117] bg-[radial-gradient(#334155_1px,transparent_1px)] dark:bg-[radial-gradient(#1f293d_1px,transparent_1px)] bg-[size:20px_20px]'
                                        }`}
                                >
                                    {/* Floating CAD/Checker Switcher */}
                                    <div className="absolute top-2.5 left-3 z-10 flex items-center gap-1.5 bg-background/90 dark:bg-background/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/60 shadow-sm">
                                        <div className="inline-flex gap-1 rounded-full bg-muted/80 p-0.5">
                                            {[
                                                { id: 'cad', label: 'CAD' },
                                                { id: 'checker', label: 'Checker' },
                                            ].map(bg => (
                                                <button
                                                    key={bg.id}
                                                    onClick={() => setCanvasBg(bg.id as any)}
                                                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono transition-all cursor-pointer ${canvasBg === bg.id ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    {bg.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-primary bg-primary/20 shadow-xs" />
                                    <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-primary bg-primary/20 shadow-xs" />
                                    <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-primary bg-primary/20 shadow-xs" />

                                    {/* Center Vector Graphic */}
                                    <div className="relative p-6 border border-primary/40 rounded-2xl bg-primary/10 dark:bg-primary/5 flex items-center justify-center transition-all duration-200 shadow-inner backdrop-blur-xs">
                                        <div className="absolute -top-3 px-2 py-0.2 whitespace-nowrap rounded-full bg-primary text-primary-foreground font-mono text-[9px] font-bold shadow-xs">
                                            {iconSize}px Asset
                                        </div>
                                        {renderVectorPath({
                                            selectedIcon,
                                            iconSize,
                                            strokeWidth,
                                            rotationAngle,
                                            colorTheme
                                        })}
                                    </div>

                                    {/* Bottom Status Overlay */}
                                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground bg-background/95 dark:bg-background/90 px-3.5 py-1 rounded-full border border-border/60 backdrop-blur-md shadow-xs">
                                        <span>Size: <strong className="text-foreground">{iconSize}px</strong></span>
                                        <span>Rotate: <strong className="text-foreground">{rotationAngle}°</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* SIDE 2 (RIGHT 6 COLS): CONTROL AND GENERATED CODE */}
                            <div className="lg:col-span-6 flex flex-col justify-between gap-3.5 h-full">
                                <div className="flex flex-col gap-3.5">
                                    <div className="flex items-center justify-between h-8 border-b border-border/30 pb-2">
                                        <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <span className="text-primary">⚡</span>
                                            Controls & Code Output
                                        </span>

                                        {/* Component Format Switcher */}
                                        <div className="inline-flex h-7 items-center justify-center rounded-full bg-muted/70 p-0.5 text-muted-foreground text-xs font-semibold">
                                            {[
                                                { id: 'nextjs', label: 'Next.js' },
                                                { id: 'nuxtjs', label: 'NuxtJS' },
                                                { id: 'svg', label: 'SVG' }
                                            ].map(fmt => (
                                                <button
                                                    key={fmt.id}
                                                    onClick={() => setSelectedFormat(fmt.id as any)}
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${selectedFormat === fmt.id
                                                            ? 'bg-background text-foreground shadow-xs font-bold'
                                                            : 'hover:text-foreground'
                                                        }`}
                                                >
                                                    {fmt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CONTROLS ROW */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs font-mono">
                                        {/* Size Selector */}
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Size:</span>
                                            <div className="inline-flex rounded-full bg-muted/70 p-0.5">
                                                {[16, 24, 32, 48, 64].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setIconSize(s)}
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${iconSize === s ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Rotation Dial */}
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Rotate:</span>
                                            <div className="inline-flex rounded-full bg-muted/70 p-0.5">
                                                {[0, 90, 180, 270].map(deg => (
                                                    <button
                                                        key={deg}
                                                        onClick={() => setRotationAngle(deg)}
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${rotationAngle === deg ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                                                            }`}
                                                    >
                                                        {deg}°
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Color Theme */}
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Color:</span>
                                            <div className="flex items-center gap-1">
                                                {['currentColor', '#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#8b5cf6'].map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setColorTheme(c)}
                                                        className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${colorTheme === c ? 'scale-125 ring-2 ring-primary/60' : 'hover:scale-110 opacity-80 hover:opacity-100'
                                                            }`}
                                                        style={{ backgroundColor: c === 'currentColor' ? 'var(--foreground)' : c }}
                                                        title={c}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generated Code Inspector Box */}
                                    <div className="relative flex-1 min-h-[175px] rounded-2xl border border-zinc-800/80 bg-[#0d1117] text-zinc-200 font-mono text-xs overflow-hidden shadow-2xl flex flex-col">
                                        <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-zinc-800/80 text-[10px] shrink-0">
                                            <span className="text-zinc-300 font-mono font-medium flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {selectedIcon}.{selectedFormat === 'nextjs' ? 'tsx' : selectedFormat === 'nuxtjs' ? 'vue' : 'svg'}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(getCodeSnippet(), "playground-code")}
                                                className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-95"
                                                title={copiedCommand === "playground-code" ? "Copied Code" : "Copy Code"}
                                            >
                                                {copiedCommand === "playground-code" ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        <pre
                                            className="p-3.5 overflow-y-auto leading-relaxed select-text text-zinc-200 text-[11px] font-mono scrollbar-thin flex-1"
                                            dangerouslySetInnerHTML={{ __html: getHighlightedCodeHtml() }}
                                        />
                                    </div>
                                </div>

                                {/* CLI Installer Terminal Box */}
                                <div className="p-2 rounded-2xl bg-[#0d1117] border border-zinc-800/80 text-zinc-200 font-mono text-xs flex items-center justify-between gap-2 shadow-2xl">
                                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-1">
                                        <span className="text-[#569cd6] font-bold select-none">$</span>
                                        <code className="text-zinc-200 whitespace-nowrap font-bold select-all">
                                            {getCliCommand()}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(getCliCommand(), "unified-stage-cli")}
                                        className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
                                        title={copiedCommand === "unified-stage-cli" ? "Copied Command" : "Copy Command"}
                                    >
                                        {copiedCommand === "unified-stage-cli" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
