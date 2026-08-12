import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Footer = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tfoot
            ref={ref}
            className={cn("border-t border-white/5 bg-slate-900/50 font-medium [&>tr]:last:border-b-0", className)}
            {...props}
        />
    )
);
Footer.displayName = "TableFooter";
export default Footer;
