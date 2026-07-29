import HomeShell from "@/components/home/HomeShell";
import { getAllPosts } from "@/lib/blog";

export default function RegistryHomePage() {
    const [latestPost] = getAllPosts();
    return <HomeShell latestPost={latestPost ?? null} />;
}
