import CopyCode from "./CopyCode";

export default function Docs() {
    return (
        <section id="docs" className="py-24 relative bg-muted/10 border-t border-border">
            <div className="container mx-auto max-w-6xl px-4">
                
                <div className="text-center mb-16 animate-[fade-up_0.8s_ease-out_forwards]">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Why use the icon library?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Modern frontend development requires speed and efficiency. We built this tool to give you exactly what you need, nothing you don&apos;t.</p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 animate-[fade-up_1s_ease-out_forwards]">
                    
                    <div className="glass-panel p-8 rounded-none hover:border-teal-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-none bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 border border-border group-hover:border-teal-500/30 transition-colors text-teal-600 dark:text-teal-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Zero Bundle Bloat</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Don&apos;t import a massive library for 3 icons. Only download the exact components and SVGs you actively use in your codebase.
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-none hover:border-sky-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-none bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 border border-border group-hover:border-sky-500/30 transition-colors text-sky-600 dark:text-sky-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Powered by a robust static icon library hosted directly on GitHub&apos;s raw CDN. Enjoy instantaneous downloads with no rate limits.
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-none hover:border-purple-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-none bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 border border-border group-hover:border-purple-500/30 transition-colors text-purple-600 dark:text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Framework Native</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                SVGs are automatically wrapped and formatted into native <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">.tsx</code> (Next.js) or <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">.vue</code> (Nuxt) components on the fly.
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-none hover:border-emerald-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-none bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 border border-border group-hover:border-emerald-500/30 transition-colors text-emerald-600 dark:text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Perfect Code Formatting</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Built-in XML formatter aligns tags precisely, preserving nested CSS keyframes and attributes to guarantee lint-free output.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Quick Start Guide */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-black/5 dark:bg-white/5 rounded-noneborder border-border">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Quick Start Guide</h2>
                    </div>

                    <div className="relative border-l border-border ml-4 md:ml-6 pl-8 md:pl-12 py-4 space-y-16">
                        
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="absolute -left-10.25 md:-left-14.25 top-1 w-8 h-8 rounded-none bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-2">Install the CLI globally</h3>
                            <p className="text-muted-foreground mb-6">
                                Install the registry CLI tool globally on your machine to access it from anywhere without needing to use <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">npx</code> every time.
                            </p>
                            <div className="flex flex-col w-full justify-start mt-4 max-w-lg gap-3">
                                <CopyCode code="npm install -g @pphatdev/registry" />
                                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-noneborder border-border/50 flex gap-2 items-start mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    <p>
                                        <strong>Getting an EEXIST error?</strong> This happens if an old version&apos;s binary is stuck in your npm cache. Simply run <code className="text-orange-400 bg-orange-400/10 px-1 rounded font-mono">npm install -g @pphatdev/registry --force</code> to overwrite it.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="absolute -left-10.25 md:-left-14.25 top-1 w-8 h-8 rounded-none bg-muted border border-border text-foreground flex items-center justify-center font-bold text-sm">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-2">Initialize your project</h3>
                            <p className="text-muted-foreground mb-6">
                                Run the <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">init</code> command to set up your preferences. It will ask you where you want to save your items and what format you prefer (SVG, Next.js, or Nuxt.js).
                            </p>
                            <div className="flex w-full justify-start mt-4 max-w-lg">
                                <CopyCode code="pphat init" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="absolute -left-10.25 md:-left-14.25 top-1 w-8 h-8 rounded-none bg-muted border border-border text-foreground flex items-center justify-center font-bold text-sm">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-2">Add components & icons</h3>
                            <p className="text-muted-foreground mb-6">
                                Search for your desired items in the library and add them directly to your codebase. You can optionally force a specific format using the <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">-f</code> flag.
                            </p>
                            <div className="flex flex-col w-full justify-start mt-4 max-w-lg gap-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2 font-medium">Install icons format:</p>
                                    <CopyCode code="pphat add <iconname> -f <format>" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2 font-medium">Example:</p>
                                    <CopyCode code="pphat add icons/brands/github -f nextjs" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
