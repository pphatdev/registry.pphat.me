import React from "react";

interface FramedContainerProps {
    children: React.ReactNode;
    className?: string;
}

function CornerMark({ position }: { position: string }) {
    return (
        <span aria-hidden className={`absolute w-3 h-3 text-border ${position}`}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 0v12M0 6h12" />
            </svg>
        </span>
    );
}

/**
 * Tailwind-style container frame with vertical rails, top/bottom lines,
 * and + markers at each corner intersection.
 */
export function FramedContainer({ children, className = "" }: FramedContainerProps) {
    return (
        <div className={`relative border-x border-border/60 px-4 sm:px-8 md:px-12 py-10 md:py-12 ${className}`}>
            <CornerMark position="-top-1.5 -left-1.5" />
            <CornerMark position="-top-1.5 -right-1.5" />
            <CornerMark position="-bottom-1.5 -left-1.5" />
            <CornerMark position="-bottom-1.5 -right-1.5" />
            <div aria-hidden className="absolute top-0 left-0 right-0 h-px border-t border-border/60" />
            <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px border-t border-border/60" />
            {children}
        </div>
    );
}
