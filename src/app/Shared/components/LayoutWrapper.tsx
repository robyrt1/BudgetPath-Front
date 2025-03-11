"use client"

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideSidebarRoutes = ["/SignUp", "/RegisterUser"]; // Rotas que não devem ter Sidebar
    const showSidebar = !hideSidebarRoutes.includes(pathname);

    return (
        <div className="h-screen flex">
            {showSidebar && <Sidebar />}
            <div
                className={`flex flex-col ${showSidebar ? "flex-1" : "w-full"
                    }`}
            >
                <div className="w-full flex-grow">{children}</div>
            </div>
        </div>
    );
}
