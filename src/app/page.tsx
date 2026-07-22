"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GithubIcon } from "@/components/icons/github";

export default function RegistryHomePage() {
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

    // REGISTRY PLAYGROUND STATE
    const [selectedIcon, setSelectedIcon] = useState<'arrow-right' | 'search' | 'code' | 'sparkles' | 'command' | 'zap' | 'shield' | 'globe'>('arrow-right');
    const [selectedFormat, setSelectedFormat] = useState<'nextjs' | 'nuxtjs' | 'svg'>('nextjs');
    const [canvasBg, setCanvasBg] = useState<'dots' | 'checker' | 'cad'>('cad');

    // Interactive Playground Sliders & Toggles
    const [iconSize, setIconSize] = useState<number>(32);
    const [strokeWidth, setStrokeWidth] = useState<number>(2);
    const [rotationAngle, setRotationAngle] = useState<number>(0);
    const [colorTheme, setColorTheme] = useState<string>('currentColor');

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedConfigPreset, setSelectedConfigPreset] = useState<'nextjs' | 'nuxtjs' | 'monorepo'>('nextjs');
    const [heroPkgManager, setHeroPkgManager] = useState<'npm' | 'pnpm' | 'bun'>('npm');

    const copyToClipboard = async (text: string, id: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "absolute";
                textArea.style.left = "-999999px";
                document.body.prepend(textArea);
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
            }
            setCopiedCommand(id);
            setTimeout(() => setCopiedCommand(null), 12000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const getCliCommand = () => {
        return `npx @pphatdev/registry add ${selectedIcon} --type ${selectedFormat}`;
    };

    const renderVectorPath = () => {
        const props = {
            width: iconSize,
            height: iconSize,
            strokeWidth: strokeWidth,
            style: {
                color: colorTheme === 'currentColor' ? 'var(--foreground)' : colorTheme,
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'all 0.2s ease'
            }
        };

        switch (selectedIcon) {
            case 'arrow-right':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
            case 'search':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
            case 'code':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
            case 'sparkles':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" /></svg>;
            case 'command':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>;
            case 'zap':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
            case 'shield':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>;
            case 'globe':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>;
        }
    };

    const renderMiniIcon = (iconId: string) => {
        const props = { width: 14, height: 14, strokeWidth: 2 };
        switch (iconId) {
            case 'arrow-right':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
            case 'search':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
            case 'code':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
            case 'sparkles':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" /></svg>;
            case 'command':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>;
            case 'zap':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
            case 'shield':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>;
            case 'globe':
                return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>;
        }
    };

    const getIconSvgPaths = (iconId: string) => {
        switch (iconId) {
            case 'arrow-right':
                return '<path d="M5 12h14" />\n        <path d="m12 5 7 7-7 7" />';
            case 'search':
                return '<circle cx="11" cy="11" r="8" />\n        <path d="m21 21-4.3-4.3" />';
            case 'code':
                return '<polyline points="16 18 22 12 16 6" />\n        <polyline points="8 6 2 12 8 18" />';
            case 'sparkles':
                return '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />';
            case 'command':
                return '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />';
            case 'zap':
                return '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />';
            case 'shield':
                return '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />';
            case 'globe':
                return '<circle cx="12" cy="12" r="10" />\n        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />\n        <path d="M2 12h20" />';
            default:
                return '<path d="M5 12h14" />';
        }
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
            if (str) return `<span style="color: #ce9178;">${str}</span>`; // VS Code Dark+ Strings
            if (tag) {
                const parts = tag.split(/(&lt;\/?)/);
                return `<span style="color: #808080;">${parts[1]}</span><span style="color: #569cd6;">${parts[2]}</span>`; // VS Code Dark+ Tags
            }
            if (tagEnd) return `<span style="color: #808080;">${tagEnd}</span>`; // VS Code Dark+ Tag Brackets
            if (keyword) return `<span style="color: #c586c0; font-weight: 500;">${keyword}</span>`; // VS Code Dark+ Keywords
            if (type) return `<span style="color: #4ec9b0;">${type}</span>`; // VS Code Dark+ Types
            if (attr) {
                const attrName = attr.slice(0, -1);
                return `<span style="color: #9cdcfe;">${attrName}</span><span style="color: #d4d4d4;">=</span>`; // VS Code Dark+ Attributes
            }
            return match;
        });
    };

    const commands = [
        {
            id: "add-nextjs",
            label: "Add Icon as Next.js (React TSX)",
            cmd: "npx @pphatdev/registry add arrow-right --type nextjs",
            desc: "Generates forwardRef typed React component with auto className & currentColor.",
            tag: "React 19"
        },
        {
            id: "add-nuxtjs",
            label: "Add Icon as NuxtJS (Vue 3)",
            cmd: "npx @pphatdev/registry add arrow-right --type nuxtjs",
            desc: "Generates clean Vue 3 <template> icon component in components/icons.",
            tag: "Vue 3"
        },
        {
            id: "add-svg",
            label: "Add Icon as Raw Vector SVG",
            cmd: "npx @pphatdev/registry add arrow-right --type svg",
            desc: "Downloads vector asset directly into your project's assets/icons folder.",
            tag: "Raw SVG"
        },
        {
            id: "init",
            label: "Initialize Configuration File",
            cmd: "npx @pphatdev/registry init",
            desc: "Creates pphatdev.json config file to define custom output directories.",
            tag: "CLI Tool"
        }
    ];

    const configPresets = {
        nextjs: `{
  "name": "Next.js Application Setup",
  "icons": {
    "nextjs": { "dir": "src/components/icons", "use": true },
    "svg": { "dir": "public/icons", "use": false },
    "nuxtjs": { "dir": "components/icons", "use": false }
  }
}`,
        nuxtjs: `{
  "name": "Nuxt 3 Application Setup",
  "icons": {
    "nuxtjs": { "dir": "components/icons", "use": true },
    "svg": { "dir": "public/icons", "use": false },
    "nextjs": { "dir": "src/components/icons", "use": false }
  }
}`,
        monorepo: `{
  "name": "Company Monorepo Setup",
  "icons": {
    "nextjs": { "dir": "apps/web/components/icons", "use": true },
    "nuxtjs": { "dir": "apps/docs/components/icons", "use": true },
    "svg": { "dir": "packages/assets/icons", "use": true }
  }
}`
    };

    const filteredCommands = commands.filter(
        c => c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 w-full flex flex-col gap-6">

            {/* HERO SECTION WITH EXPANDED HEIGHT & ELEGANT SPACING */}
            <section className="relative pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-24 overflow-hidden flex flex-col justify-center min-h-[460px] md:min-h-[520px]">
                {/* Background Ambient Glows & Floating Random Vector Icons */}
                <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden select-none">
                    <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-primary/20 rounded-full blur-[110px] opacity-40 mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[90px] opacity-30 mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                    {/* Floating Random Vector Background Icons - BALANCED MEDIUM SIZE */}
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

                <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
                    <div className="flex flex-col gap-6">

                        {/* Top Hero Headline Banner - Redesigned Spacing */}
                        <div className="flex flex-col items-center text-center gap-3.5 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs text-primary font-bold font-mono bg-primary/10 rounded-full border border-primary/20 shadow-xs backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                @pphatdev/registry v1.1.0
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-foreground mt-1">
                                @pphatdev/registry <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-300">Documentation</span>
                            </h1>

                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl opacity-90">
                                Test vector sizes, rotation angles, colors, and live component presets. Export typed Next.js TSX, Nuxt 3 Vue, or raw SVG components directly to your codebase.
                            </p>

                            {/* HERO INSTALLATION CLI (KHMER-DATETIME STYLE) */}
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

                                {/* CLI Command Box */}
                                <div className="flex items-center gap-3 bg-background/60 backdrop-blur-xl border border-border/60 p-2 pl-4 rounded-2xl w-full group hover:border-primary/50 transition-colors">
                                    <span className="text-primary font-mono select-none font-bold">$</span>
                                    <code className="text-primary text-xs sm:text-sm font-mono flex-1 text-left font-bold select-all">
                                        {heroPkgManager === 'npm'
                                            ? 'npm i @pphatdev/registry'
                                            : heroPkgManager === 'pnpm'
                                            ? 'pnpm add @pphatdev/registry'
                                            : 'bun add @pphatdev/registry'
                                        }
                                    </code>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                heroPkgManager === 'npm'
                                                    ? 'npx @pphatdev/registry init'
                                                    : heroPkgManager === 'pnpm'
                                                    ? 'pnpm dlx @pphatdev/registry init'
                                                    : 'bunx @pphatdev/registry init',
                                                'hero-cli'
                                            )
                                        }
                                        title="Copy to clipboard"
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
                    </div>
                </div>
            </section>

            {/* SECTION 2: DEDICATED INTERACTIVE PLAYGROUND SECTION */}
            <section className="relative py-4 md:py-6">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex flex-col gap-4">
                        {/* Section Header Title */}
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m18 16 4-4-4-4" />
                                    <path d="m6 8-4 4 4 4" />
                                    <path d="m14.5 4-5 16" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Playground</h2>
                        </div>

                        {/* UNIFIED INTERACTIVE PLAYGROUND STAGE CARD */}
                        <div className="w-full rounded-3xl glass-panel border border-border/80 shadow-2xl flex flex-col overflow-hidden">

                            {/* Window Header Bar with Edge-to-Edge Divider */}
                            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border/40">
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
                                        {[
                                            { id: 'arrow-right', label: 'Arrow' },
                                            { id: 'search', label: 'Search' },
                                            { id: 'code', label: 'Code' },
                                            { id: 'sparkles', label: 'Sparkles' },
                                            { id: 'command', label: 'Cmd' },
                                            { id: 'zap', label: 'Zap' },
                                            { id: 'shield', label: 'Shield' },
                                            { id: 'globe', label: 'Globe' }
                                        ].map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => setSelectedIcon(item.id as any)}
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

                                    {/* Vector Artboard Viewport Canvas (Stretches to fit) */}
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
                                            {renderVectorPath()}
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

                                        {/* Generated Code Inspector Box (Stretches to fit) */}
                                        <div className="relative flex-1 min-h-[175px] rounded-2xl border border-[#333333]/80 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs overflow-hidden shadow-xl flex flex-col">
                                            <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-[10px] text-[#cccccc] shrink-0">
                                                <span className="text-zinc-300 font-mono font-medium flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {selectedIcon}.{selectedFormat === 'nextjs' ? 'tsx' : selectedFormat === 'nuxtjs' ? 'vue' : 'svg'}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(getCodeSnippet(), "playground-code")}
                                                    className="p-1.5 rounded bg-[#37373d] hover:bg-[#45454d] text-white transition-colors cursor-pointer flex items-center justify-center"
                                                    title={copiedCommand === "playground-code" ? "Copied Code" : "Copy Code"}
                                                >
                                                    {copiedCommand === "playground-code" ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
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

                                            <pre
                                                className="p-3 overflow-y-auto leading-relaxed select-text text-[#d4d4d4] text-[11px] font-mono scrollbar-thin flex-1"
                                                dangerouslySetInnerHTML={{ __html: getHighlightedCodeHtml() }}
                                            />
                                        </div>
                                    </div>

                                    {/* CLI Installer Terminal Box */}
                                    <div className="p-2 rounded-2xl bg-[#1e1e1e] border border-[#333333]/80 text-[#d4d4d4] font-mono text-xs flex items-center justify-between gap-2 shadow-xl">
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        </div>
    );
}
