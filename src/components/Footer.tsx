export default function Footer() {
    return (
        <footer className="border-t border-border bg-background/70 backdrop-blur-md mt-20 relative z-10">
            <div className="container mx-auto max-w-5xl px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <div className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
                        Icon
                    </div>
                    <p className="text-sm text-muted-foreground">
                        A premium demo icon concept designed for pphat.me.
                    </p>
                </div>

                <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                    <a href="https://pphat.me" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">About</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
}
