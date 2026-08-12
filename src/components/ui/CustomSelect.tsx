import React, { useState, useRef, useEffect } from "react";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer text-left"
            >
                <span className={selectedOption ? "text-slate-200" : "text-slate-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="text-xs text-slate-400 pointer-events-none ml-2">▼</span>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 rounded-lg bg-slate-900 border border-slate-700 shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in duration-100">
                    <div className="py-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt.value)}
                                className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                                    opt.value === value
                                        ? "bg-indigo-600 text-white font-medium"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
