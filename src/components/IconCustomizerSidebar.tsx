"use client";

import React, { useState, useEffect } from "react";

interface IconCustomizerSidebarProps {
    icon: { svgContent?: string; target?: string; name?: string; [key: string]: unknown } | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function IconCustomizerSidebar({ icon, isOpen, onClose }: IconCustomizerSidebarProps) {
    const [size, setSize] = useState(48);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [color, setColor] = useState("#ffffff");
    
    const [svgContent, setSvgContent] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState<"svg" | "jsx" | null>(null);

    // Fetch or set SVG content when icon changes
    useEffect(() => {
        if (!icon) return;
        
        if (icon.svgContent) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSvgContent(icon.svgContent);
            return;
        }

        if (icon.target) {
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
    }, [icon]);

    // Customize the SVG string based on controls
    const getCustomizedSvg = () => {
        if (!svgContent) return "";
        let customized = svgContent;

        // Replace width and height
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

        // Replace stroke width
        if (customized.includes('stroke-width="')) {
            customized = customized.replace(/stroke-width="[^"]+"/, `stroke-width="${strokeWidth}"`);
        }

        // We use CSS color for the preview, so we don't necessarily modify the raw SVG color here unless copying.
        return customized;
    };

    const getFinalSvgForCopy = () => {
        let final = getCustomizedSvg();
        // Replace currentColor with the chosen hex color
        final = final.replace(/currentColor/g, color);
        return final;
    };

    const getJsxForCopy = () => {
        let svg = getFinalSvgForCopy();
        // Basic SVG to JSX conversion for common attributes
        svg = svg
            .replace(/stroke-width=/g, "strokeWidth=")
            .replace(/stroke-linecap=/g, "strokeLinecap=")
            .replace(/stroke-linejoin=/g, "strokeLinejoin=")
            .replace(/fill-rule=/g, "fillRule=")
            .replace(/clip-rule=/g, "clipRule=")
            .replace(/class=/g, "className=");
        return svg;
    };

    const handleCopy = async (type: "svg" | "jsx") => {
        const textToCopy = type === "svg" ? getFinalSvgForCopy() : getJsxForCopy();
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "absolute";
                textArea.style.left = "-999999px";
                document.body.prepend(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                } catch (error) {
                    console.error(error);
                } finally {
                    textArea.remove();
                }
            }
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar (Left Side) */}
            <div 
                className={`fixed top-0 left-0 h-full w-full max-w-sm bg-background border-r border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h3 className="text-xl font-semibold capitalize">{icon?.name || "Customize Icon"}</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Preview Area */}
                    <div className="flex items-center justify-center p-8 bg-muted/30 rounded-2xl border border-border/50 min-h-50">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                        ) : (
                            <div 
                                style={{ color: color }}
                                dangerouslySetInnerHTML={{ __html: getCustomizedSvg() }}
                                className="flex items-center justify-center transition-all duration-200"
                            />
                        )}
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        {/* Size Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-foreground">Size</label>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{size}px</span>
                            </div>
                            <input 
                                type="range" 
                                min="16" 
                                max="128" 
                                step="4"
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        {/* Stroke Width Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-foreground">Stroke Width</label>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{strokeWidth}px</span>
                            </div>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="3" 
                                step="0.25"
                                value={strokeWidth}
                                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        {/* Color Control */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground block">Color</label>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                    <input 
                                        type="color" 
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                                    />
                                </div>
                                <input 
                                    type="text" 
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                {["#ffffff", "#000000", "#3b82f6", "#ef4444", "#10b981", "#f59e0b"].map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setColor(preset)}
                                        className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform shadow-sm"
                                        style={{ backgroundColor: preset }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-muted/10 grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleCopy("svg")}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-background border border-border hover:bg-muted hover:border-muted-foreground/30 rounded-xl transition-all font-medium text-sm shadow-sm"
                    >
                        {copied === "svg" ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Copied SVG
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                                Copy SVG
                            </>
                        )}
                    </button>
                    <button 
                        onClick={() => handleCopy("jsx")}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all font-medium text-sm shadow-md"
                    >
                        {copied === "jsx" ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Copied JSX
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                                Copy JSX
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
