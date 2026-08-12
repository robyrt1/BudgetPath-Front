import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => {
    return (
        <label
            className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
