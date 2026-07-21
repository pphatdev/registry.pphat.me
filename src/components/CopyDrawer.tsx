"use client";

import React, { useState, useEffect, useRef } from "react";

interface CopyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    icon: any | null;
    size: number;
    strokeWidth: number;
    color: string;
}

export default function CopyDrawer({ isOpen, onClose, icon, size, strokeWidth, color }: CopyDrawerProps) {
    const [renderedIcon, setRenderedIcon] = useState<any | null>(null);
    const [svgContent, setSvgContent] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'svg' | 'nextjs' | 'nuxtjs'>('svg');
    const [isVisible, setIsVisible] = useState(false);

    // Keep the drawer mounted, use isVisible for transitions
    useEffect(() => {
        if (isOpen) {
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

    const getJsx = () => {
        let svg = getCustomizedSvg();
        svg = svg
            .replace(/stroke-width=/g, "strokeWidth=")
            .replace(/stroke-linecap=/g, "strokeLinecap=")
            .replace(/stroke-linejoin=/g, "strokeLinejoin=")
            .replace(/fill-rule=/g, "fillRule=")
            .replace(/clip-rule=/g, "clipRule=")
            .replace(/class=/g, "className=");
        return svg;
    };

    const getVue = () => {
        let svg = getCustomizedSvg();
        return `<template>\n  ${svg}\n</template>`;
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
        let content = "";
        let extension = "";
        let mimeType = "";
        
        if (activeTab === 'svg') {
            content = getCustomizedSvg();
            extension = "svg";
            mimeType = "image/svg+xml";
        } else if (activeTab === 'nextjs') {
            const componentName = (renderedIcon?.name || 'Icon').replace(/(^\w|-\w)/g, (clearAndUpper: string) => clearAndUpper.replace(/-/, "").toUpperCase());
            content = `export default function ${componentName}Icon(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${getJsx().replace('<svg ', '<svg {...props} ')}\n  );\n}`;
            extension = "tsx";
            mimeType = "text/typescript";
        } else if (activeTab === 'nuxtjs') {
            content = getVue();
            extension = "vue";
            mimeType = "text/plain";
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${renderedIcon?.name || 'icon'}.${extension}`;
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
        if (target.closest('button') || target.closest('code') || target.closest('a')) return;
        
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

    return (
        <div className={`fixed inset-0 z-50 flex flex-col justify-end ${isVisible ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`relative z-10 bg-background border-t border-border rounded-t-[10px] flex flex-col items-center w-full pb-6 touch-none`}
                style={{
                    transform: isVisible ? `translateY(${isDragging && dragY > 0 ? dragY : 0}px)` : "translateY(100%)",
                    transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)"
                }}
            >
                {/* Swipe Handle */}
                <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted cursor-pointer" onClick={onClose} />

                {/* Top Right Close Button (Desktop UX) */}
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-50 hidden md:flex"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>

                <div className="w-full max-w-5xl mx-auto p-4 pb-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    
                    {/* Left Column: Header and Icon Display */}
                    <div className="flex flex-col w-full">
                        {/* Header */}
                        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6 mt-4 md:mt-0">
                            <h2 className="text-lg font-semibold leading-none tracking-tight capitalize">{renderedIcon?.name || "Icon"}</h2>
                            <p className="text-sm text-muted-foreground">Select a format to copy to your clipboard.</p>
                        </div>

                        {/* Visual Icon Display */}
                        <div className="flex items-center justify-center min-h-80 h-96 w-full rounded-md border border-border bg-muted/20 mb-6 md:mb-0 md:flex-1">
                            {loading ? (
                                <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                            ) : (
                                <div 
                                    style={{ color: color }}
                                    dangerouslySetInnerHTML={{ __html: getCustomizedSvg() }}
                                    className="flex items-center justify-center scale-[1.5]"
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Column: Tabs and Actions */}
                    <div className="flex flex-col w-full justify-center md:pt-4">
                        {/* Tabs Selector */}
                        <div className="inline-flex h-11 items-center justify-center rounded-full bg-muted p-1 text-muted-foreground w-full mb-4">
                            {['svg', 'nextjs', 'nuxtjs'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all w-full h-full ${
                                        activeTab === tab 
                                            ? 'bg-background dark:bg-muted-foreground/25 text-foreground shadow' 
                                            : 'hover:bg-muted/80 hover:text-foreground'
                                    }`}
                                >
                                    {tab === 'svg' ? 'SVG' : tab === 'nextjs' ? 'Next.js' : 'NuxtJS'}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content (Actions) */}
                        <div className="w-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200" key={activeTab}>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={downloadFile}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                    Download
                                </button>
                                <button
                                    onClick={() => {
                                        if (activeTab === 'svg') copyToClipboard(getCustomizedSvg(), 'Code');
                                        else if (activeTab === 'nextjs') copyToClipboard(getJsx(), 'Code');
                                        else if (activeTab === 'nuxtjs') copyToClipboard(getVue(), 'Code');
                                    }}
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors h-10 px-4 py-2 ${copiedFormat === 'Code' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                                >
                                    {copiedFormat === 'Code' ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                            Copy Code
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            <div className="flex flex-col space-y-2 mt-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Direct to Project</label>
                                <div className="flex items-center space-x-2">
                                    <code className="relative rounded-full bg-muted px-4 py-[0.55rem] font-mono text-sm flex-1 text-foreground border border-border flex items-center h-[42px]">
                                        {getCliCommand()}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(getCliCommand(), 'CLI')}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-[42px] w-[42px] shrink-0"
                                    >
                                        {copiedFormat === 'CLI' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer (Mobile Only UX) */}
                <div className="w-full px-4 mt-6 md:hidden">
                    <button 
                        onClick={onClose} 
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors hover:bg-muted hover:text-foreground text-muted-foreground h-10 px-4 py-2 border border-border/50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
