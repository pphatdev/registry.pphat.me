"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Suppress the React 19 "script tag" warning from next-themes
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            const orig = console.error;
            console.error = (...args: unknown[]) => {
                if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
                    return;
                }
                orig.apply(console, args as never[]);
            };
            return () => {
                console.error = orig;
            };
        }
    }, []);

    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemesProvider>
    );
}
