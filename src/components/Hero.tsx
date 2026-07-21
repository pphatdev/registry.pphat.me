import CopyCode from "./CopyCode";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-24 md:pb-32 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                
                {/* Ripple effect rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/20 animate-ripple"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-primary/10 animate-ripple" style={{ animationDelay: "1s" }}></div>
                
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Text content */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left animate-[fade-up_0.8s_ease-out_forwards]">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-sm text-primary font-medium bg-primary/10 rounded-full mb-8 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.15)] backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            v1.0.0 Now Available
                        </div>

                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                            Lightning Fast <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Component Registry</span>
                        </h1>

                        <div className="space-y-4 mb-10 max-w-xl">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                A powerful CLI tool to instantly download custom UI components and icons directly into your codebase.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Fetch exactly what you need on-demand. Output as raw SVGs, or ready-to-use Next.js & Nuxt components.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                            <Link href="/docs/installation" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:-translate-y-1 shadow-[0_0_25px_rgba(var(--primary),0.4)] text-center">
                                Get Started
                            </Link>
                            <a href="https://github.com/pphatdev/registry" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-muted text-foreground font-semibold hover:bg-muted/80 transition-all flex items-center justify-center gap-2 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5.6 3.35 6.6 6.5 7a4.8 4.8 0 0 0-1 3.03V22"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>
                                Star on GitHub
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Interactive Terminal Mockup */}
                    <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto animate-[fade-up_1s_ease-out_forwards] relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 via-sky-500/20 to-emerald-500/50 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-[#0d1117] rounded-xl border border-border/50 shadow-2xl overflow-hidden flex flex-col h-[320px]">
                            {/* Window Header */}
                            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#161b22]">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="mx-auto text-xs font-mono text-muted-foreground select-none">bash - @pphatdev/registry</div>
                            </div>
                            
                            {/* Terminal Body */}
                            <div className="p-5 font-mono text-[13px] overflow-hidden flex-1 text-gray-300 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-400">~/project</span>
                                    <span className="text-blue-400">❯</span>
                                    <span className="text-white">npm install -g @pphatdev/registry</span>
                                </div>
                                <div className="animate-[fade-up_0.5s_1s_forwards] opacity-0 text-gray-400">
                                    added 32 packages in <span className="text-white">1.4s</span>
                                </div>
                                
                                <div className="animate-[fade-up_0.5s_1.5s_forwards] opacity-0 flex items-center gap-2 mt-2">
                                    <span className="text-emerald-400">~/project</span>
                                    <span className="text-blue-400">❯</span>
                                    <span className="text-white">pphat init</span>
                                </div>
                                <div className="animate-[fade-up_0.5s_2s_forwards] opacity-0 text-gray-400">
                                    ✔ Configuration saved! 🚀
                                </div>

                                <div className="animate-[fade-up_0.5s_2.5s_forwards] opacity-0 flex items-center gap-2 mt-2">
                                    <span className="text-emerald-400">~/project</span>
                                    <span className="text-blue-400">❯</span>
                                    <span className="text-white">pphat add icons/brands/github -f nextjs</span>
                                </div>
                                <div className="animate-[fade-up_0.5s_3s_forwards] opacity-0 text-gray-400">
                                    Downloading <span className="text-white">github.tsx</span>...
                                </div>
                                <div className="animate-[fade-up_0.5s_3.5s_forwards] opacity-0 text-emerald-400 font-bold">
                                    ✔ Added successfully!
                                </div>
                                
                                <div className="animate-[fade-up_0.5s_4s_forwards] opacity-0 flex items-center gap-2 mt-2">
                                    <span className="text-emerald-400">~/project</span>
                                    <span className="text-blue-400">❯</span>
                                    <span className="animate-[blink_1s_infinite] w-2 h-4 bg-gray-400 inline-block align-middle"></span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating quick copy */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[90%] z-20 transition-transform duration-300">
                            <CopyCode code="npm install @pphatdev/registry -g" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
