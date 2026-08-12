import React from "react";
import { useSelect } from "./Root";

interface ContentProps {
    children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children }) => {
    const { isOpen } = useSelect();

    if (!isOpen) return null;

    return (
        <div className="absolute z-50 w-full mt-1.5 rounded-lg bg-slate-900 border border-slate-700 shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in duration-100">
            <div className="py-1">
                {children}
            </div>
        </div>
    );
};

export default Content;
