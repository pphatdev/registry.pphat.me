import { Suspense } from "react";
import ClientIconGrid from "./ClientIconGrid";

const TELEMETRY_URL = process.env.NEXT_PUBLIC_TELEMETRY_URL
    ?? "https://pphat-telemetry.pphatdev.workers.dev";

// Fetch icons from the pphatdev/icons repository
async function fetchIcons() {
    try {
        const [brandsRes, regularRes] = await Promise.all([
            fetch("https://raw.githubusercontent.com/pphatdev/icons/main/brands.json", { next: { revalidate: 300 } } as unknown as RequestInit),
            fetch("https://raw.githubusercontent.com/pphatdev/icons/main/regular.json", { next: { revalidate: 300 } } as unknown as RequestInit).catch(() => null)
        ]);

        let allIcons: { name: string; svgContent?: string; target?: string; category?: string; [key: string]: unknown }[] = [];

        if (brandsRes.ok) {
            const brands = await brandsRes.json();
            allIcons = [...allIcons, ...brands.map((b: { name: string; svgContent?: string; target?: string; [key: string]: unknown }) => ({ ...b, category: 'Brands' }))];
        }

        if (regularRes && regularRes.ok) {
            const regular = await regularRes.json();
            allIcons = [...allIcons, ...regular.map((r: { name: string; svgContent?: string; target?: string; [key: string]: unknown }) => ({ ...r, category: 'Regular' }))];
        }

        return allIcons;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fetch top-100 popular icons from the telemetry worker so we can surface
// download counts in the CopyDrawer. Anything outside the top 100 shows no
// count — the API only exposes ranked slices, not per-item lookup.
async function fetchDownloadCounts(): Promise<Record<string, number>> {
    try {
        const res = await fetch(`${TELEMETRY_URL}/popular?type=icons&limit=100`, {
            next: { revalidate: 300 },
        } as unknown as RequestInit);
        if (!res.ok) return {};
        const payload = await res.json() as { rows?: [string, number][] };
        const rows = Array.isArray(payload.rows) ? payload.rows : [];
        return Object.fromEntries(rows);
    } catch (error) {
        console.error("Failed to fetch download counts", error);
        return {};
    }
}

export default async function IconGrid() {
    const [icons, downloadCounts] = await Promise.all([
        fetchIcons(),
        fetchDownloadCounts(),
    ]);

    return (
        <Suspense fallback={<div className="flex h-96 items-center justify-center text-muted-foreground animate-pulse font-mono text-sm">Loading icons engine...</div>}>
            <ClientIconGrid icons={icons} downloadCounts={downloadCounts} />
        </Suspense>
    );
}
