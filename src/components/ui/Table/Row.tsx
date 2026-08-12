import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Row = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                "border-b border-white/5 transition-colors hover:bg-white/[0.03] data-[state=selected]:bg-slate-800",
                className
            )}
            {...props}
        />
    )
);
Row.displayName = "TableRow";
export default Row;
