"use client"

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideSidebarRoutes = ["/SignIn", "/RegisterUser"]; // Rotas que não devem ter Sidebar
    const showSidebar = !hideSidebarRoutes.includes(pathname);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    return (
        <div className="h-screen w-full flex bg-[#0A0F1C] overflow-hidden">
            {showSidebar && <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />}
            <div
                className={`flex flex-col flex-1 transition-all duration-300 ease-in-out h-full overflow-y-auto pt-20 ${
                    showSidebar ? (isSidebarExpanded ? "pl-64" : "pl-20") : "w-full"
                }`}
            >
                <div className="w-full flex-grow">{children}</div>
            </div>
        </div>
    );
}
