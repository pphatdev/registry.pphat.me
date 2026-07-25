import { redirect } from "next/navigation";
import { Metadata } from "next";

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
    redirect("https://icons.pphat.me");
}
