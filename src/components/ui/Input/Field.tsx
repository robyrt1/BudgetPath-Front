import React, { forwardRef } from "react";

export type FieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Field = forwardRef<HTMLInputElement, FieldProps>(({ className = "", ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all ${className}`}
            {...props}
        />
    );
});

Field.displayName = "Input.Field";

export default Field;
