import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface SelectContextType {
    value: string;
    onChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    placeholder: string;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export const useSelect = () => {
    const context = useContext(SelectContext);
    if (!context) {
        throw new Error("Select compound components must be used within a Select.Root");
    }
    return context;
};

interface RootProps {
    children: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const Root: React.FC<RootProps> = ({ children, value, onChange, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <SelectContext.Provider value={{ value, onChange, isOpen, setIsOpen, placeholder }}>
            <div ref={containerRef} className="relative w-full">
                {children}
            </div>
        </SelectContext.Provider>
    );
};

export default Root;
