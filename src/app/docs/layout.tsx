import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative pt-24 pb-16 min-h-screen overflow-x-clip">
            {/* Background Ambient Glows */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden select-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen animate-pulse-slow" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 w-full flex flex-col md:flex-row gap-10">
                <DocsSidebar />
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
