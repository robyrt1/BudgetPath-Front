import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Cell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={cn(
                "p-4 align-middle [&:has([role=checkbox])]:pr-0",
                className
            )}
            {...props}
        />
    )
);
Cell.displayName = "TableCell";
export default Cell;
