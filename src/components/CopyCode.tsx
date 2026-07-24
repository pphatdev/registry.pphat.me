"use client";

import React, { useState } from "react";

export default function CopyCode({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <div 
            onClick={handleCopy}
            className="flex items-center w-full justify-start gap-3 bg-background border mt-7 border-border p-2 pl-5 rounded-xl w-full max-w-md mx-auto group hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98] hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]"
        >
            <span className="text-primary font-mono select-none font-bold">❯</span>
            <code className="text-foreground text-sm font-mono flex-1 text-left overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {code}
            </code>
            <button
                title="Copy to clipboard"
                className="p-2.5 bg-muted group-hover:bg-muted/80 rounded-lg transition-colors border border-transparent text-muted-foreground group-hover:text-foreground shrink-0 pointer-events-none"
            >
                {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                )}
            </button>
        </div>
    );
}
