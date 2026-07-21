import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex flex-col md:flex-row gap-8 py-10">
            <DocsSidebar />
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
