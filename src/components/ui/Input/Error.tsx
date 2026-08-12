import React from "react";

interface ErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: React.ReactNode;
}

export const Error: React.FC<ErrorProps> = ({ children, className = "", ...props }) => {
    if (!children) return null;

    return (
        <p
            className={`text-xs text-rose-400 mt-1 ${className}`}
            {...props}
        >
            {children}
        </p>
    );
};

export default Error;
