import React from "react";

export interface DocItem {
    title: string;
    href: string;
    slug: string;
    icon: React.ReactNode;
}

export interface DocGroup {
    title: string;
    icon: React.ReactNode;
    items: DocItem[];
}

export const DOCS_CONFIG: DocGroup[] = [
    {
        title: "Why @pphatdev/registry",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
            </svg>
        ),
        items: [
            {
                title: "Introduction",
                href: "/docs",
                slug: "index",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                )
            },
            {
                title: "Installation",
                href: "/docs/installation",
                slug: "installation",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" x2="20" y1="19" y2="19" />
                    </svg>
                )
            },
            {
                title: "Configuration",
                href: "/docs/configuration",
                slug: "configuration",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" x2="20" y1="21" y2="21" />
                        <line x1="4" x2="20" y1="14" y2="14" />
                        <line x1="4" x2="20" y1="7" y2="7" />
                        <circle cx="8" cy="14" r="2" />
                        <circle cx="16" cy="7" r="2" />
                        <circle cx="12" cy="21" r="2" />
                    </svg>
                )
            },
            {
                title: "CLI Commands",
                href: "/docs/commands",
                slug: "commands",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" x2="20" y1="19" y2="19" />
                    </svg>
                )
            }
        ]
    },
    {
        title: "Icons",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
        ),
        items: [
            {
                title: "Using Icons",
                href: "/docs/icons/usage",
                slug: "icons/usage",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                )
            },
            {
                title: "Framework Guides",
                href: "/docs/icons/frameworks",
                slug: "icons/frameworks",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 22 22 22" />
                    </svg>
                )
            },
            {
                title: "Customization",
                href: "/docs/icons/customization",
                slug: "icons/customization",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                )
            }
        ]
    },
    {
        title: "Components",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
        ),
        items: [
            {
                title: "Component Basics",
                href: "/docs/components/basics",
                slug: "components/basics",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18" />
                        <path d="M3 12h18" />
                    </svg>
                )
            },
            {
                title: "Registry Blocks",
                href: "/docs/components/registry",
                slug: "components/registry",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7.5 4.27 9 5.15" />
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5" />
                        <path d="M12 22V12" />
                    </svg>
                )
            },
            {
                title: "Styling & Theming",
                href: "/docs/components/theming",
                slug: "components/theming",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m2 12 5.25-5.25" />
                        <path d="m7.25 17.25 3.5-3.5" />
                        <path d="m14 2 2.5 2.5" />
                        <path d="m19 7 2.5 2.5" />
                        <path d="m22 12-5.25 5.25" />
                        <path d="m16.75 6.75-3.5 3.5" />
                    </svg>
                )
            }
        ]
    }
];

export const FLAT_DOCS = DOCS_CONFIG.flatMap(group => group.items);
