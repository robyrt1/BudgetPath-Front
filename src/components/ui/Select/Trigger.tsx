import React from "react";
import { useSelect } from "./Root";

interface TriggerProps {
    displayValue?: string;
}

export const Trigger: React.FC<TriggerProps> = ({ displayValue }) => {
    const { isOpen, setIsOpen, placeholder, value } = useSelect();

    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer text-left"
        >
            <span className={displayValue || value ? "text-slate-200" : "text-slate-400"}>
                {displayValue || value || placeholder}
            </span>
            <span className="text-xs text-slate-400 pointer-events-none ml-2">▼</span>
        </button>
    );
};

export default Trigger;
