import React from "react";

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Root: React.FC<RootProps> = ({ children, className = "", ...props }) => {
    return (
        <div className={`flex flex-col gap-1 w-full ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Root;
