import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-mono",
});

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://registry.pphat.me"),
    title: {
        default: "@pphatdev/registry • Component & Icon Registry",
        template: "%s | @pphatdev/registry",
    },
    description: "Enterprise component and vector icon registry CLI for company frontend projects",
    keywords: ["react", "nextjs", "icons", "components", "registry", "cli", "frontend"],
    authors: [{ name: "Sophat LEAT (pphat)", url: "https://pphat.me" }],
    creator: "Sophat LEAT (pphat)",
    publisher: "pphat",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://pphat.me",
        title: "@pphatdev/registry • Component & Icon Registry",
        description: "Enterprise component and vector icon registry CLI for company frontend projects",
        siteName: "pphatdev registry",
        images: [
            {
                url: "/cover.png",
                width: 1200,
                height: 630,
                alt: "@pphatdev/registry cover image",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "@pphatdev/registry • Component & Icon Registry",
        description: "Enterprise component and vector icon registry CLI for company frontend projects",
        creator: "@pphatdev",
        images: ["/cover.png"],
    },
    icons: {
        icon: [
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/site.webmanifest",
};

const author = {
    "@type": "Person",
    name: "Sophat LEAT (PPhat)",
    url: "https://pphat.me",
    image: "https://pphat.me/assets/avatars/krate-1.webp",
} as const;

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://registry.pphat.me/#website",
            name: "@pphatdev/registry",
            url: "https://registry.pphat.me",
            dateCreated: "2026-07-18",
            author,
            inLanguage: "en",
        },
        {
            "@type": "SoftwareApplication",
            "@id": "https://registry.pphat.me/#app",
            name: "@pphatdev/registry",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Cross-platform",
            description:
                "Enterprise component and vector icon registry CLI for company frontend projects.",
            url: "https://registry.pphat.me",
            downloadUrl: "https://www.npmjs.com/package/@pphatdev/registry",
            softwareVersion: "1.2.0",
            datePublished: "2026-07-18",
            author,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
            },
            license: "https://opensource.org/licenses/MIT",
            codeRepository: "https://github.com/pphatdev/registry.pphat.me",
            programmingLanguage: ["TypeScript", "React"],
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${jakarta.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                    }}
                />
            </head>
            <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300 relative">
                <ThemeProvider>
                    <div className="fixed inset-0 pointer-events-none -z-20 h-full w-full bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--background))_90%),radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--primary)/0.15)_100%)]"></div>
                    <div className="fixed inset-0 pointer-events-none -z-10 h-full w-full bg-[radial-gradient(hsl(var(--foreground)/0.15)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    
                    <Header />
                    <div className="flex-1 flex flex-col relative pt-20 md:pt-24">
                        {children}
                    </div>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
