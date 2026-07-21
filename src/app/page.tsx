import Hero from "@/components/Hero";
import IconGrid from "@/components/IconGrid";

export default function Home() {
    return (
        <main className="flex-1 relative flex flex-col">
            <Hero />
            <IconGrid />
        </main>
    );
}
