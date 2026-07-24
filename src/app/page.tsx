"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { InteractivePlayground } from "@/components/home/InteractivePlayground";

export default function RegistryHomePage() {
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
    const [heroPkgManager, setHeroPkgManager] = useState<'npm' | 'pnpm' | 'bun'>('npm');

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
            {/* HERO SECTION */}
            <HeroSection
                heroPkgManager={heroPkgManager}
                setHeroPkgManager={setHeroPkgManager}
                copyToClipboard={copyToClipboard}
                copiedCommand={copiedCommand}
            />

            {/* FEATURED ASSETS SECTION */}
            <FeaturedSection
                copyToClipboard={copyToClipboard}
                copiedCommand={copiedCommand}
            />

            {/* DEDICATED INTERACTIVE PLAYGROUND SECTION */}
            <InteractivePlayground
                copyToClipboard={copyToClipboard}
                copiedCommand={copiedCommand}
            />
        </main>
    );
}
