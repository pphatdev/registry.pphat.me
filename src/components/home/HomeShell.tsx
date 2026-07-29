"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { InteractivePlayground } from "@/components/home/InteractivePlayground";
import { FaqSection } from "@/components/home/FaqSection";
import type { BlogPostMeta } from "@/lib/blog-format";

export default function HomeShell({ latestPost }: { latestPost: BlogPostMeta | null }) {
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
    const [heroPkgManager, setHeroPkgManager] = useState<"npm" | "pnpm" | "bun">("npm");

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCommand(id);
            setTimeout(() => setCopiedCommand(null), 12000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <main className="flex-1 w-full flex flex-col gap-0">
            <HeroSection
                heroPkgManager={heroPkgManager}
                setHeroPkgManager={setHeroPkgManager}
                copyToClipboard={copyToClipboard}
                copiedCommand={copiedCommand}
                latestPost={latestPost}
            />

            <FeaturedSection
                copyToClipboard={copyToClipboard}
                copiedCommand={copiedCommand}
            />

            <InteractivePlayground
                copyToClipboard={copyToClipboard}
                copiedCommand={copiedCommand}
            />

            <FaqSection />
        </main>
    );
}
