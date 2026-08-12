import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Root = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm text-left", className)}
            {...props}
        />
    )
);
Root.displayName = "Table";
export default Root;
