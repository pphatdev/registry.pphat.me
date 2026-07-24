import Hero from "@/components/Hero";
import IconGrid from "@/components/IconGrid";
import { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
    title: "Icon Studio",
    description: "Search, customize, and explore hundreds of enterprise-grade vector icons.",
    openGraph: {
        title: "Icon Studio | @pphatdev/registry",
        description: "Search, customize, and explore hundreds of enterprise-grade vector icons.",
        images: [
            {
                url: "/icons.png",
                width: 1200,
                height: 630,
                alt: "Icon Studio Preview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Icon Studio | @pphatdev/registry",
        description: "Search, customize, and explore hundreds of enterprise-grade vector icons.",
        images: ["/icons.png"],
    },
};

export default function Home() {
    return (
        <main className="flex-1 relative flex flex-col">
            <Hero />
            <IconGrid />
        </main>
    );
}
