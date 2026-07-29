import React from "react";
import CopyCode from "@/components/CopyCode";

export const mdxComponents = {
    CopyCode,
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-foreground" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2 className="scroll-m-20 border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0 mt-10 mb-4 text-foreground" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4 text-foreground" {...props} />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="leading-7 not-first:mt-6 text-muted-foreground font-sans" {...props} />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" {...props} />
    ),
    blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
        <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground font-sans" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground font-sans" {...props} />
    ),
    li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li className="pl-1" {...props} />,
    code: (props: React.HTMLAttributes<HTMLElement>) => {
        if (props.className?.includes("language-")) {
            return <code className={props.className} {...props} />;
        }
        return <code className="relative rounded bg-muted/60 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground border border-border/40" {...props} />;
    },
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
        <div className="relative mt-6 mb-6 rounded-none overflow-hidden bg-[#09090b] border border-border/40 shadow-sm font-mono">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-[#18181b] text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-none bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-none bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-none bg-[#27c93f]" />
                </div>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-zinc-50 font-mono leading-relaxed select-text scrollbar-none" {...props} />
        </div>
    ),
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-8 border-border/40" {...props} />,
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className="w-full text-sm font-sans" {...props} />
        </div>
    ),
    tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="m-0 border-t border-border/40 p-0 even:bg-muted/20" {...props} />,
    th: (props: React.HTMLAttributes<HTMLTableCellElement>) => <th className="border border-border/40 px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right text-foreground" {...props} />,
    td: (props: React.HTMLAttributes<HTMLTableCellElement>) => <td className="border border-border/40 px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right text-muted-foreground" {...props} />,
};

export default function MdxContent() {
    return null;
}
