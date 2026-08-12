import React from "react";
import { useSelect } from "./Root";

interface ContentProps {
    children: React.ReactNode;
    className?: string;
    direction?: "up" | "down";
}

export const Content: React.FC<ContentProps> = ({ children, className = "", direction = "down" }) => {
    const { isOpen } = useSelect();

    if (!isOpen) return null;

    const directionClasses = direction === "up" ? "bottom-full mb-1.5" : "mt-1.5";

    return (
        <div className={`absolute z-50 w-full rounded-lg bg-slate-900 border border-slate-700 shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in duration-100 ${directionClasses} ${className}`}>
            <div className="py-1">
                {children}
            </div>
        </div>
    );
};

export default Content;
