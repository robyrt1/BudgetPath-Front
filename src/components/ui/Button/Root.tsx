import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "icon";
}

export const Root = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
        
        const variants = {
            primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
            secondary: "bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10",
            outline: "border border-white/10 text-slate-300 hover:bg-white/5",
            ghost: "text-slate-400 hover:text-white hover:bg-white/5",
            danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20"
        };
        
        const sizes = {
            sm: "px-2 py-1 text-xs rounded",
            md: "px-4 py-2 text-sm rounded-lg",
            lg: "px-6 py-3 text-base rounded-xl",
            icon: "w-9 h-9 p-0 rounded-full"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Root.displayName = "Button";
export default Root;
