import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    variable: "--font-sans",
    subsets: ["latin"],
});

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
    title: "Icon | Premium Design",
    description: "A premium demo icon library built with Next.js and Tailwind CSS",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${poppins.variable} h-full scroll-smooth antialiased`}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head />
            <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300 relative">
                <ThemeProvider>
                    <div className="fixed inset-0 pointer-events-none -z-20 h-full w-full bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--background))_90%),radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--primary)/0.15)_100%)]"></div>
                    <div className="fixed inset-0 pointer-events-none -z-10 h-full w-full bg-[radial-gradient(hsl(var(--foreground)/0.15)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    
                    <Header />
                    <div className="flex-1 flex flex-col relative">
                        {children}
                    </div>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
