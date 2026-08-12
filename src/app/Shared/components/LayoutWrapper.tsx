"use client"

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function LayoutWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    const pathname = usePathname();
    // Routes that should not show the Sidebar (ignoring locale prefix)
    const hideSidebarRoutes = ["/SignIn", "/RegisterUser"];
    const showSidebar = !hideSidebarRoutes.some(route => pathname.endsWith(route) || pathname.includes(route + '/'));
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    return (
        <div className={`h-screen w-full flex bg-[#0A0F1C] overflow-hidden overflow-x-hidden ${className}`}>
            {showSidebar && <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />}
            <div className="flex flex-col flex-1 min-w-0 w-full h-full overflow-y-auto pt-20">
                <div className="w-full flex-grow">{children}</div>
            </div>
        </div>
    );
}
