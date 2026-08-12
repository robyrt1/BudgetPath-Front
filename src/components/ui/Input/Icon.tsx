import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    position?: "left" | "right";
}

export const Icon: React.FC<IconProps> = ({ children, position = "left", className = "", ...props }) => {
    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none ${
                position === "left" ? "left-3" : "right-3"
            } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Icon;
