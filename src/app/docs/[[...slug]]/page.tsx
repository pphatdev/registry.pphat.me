import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import CopyCode from "@/components/CopyCode";

const components = {
    CopyCode,
    h1: (props: any) => <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400" {...props} />,
    h2: (props: any) => <h2 className="scroll-m-20 border-b border-border/50 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0 mt-12 mb-6 text-foreground" {...props} />,
    h3: (props: any) => <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4 text-foreground" {...props} />,
    p: (props: any) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground/90 text-[15px]" {...props} />,
    a: (props: any) => <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" {...props} />,
    blockquote: (props: any) => <blockquote className="mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground bg-muted/30 py-3 rounded-r-lg" {...props} />,
    ul: (props: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground/90 text-[15px] marker:text-primary/70" {...props} />,
    ol: (props: any) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground/90 text-[15px] marker:text-primary/70" {...props} />,
    li: (props: any) => <li className="pl-1" {...props} />,
    code: (props: any) => {
        if (props.className?.includes('language-')) {
            return <code className={props.className} {...props} />;
        }
        return <code className="relative rounded bg-primary/10 px-[0.4rem] py-[0.2rem] font-mono text-[13px] font-medium text-primary" {...props} />;
    },
    pre: (props: any) => (
        <div className="relative mt-6 mb-6 rounded-xl overflow-hidden bg-muted/50 border border-border/50 shadow-xl shadow-black/5 dark:shadow-black/20">
            <div className="flex items-center px-4 py-2 border-b border-border/50 bg-muted">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/20"></div>
                </div>
            </div>
            <pre className="p-4 overflow-x-auto text-[14px] text-foreground font-mono leading-relaxed" {...props} />
        </div>
    ),
    hr: (props: any) => <hr className="my-10 border-border/50" {...props} />,
    table: (props: any) => (
        <div className="my-6 w-full overflow-x-auto rounded-xl border border-border/50 shadow-sm">
            <table className="w-full text-sm" {...props} />
        </div>
    ),
    th: (props: any) => <th className="border-b border-border/50 bg-muted/50 px-4 py-3.5 text-left font-semibold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />,
    td: (props: any) => <td className="border-b border-border/50 px-4 py-3 text-left [&[align=center]]:text-center [&[align=right]]:text-right text-muted-foreground" {...props} />,
};

export default async function DocsPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug ? resolvedParams.slug.join("/") : "index";
    
    const contentPath = path.join(process.cwd(), "content", "docs", `${slug}.mdx`);
    
    if (!fs.existsSync(contentPath)) {
        notFound();
    }

    const source = fs.readFileSync(contentPath, "utf8");

    return (
        <div className="animate-[fade-up_0.5s_forwards] max-w-3xl pb-20">
            <div className="max-w-none">
                <MDXRemote source={source} components={components} />
            </div>
        </div>
    );
}
