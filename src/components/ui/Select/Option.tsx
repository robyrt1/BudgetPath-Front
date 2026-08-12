import React from "react";
import { useSelect } from "./Root";

interface OptionProps {
    value: string;
    children: React.ReactNode;
}

export const Option: React.FC<OptionProps> = ({ value, children }) => {
    const { value: selectedValue, onChange, setIsOpen } = useSelect();

    const isSelected = selectedValue === value;

    return (
        <button
            type="button"
            onClick={() => {
                onChange(value);
                setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                isSelected
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
        >
            {children}
        </button>
    );
};

export default Option;
