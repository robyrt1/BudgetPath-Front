import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";

export const Caption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    ({ className, ...props }, ref) => (
        <caption
            ref={ref}
            className={cn("mt-4 text-sm text-slate-500", className)}
            {...props}
        />
    )
);
Caption.displayName = "TableCaption";
export default Caption;
