export default function Footer() {
    return (
        <footer className="relative w-full pb-16 pt-16 px-5 flex flex-col items-center overflow-hidden mt-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-2xl h-px bg-linear-to-r from-transparent via-border to-transparent" />
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-150 h-75 bg-primary/10 blur-[100px] rounded-[100%] pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="flex flex-col items-center group">
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-6 items-center">
                        {/* <a
                            href="https://www.npmjs.com/package/@pphatdev/registry"
                            target="_blank"
                            rel="noreferrer"
                            className="relative flex items-center gap-3 p-1.5 pr-5 rounded-full bg-background/50 border border-border/60 hover:bg-background/80 hover:border-primary/40 transition-all duration-300 backdrop-blur-xl shadow-xs"
                        >
                            <p className="text-xs text-muted-foreground absolute -top-5 left-4 font-medium">Verified</p>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-foreground leading-none flex items-center gap-1.5">NPM Provenance</span>
                                <span className="text-[11px] mt-1 text-muted-foreground">Provenance</span>
                            </div>
                        </a> */}

                        <a
                            href="https://pphat.me"
                            target="_blank"
                            rel="noreferrer"
                            className="relative flex items-center gap-3 p-1.5 pr-5 rounded-full bg-background/50 border border-border/60 hover:bg-background/80 hover:border-primary/40 transition-all duration-300 backdrop-blur-xl shadow-xs"
                        >
                            <p className="text-xs text-muted-foreground absolute -top-5 left-1/2 -translate-x-1/2 font-medium">Created by</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://github.com/pphatdev.png"
                                alt="PPhat"
                                className="w-10 h-10 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-foreground leading-none flex items-center gap-1.5">PPhat</span>
                                <span className="text-[11px] mt-1 text-muted-foreground">Senior Front End Developer</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
