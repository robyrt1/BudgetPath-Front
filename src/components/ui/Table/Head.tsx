import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Head = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                "h-10 px-4 text-left align-middle font-medium text-slate-400 [&:has([role=checkbox])]:pr-0 [&>[align=center]]:text-center",
                className
            )}
            {...props}
        />
    )
);
Head.displayName = "TableHead";
export default Head;
