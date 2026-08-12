import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Header = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn("[&_tr]:border-b border-white/5", className)} {...props} />
    )
);
Header.displayName = "TableHeader";
export default Header;
