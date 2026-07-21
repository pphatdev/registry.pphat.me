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
        <div className="flex items-center gap-3 bg-background/90 backdrop-blur-xl border border-border p-2 pl-5 rounded-2xl w-full max-w-md mx-auto group hover:border-primary/50 transition-colors shadow-lg">
            <span className="text-muted-foreground font-mono select-none">$</span>
            <code className="text-primary text-sm md:text-base font-mono flex-1 text-left">
                {code}
            </code>
            <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="p-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors border border-transparent text-muted-foreground hover:text-foreground shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                )}
            </button>
        </div>
    );
}
