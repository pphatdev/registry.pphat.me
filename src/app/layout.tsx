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
    title: "@pphatdev/registry • Component & Icon Registry",
    description: "Enterprise component and vector icon registry CLI for company frontend projects",
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
            <head />
            <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300 relative">
                <ThemeProvider>
                    <div className="fixed inset-0 pointer-events-none -z-20 h-full w-full bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--background))_90%),radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--primary)/0.15)_100%)]"></div>
                    <div className="fixed inset-0 pointer-events-none -z-10 h-full w-full bg-[radial-gradient(hsl(var(--foreground)/0.15)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    
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
