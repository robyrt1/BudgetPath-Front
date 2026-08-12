import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Body = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
    )
);
Body.displayName = "TableBody";
export default Body;
