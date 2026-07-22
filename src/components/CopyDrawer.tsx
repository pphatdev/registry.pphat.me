"use client";

import React, { useState, useEffect, useRef } from "react";

interface CopyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    icon: any; // Using any to avoid type errors with string properties
    size: number;
    strokeWidth: number;
    color: string;
}

export default function CopyDrawer({ isOpen, onClose, icon, size, strokeWidth, color }: CopyDrawerProps) {
    const [renderedIcon, setRenderedIcon] = useState<Record<string, unknown> | null>(null);
    const [svgContent, setSvgContent] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'svg' | 'nextjs' | 'nuxtjs'>('svg');
    const [isVisible, setIsVisible] = useState(false);

    // Visual Design Studio Controls
    const [canvasBg, setCanvasBg] = useState<'dots' | 'checker' | 'solid'>('dots');
    const [zoom, setZoom] = useState<number>(1.5);
    const [showCodePreview, setShowCodePreview] = useState<boolean>(true);

    // Keep the drawer mounted, use isVisible for transitions
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // Track the current icon to prevent layout shift during exit animation
    useEffect(() => {
        if (icon) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRenderedIcon(icon);
            
            if (icon.svgContent) {
                setSvgContent(icon.svgContent);
            } else if (icon.target) {
                setLoading(true);
                fetch(`https://raw.githubusercontent.com/pphatdev/icons/main/${icon.target}`)
                    .then(res => res.ok ? res.json() : Promise.reject())
                    .then(data => {
                        setSvgContent(data.files[0]?.content || "");
                        setLoading(false);
                    })
                    .catch(() => {
                        setLoading(false);
                    });
            }
        }
    }, [icon]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const getCustomizedSvg = () => {
        if (!svgContent) return "";
        let finalSvg = svgContent;
        
        if (finalSvg.includes('width="')) finalSvg = finalSvg.replace(/width="[^"]+"/, `width="${size}"`);
        else finalSvg = finalSvg.replace('<svg ', `<svg width="${size}" `);
        
        if (finalSvg.includes('height="')) finalSvg = finalSvg.replace(/height="[^"]+"/, `height="${size}"`);
        else finalSvg = finalSvg.replace('<svg ', `<svg height="${size}" `);
        
        if (finalSvg.includes('stroke-width="')) finalSvg = finalSvg.replace(/stroke-width="[^"]+"/, `stroke-width="${strokeWidth}"`);
        
        if (color) {
            finalSvg = finalSvg.replace(/currentColor/g, color);
        }
        return finalSvg;
    };

    const toPascalCase = (str: string) => {
        return str.replace(/(^\w|-\w)/g, (clearAndUpper) => clearAndUpper.replace(/-/, "").toUpperCase());
    };

    const formatSvgParts = (content: string, baseIndent: number, tabSize: number, isReact: boolean) => {
        const svgMatch = content.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);
        if (!svgMatch) return null;
        const attrIndent = baseIndent + tabSize;
        const attrString = svgMatch[1].trim();
        const attrsMatch = attrString.match(/[^\s="']+=(?:"[^"]*"|'[^']*')|[^\s="']+/g) || [];
        const formattedAttributes = attrsMatch.map((attr) => " ".repeat(attrIndent) + attr).join("\n");
        let innerContent = svgMatch[2].trim();
        innerContent = innerContent.replace(/(>)\s*(<)/g, "$1\n$2");
        const styleMatch = innerContent.match(/<style>([\s\S]*?)<\/style>/i);
        let minStyleIndent = 0;
        if (styleMatch) {
            const styleLines = styleMatch[1].split("\n").filter((l) => l.trim());
            if (styleLines.length > 0) {
                minStyleIndent = Math.min(...styleLines.map((l) => l.match(/^\s*/)?.[0].length || 0));
            }
        }
        if (isReact) {
            innerContent = innerContent.replace(/<style>([\s\S]*?)<\/style>/gi, "<style>{`\n$1\n`}</style>");
        }
        const lines = innerContent.split("\n");
        const formattedInner = [];
        let currentIndent = attrIndent;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith("</") && trimmed !== "</style>") {
                currentIndent = Math.max(attrIndent, currentIndent - tabSize);
                formattedInner.push(" ".repeat(currentIndent) + trimmed);
            } else if (isReact && trimmed === "`}</style>") {
                formattedInner.push(" ".repeat(attrIndent) + trimmed);
            } else if (trimmed.startsWith("<style")) {
                formattedInner.push(" ".repeat(attrIndent) + (isReact ? "<style>{`" : "<style>"));
            } else if (trimmed.startsWith("<") && !trimmed.startsWith("</")) {
                formattedInner.push(" ".repeat(currentIndent) + trimmed);
                if (!trimmed.endsWith("/>") && !trimmed.includes("</")) {
                    currentIndent += tabSize;
                }
            } else {
                const spaces = line.match(/^\s*/)?.[0].length || 0;
                const normalizedSpaces = Math.max(0, spaces - minStyleIndent) + attrIndent + tabSize;
                formattedInner.push(" ".repeat(normalizedSpaces) + trimmed);
            }
        }
        return { attributes: formattedAttributes, rawAttributes: attrString, inner: formattedInner.join("\n") };
    };

    const transformRegistryContent = (name: string, content: string, format: string) => {
        if (format === "nextjs") {
            const componentName = `${toPascalCase(name)}Icon`;
            let reactContent = content.replace(/class=/g, "className=");
            const parts = formatSvgParts(reactContent, 4, 4, true);
            if (!parts) {
                reactContent = reactContent.replace(/<svg /, "<svg {...props} ");
                const fallbackContent = `import React, { forwardRef } from 'react';\n\nexport const ${componentName} = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (\n  ${reactContent}\n));\n\n${componentName}.displayName = '${componentName}';\n`;
                return { path: `${name}.tsx`, content: fallbackContent };
            }
            const finalContent = `import React, { forwardRef } from 'react';\n\nexport const ${componentName} = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (\n    <svg\n        ref={ref}\n${parts.attributes}\n        {...props}\n    >\n${parts.inner}\n    </svg>\n));\n\n${componentName}.displayName = '${componentName}';\n`;
            return { path: `${name}.tsx`, content: finalContent };
        } else if (format === "nuxtjs") {
            const parts = formatSvgParts(content, 4, 4, false);
            if (!parts) {
                return { path: `${name}.vue`, content: `<template>\n    ${content}\n</template>\n` };
            }
            const finalContent = `<template>\n    <svg ${parts.rawAttributes}>\n${parts.inner}\n    </svg>\n</template>\n`;
            return { path: `${name}.vue`, content: finalContent };
        }
        return { path: `${name}.svg`, content };
    };

    const getCodeSnippet = () => {
        const iconName = (renderedIcon?.name as string) || 'icon';
        const rawSvg = getCustomizedSvg();
        return transformRegistryContent(iconName, rawSvg, activeTab).content;
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

    const copyToClipboard = async (text: string, format: string) => {
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
            setCopiedFormat(format);
            setTimeout(() => setCopiedFormat(null), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const downloadFile = () => {
        const iconName = (renderedIcon?.name as string) || 'icon';
        const rawSvg = getCustomizedSvg();
        const compiled = transformRegistryContent(iconName, rawSvg, activeTab);
        
        let mimeType = "text/plain";
        if (activeTab === 'svg') mimeType = "image/svg+xml";
        else if (activeTab === 'nextjs') mimeType = "text/typescript";
        
        const blob = new Blob([compiled.content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = compiled.path;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getCliCommand = () => {
        const iconName = renderedIcon?.name || 'icon';
        if (activeTab === 'svg') return `pphat add ${iconName} --type svg`;
        if (activeTab === 'nextjs') return `pphat add ${iconName} --type nextjs`;
        if (activeTab === 'nuxtjs') return `pphat add ${iconName} --type nuxtjs`;
        return `pphat add ${iconName}`;
    };

    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('code') || target.closest('a') || target.closest('pre')) return;
        
        setIsDragging(true);
        startY.current = e.clientY;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const deltaY = e.clientY - startY.current;
        if (deltaY > 0) {
            setDragY(deltaY);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (dragY > 120) {
            onClose();
        }
        setDragY(0);
    };

    const getCanvasStyle = () => {
        if (canvasBg === 'dots') {
            return {
                backgroundImage: `radial-gradient(var(--border) 1.2px, transparent 1.2px)`,
                backgroundSize: '16px 16px',
                backgroundPosition: 'center center'
            };
        }
        if (canvasBg === 'checker') {
            return {
                backgroundImage: `conic-gradient(rgba(128,128,128,0.18) 90deg, transparent 90deg 180deg, rgba(128,128,128,0.18) 180deg 270deg, transparent 270deg)`,
                backgroundSize: '16px 16px',
                backgroundPosition: 'center center'
            };
        }
        return {};
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col justify-end ${isVisible ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Drawer Container */}
            <div 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`relative z-10 bg-background/95 backdrop-blur-xl border-t border-border/80 rounded-t-[20px] shadow-2xl flex flex-col items-center w-full max-h-[92vh] overflow-y-auto md:overflow-hidden pb-6 touch-none select-none`}
                style={{
                    transform: isVisible ? `translateY(${isDragging && dragY > 0 ? dragY : 0}px)` : "translateY(100%)",
                    transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
            >
                {/* Swipe Handle Bar */}
                <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing" onClick={onClose}>
                    <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors" />
                </div>

                {/* Studio Inspector Header */}
                <div className="w-full max-w-6xl px-6 py-2 border-b border-border/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Inspector</span>
                                <span className="text-xs text-muted-foreground/40">•</span>
                                <h2 className="text-sm font-bold text-foreground capitalize tracking-wide">{(renderedIcon?.name as string) || "Icon"}</h2>
                            </div>
                            <span className="text-[11px] text-muted-foreground/80 font-mono">Vector Node • {size}px Grid</span>
                        </div>
                    </div>

                    {/* Header Action Badges & Close Button */}
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-[11px] font-mono text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            SVG 2.0 Ready
                        </div>
                        <button 
                            onClick={onClose}
                            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 border border-transparent hover:border-border"
                            aria-label="Close Inspector"
                            title="Close (Esc)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                </div>

                {/* Main Content Studio Layout */}
                <div className="w-full max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left Column: Canvas Viewport (7 cols) */}
                    <div className="md:col-span-7 flex flex-col w-full h-full min-h-[380px] md:min-h-[460px]">
                        {/* Artboard Frame & Viewport */}
                        <div className="relative flex-1 flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-[#f8f9fa] dark:bg-[#090a0f] overflow-hidden shadow-inner group">
                            
                            {/* Canvas Pattern Layer */}
                            <div 
                                className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25] pointer-events-none transition-all duration-300"
                                style={getCanvasStyle()}
                            />

                            {/* Canvas Floating Toolbar */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                                {/* Canvas Background Selector */}
                                <div className="flex items-center p-1 rounded-lg bg-background/80 backdrop-blur-md border border-border/60 shadow-sm text-xs gap-1">
                                    <button 
                                        onClick={() => setCanvasBg('dots')}
                                        className={`px-2 py-1 rounded-md transition-all font-medium ${canvasBg === 'dots' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                        title="Dot Grid Pattern"
                                    >
                                        Dots
                                    </button>
                                    <button 
                                        onClick={() => setCanvasBg('checker')}
                                        className={`px-2 py-1 rounded-md transition-all font-medium ${canvasBg === 'checker' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                        title="Transparent Checkerboard"
                                    >
                                        Grid
                                    </button>
                                    <button 
                                        onClick={() => setCanvasBg('solid')}
                                        className={`px-2 py-1 rounded-md transition-all font-medium ${canvasBg === 'solid' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                        title="Clean Solid Background"
                                    >
                                        Solid
                                    </button>
                                </div>

                                {/* Canvas Zoom Controls */}
                                <div className="flex items-center p-1 rounded-lg bg-background/80 backdrop-blur-md border border-border/60 shadow-sm text-xs gap-1">
                                    <button 
                                        onClick={() => setZoom(1)}
                                        className={`px-2 py-1 rounded-md font-mono text-[11px] transition-all ${zoom === 1 ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        1.0x
                                    </button>
                                    <button 
                                        onClick={() => setZoom(1.5)}
                                        className={`px-2 py-1 rounded-md font-mono text-[11px] transition-all ${zoom === 1.5 ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        1.5x
                                    </button>
                                    <button 
                                        onClick={() => setZoom(2)}
                                        className={`px-2 py-1 rounded-md font-mono text-[11px] transition-all ${zoom === 2 ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        2.0x
                                    </button>
                                </div>
                            </div>

                            {/* Canvas Center Stage */}
                            {loading ? (
                                <div className="relative z-10 flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                                    <span className="text-xs font-mono text-muted-foreground animate-pulse">Rendering Vector...</span>
                                </div>
                            ) : (
                                <div className="relative flex flex-col items-center justify-center z-10 transition-transform duration-300">
                                    {/* Bounding Box / Designer Artboard */}
                                    <div className="relative p-10 rounded-2xl border border-dashed border-primary/40 bg-background/60 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:border-primary/80 group-hover:shadow-primary/5">
                                        
                                        {/* Precision Anchor Handles (Figma style) */}
                                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 border-2 border-primary bg-background rounded-xs shadow-xs" />
                                        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 border-2 border-primary bg-background rounded-xs shadow-xs" />
                                        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 border-2 border-primary bg-background rounded-xs shadow-xs" />
                                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 border-2 border-primary bg-background rounded-xs shadow-xs" />
                                        
                                        {/* Center Target Indicator */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-primary/20 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Top Dimension Pill */}
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-mono rounded-full shadow-md flex items-center gap-1 font-semibold tracking-wider">
                                            <span>{size}px</span>
                                            <span className="opacity-60">×</span>
                                            <span>{size}px</span>
                                        </div>

                                        {/* SVG Render Container */}
                                        <div 
                                            style={{ 
                                                color: color,
                                                transform: `scale(${zoom})`,
                                                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: getCustomizedSvg() }}
                                            className="flex items-center justify-center"
                                        />
                                    </div>

                                    {/* Bottom Canvas Layer Specs */}
                                    <div className="mt-6 flex items-center gap-3 text-[11px] text-muted-foreground font-mono bg-background/90 px-3 py-1.5 rounded-full border border-border/60 shadow-sm backdrop-blur-md">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full border border-border/80 shadow-xs" style={{ backgroundColor: color === 'currentColor' ? 'var(--foreground)' : color }} />
                                            <span className="font-semibold text-foreground">{color}</span>
                                        </div>
                                        <span className="opacity-30">|</span>
                                        <span>Stroke: <strong className="text-foreground">{strokeWidth}px</strong></span>
                                        <span className="opacity-30">|</span>
                                        <span>ViewBox: <strong className="text-foreground">0 0 24 24</strong></span>
                                    </div>
                                </div>
                            )}

                            {/* Canvas Corner Watermark */}
                            <div className="absolute bottom-3 right-4 text-[10px] font-mono text-muted-foreground/40 pointer-events-none select-none">
                                CANVAS 1:1 • vector
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Inspector & Original Buttons Layout (5 cols) */}
                    <div className="md:col-span-5 flex flex-col justify-between w-full h-full gap-4">
                        
                        <div className="flex flex-col gap-4">
                            {/* Original Pill Tabs Selector */}
                            <div className="inline-flex h-11 items-center justify-center rounded-full bg-muted p-1 text-muted-foreground w-full">
                                {['svg', 'nextjs', 'nuxtjs'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as 'svg' | 'nextjs' | 'nuxtjs')}
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all w-full h-full cursor-pointer ${
                                            activeTab === tab 
                                                ? 'bg-background dark:bg-muted-foreground/25 text-foreground shadow-sm' 
                                                : 'hover:bg-muted/80 hover:text-foreground'
                                        }`}
                                    >
                                        {tab === 'svg' ? 'SVG' : tab === 'nextjs' ? 'Next.js' : 'NuxtJS'}
                                    </button>
                                ))}
                            </div>

                            {/* Code Preview Inspector Box */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                        Code Inspector
                                    </label>
                                    <button 
                                        onClick={() => setShowCodePreview(!showCodePreview)}
                                        className="text-[11px] text-primary hover:underline font-medium transition-colors cursor-pointer"
                                    >
                                        {showCodePreview ? "Hide Preview" : "Show Preview"}
                                    </button>
                                </div>

                                {showCodePreview && (
                                    <div className="relative rounded-xl border border-[#333333] bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[11px] overflow-hidden shadow-xl group/code">
                                        {/* Editor Header Bar (VS Code Dark+ Window Titlebar) */}
                                        <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333333] text-[10px] text-[#cccccc]">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 inline-block" />
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 inline-block" />
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 inline-block" />
                                                </div>
                                                <span className="text-[#444444]">|</span>
                                                <span className="flex items-center gap-1.5 text-[#cccccc] font-medium">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#569cd6]"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                                    {activeTab === 'svg' ? 'icon.svg' : activeTab === 'nextjs' ? 'Icon.tsx' : 'Icon.vue'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-semibold uppercase font-mono px-1.5 py-0.5 rounded bg-[#37373d] text-[#cccccc]">
                                                    {activeTab === 'svg' ? 'XML' : activeTab === 'nextjs' ? 'TSX' : 'VUE'}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(getCodeSnippet(), 'Snippet')}
                                                    className="px-2 py-1 rounded hover:bg-[#37373d] text-[#cccccc] hover:text-white transition-colors cursor-pointer"
                                                    title="Copy Code"
                                                >
                                                    {copiedFormat === 'Snippet' ? (
                                                        <span className="text-[#4ec9b0] text-[10px] font-sans font-medium flex items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                            Copied
                                                        </span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Editor Content Area (VS Code Dark+ Body) */}
                                        <div className="p-3 max-h-[140px] overflow-y-auto leading-relaxed select-text font-mono scrollbar-thin text-[#d4d4d4] bg-[#1e1e1e]">
                                            <pre 
                                                className="whitespace-pre-wrap break-all text-[#d4d4d4]"
                                                dangerouslySetInnerHTML={{ __html: getHighlightedCodeHtml() }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Main Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={downloadFile}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-5 active:scale-[0.98] cursor-pointer shadow-xs"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                    Download
                                </button>
                                <button
                                    onClick={() => {
                                        copyToClipboard(getCodeSnippet(), 'Code');
                                    }}
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all h-11 px-5 active:scale-[0.98] cursor-pointer shadow-xs ${copiedFormat === 'Code' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                                >
                                    {copiedFormat === 'Code' ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                            Copy Code
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Direct to Project CLI Prompt */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Direct to Project</label>
                            <div className="flex items-center space-x-2">
                                <code className="relative rounded-full bg-muted px-4 font-mono text-sm flex-1 text-foreground border border-border flex items-center h-11 overflow-x-auto">
                                    {getCliCommand()}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(getCliCommand(), 'CLI')}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-11 shrink-0 active:scale-[0.98] cursor-pointer"
                                >
                                    {copiedFormat === 'CLI' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer (Mobile Only UX) */}
                <div className="w-full px-6 mt-4 md:hidden">
                    <button 
                        onClick={onClose} 
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all hover:bg-muted hover:text-foreground text-muted-foreground h-11 px-4 border border-border/50 active:scale-[0.98] cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
