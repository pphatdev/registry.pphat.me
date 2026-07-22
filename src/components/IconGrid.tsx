import ClientIconGrid from "./ClientIconGrid";

// Fetch icons from the pphatdev/icons repository
async function fetchIcons() {
    try {
        const [brandsRes, regularRes] = await Promise.all([
            fetch("https://raw.githubusercontent.com/pphatdev/icons/main/brands.json", { next: { revalidate: 3600 } }),
            fetch("https://raw.githubusercontent.com/pphatdev/icons/main/regular.json", { next: { revalidate: 3600 } }).catch(() => null)
        ]);
        
        let allIcons: any[] = [];

        if (brandsRes.ok) {
            const brands = await brandsRes.json();
            allIcons = [...allIcons, ...brands.map((b: any) => ({ ...b, category: 'Brands' }))];
        }

        if (regularRes && regularRes.ok) {
            const regular = await regularRes.json();
            allIcons = [...allIcons, ...regular.map((r: any) => ({ ...r, category: 'Regular' }))];
        }

        return allIcons;
    } catch (error) {
        console.error(error);
        return [];
    }
}

import { Suspense } from "react";

export default async function IconGrid() {
    const icons = await fetchIcons();

    return (
        <Suspense fallback={<div className="flex h-96 items-center justify-center text-muted-foreground animate-pulse font-mono text-sm">Loading icons engine...</div>}>
            <ClientIconGrid icons={icons} />
        </Suspense>
    );
}
