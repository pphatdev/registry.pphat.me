"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FramedContainer } from "./FramedContainer";

type Faq = { question: string; answer: string };

const homepageFaqs: Faq[] = [
    {
        question: "How do I install @pphatdev/registry?",
        answer:
            "You don't need to install anything permanently. Run the CLI directly with `npx pphat init` to create a `pphatdev.json` config, then `npx pphat add-icon <name>` to fetch what you need. If you use it often, `npm install -g @pphatdev/registry`.",
    },
    {
        question: "Which frameworks are supported?",
        answer:
            "Three output formats: React / Next.js as `.tsx` files, Vue / Nuxt as `.vue` single-file components, and raw `.svg` for framework-agnostic use.",
    },
    {
        question: "How do I add an icon to my project?",
        answer:
            "Run `npx pphat add-icon <name>` in your project root — for example, `npx pphat add-icon react vue github`. Override the format with `-f nextjs|nuxtjs|svg` and the destination with `-d <path>`.",
    },
    {
        question: "Where do the icons and components come from?",
        answer:
            "They're fetched on demand from the public GitHub repositories `pphatdev/icons` and `pphatdev/components` via `raw.githubusercontent.com`. No proprietary server, no rate-limited API — just a CDN.",
    },
    {
        question: "Is @pphatdev/registry free?",
        answer:
            "Yes. Open source under the MIT license. No account, no API key, no subscription.",
    },
];

function renderAnswer(text: string) {
    const parts = text.split("`");
    return parts.map((part, i) =>
        i % 2 === 1 ? (
            <code
                key={i}
                className="px-1.5 py-0.5 mx-0.5 rounded-none bg-muted/70 font-mono text-[11.5px] text-foreground border border-border/40 whitespace-nowrap"
            >
                {part}
            </code>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        )
    );
}

export function FaqSection() {
    const [openIds, setOpenIds] = useState<Set<number>>(new Set([0]));

    const toggle = (i: number) => {
        setOpenIds(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-muted/30 dark:bg-muted/20">
            {/* Diagonal color wash — "reading surface" */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none -z-10 bg-linear-to-br from-primary/8 via-transparent to-emerald-500/8"
            />
            {/* Top / bottom fade for smooth section join */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-24 pointer-events-none -z-10 bg-linear-to-b from-background to-transparent" />
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/10 rounded-none blur-[120px] opacity-40" />
            </div>

            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <FramedContainer>
                <div className="flex flex-col gap-10">

                    {/* SECTION HEADER */}
                    <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs text-primary font-bold font-mono bg-primary/10 rounded-none border border-primary/20 shadow-xs backdrop-blur-md">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-none h-1.5 w-1.5 bg-primary" />
                            </span>
                            FAQ
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground">
                            Everything you need to{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-teal-300">
                                know.
                            </span>
                        </h2>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl opacity-90">
                            Quick answers to the questions we hear most. Missing yours? Head to the full FAQ page below.
                        </p>
                    </div>

                    {/* ACCORDION */}
                    <div className="flex flex-col gap-3">
                        {homepageFaqs.map((f, i) => {
                            const isOpen = openIds.has(i);
                            const panelId = `faq-panel-${i}`;
                            const btnId = `faq-btn-${i}`;
                            return (
                                <div
                                    key={i}
                                    className={`group relative rounded-none glass-panel overflow-hidden transition-all duration-300 ${
                                        isOpen
                                            ? 'border-primary/40'
                                            : 'border-border/40 hover:border-primary/40 hover:-translate-y-0.5'
                                    }`}
                                >
                                    {/* Ambient corner glow — visible when open or on hover */}
                                    <div
                                        aria-hidden
                                        className={`pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-none bg-linear-to-br from-primary/25 to-transparent blur-3xl transition-opacity duration-500 ${
                                            isOpen ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'
                                        }`}
                                    />

                                    {/* Left accent bar */}
                                    <div
                                        aria-hidden
                                        className={`pointer-events-none absolute left-0 top-3 bottom-3 w-0.5 rounded-none bg-primary transition-all duration-300 ${
                                            isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                                        }`}
                                    />

                                    {/* Top shimmer line (only on hover, closed) */}
                                    <div
                                        aria-hidden
                                        className={`pointer-events-none absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent transition-opacity duration-500 ${
                                            isOpen ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                    />

                                    <button
                                        id={btnId}
                                        onClick={() => toggle(i)}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        className="relative w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
                                    >
                                        <span
                                            className={`text-sm sm:text-base font-bold leading-snug transition-colors duration-300 ${
                                                isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'
                                            }`}
                                        >
                                            {f.question}
                                        </span>
                                        <span
                                            aria-hidden
                                            className={`shrink-0 p-1.5 rounded-none text-primary transition-all duration-300 ${
                                                isOpen
                                                    ? 'bg-primary/20 border border-primary/40 rotate-45 scale-110'
                                                    : 'bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:rotate-90 group-hover:scale-110'
                                            }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 5v14" />
                                                <path d="M5 12h14" />
                                            </svg>
                                        </span>
                                    </button>

                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={btnId}
                                        aria-hidden={!isOpen}
                                        className="grid transition-[grid-template-rows] duration-300 ease-out"
                                        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                                    >
                                        <div className="overflow-hidden">
                                            <p className={`px-5 pb-5 text-sm text-muted-foreground leading-relaxed transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-100' : 'opacity-0'}`}>
                                                {renderAnswer(f.answer)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CLOSING CTA */}
                    <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-none glass-panel border-border/40">
                        <div className="flex flex-col gap-1 min-w-0 text-center sm:text-left">
                            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                                Still curious?
                            </span>
                            <p className="text-sm font-medium text-foreground">
                                Explore the full list of common questions.
                            </p>
                        </div>

                        <Link
                            href="/faq"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-primary text-primary-foreground text-xs font-mono font-bold hover:bg-primary/90 transition-colors shrink-0 shadow-xs"
                        >
                            See all FAQs
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                </div>
                </FramedContainer>
            </div>
        </section>
    );
}
