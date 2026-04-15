import { AuthState, logout } from "@/Redux/Slices/AutheticationSlice";
import { Route } from "@/shared/Interfaces/Router";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocaleSwitcher from "./LocaleSwitcher";

interface SidebarProps {
    isExpanded?: boolean;
    toggleSidebar?: () => void;
}

export default function NavbarWithSidebar({ isExpanded = true, toggleSidebar }: SidebarProps) {
    const t = useTranslations('nav');
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const routes: Route[] = [
        { path: "/home", label: t('home'), icon: "lucide-lab:house-roof" },
        { path: "/transactions", label: t('transactions'), icon: "lucide-lab:coins-stack" },
        { path: "/accounts", label: t('accounts'), icon: "hugeicons:credit-card" },
        { path: "/Debts", label: t('debts'), icon: "bitcoin-icons:buoy-outline" },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const email = useSelector((state: { auth: AuthState }) => {
        return state.auth.email
    });
    const nameUser = useSelector((state: { auth: AuthState }) => {
        return state.auth.nameUser
    });

    const handleClick = (route: Route) => {
        router.push(route.path);
        setIsOpen(false);
    };

    function handleLogout() {
        dispatch(logout());
        window.location.href = "/SignIn";
    }

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Check if route is active (ignoring locale prefix)
    const isRouteActive = (routePath: string) => {
        return pathname.endsWith(routePath) || pathname.includes(routePath + '/');
    };

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full bg-[#0A0F1C] border-b border-white/5 text-slate-100">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        {/* Botão abrir Sidebar */}
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                                </svg>
                            </button>

                            {/* Logo */}
                            <Link href="/home" className="flex ms-2 md:me-24">
                                <Image src="/favicon.ico" width={32} height={32} className="h-8 me-3" alt="Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Budget Path
                                </span>
                            </Link>
                        </div>

                        {/* Right side: LocaleSwitcher + Profile */}
                        <div className="flex items-center gap-3">
                            <LocaleSwitcher />

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-full dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                        </svg>
                                    </span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 text-base list-none bg-[#111827] border border-white/10 divide-y divide-white/5 rounded-xl shadow-lg">
                                        <div className="px-4 py-3">
                                            <p className="text-sm text-slate-100">{nameUser}</p>
                                            <p className="text-sm font-medium text-slate-300 truncate">
                                                {email}
                                            </p>
                                        </div>
                                        <ul className="py-1">
                                            <li>
                                                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                                                    {t('dashboard')}
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                                                    {t('settings')}
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                                                    {t('earnings')}
                                                </a>
                                            </li>
                                            <li>
                                                <a onClick={handleLogout} className="block px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 cursor-pointer">
                                                    {t('signOut')}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-all duration-300 ease-in-out bg-[#0A0F1C] border-r border-white/5
                ${isExpanded ? "w-64" : "w-20"}
                ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="flex flex-col h-full px-4 pb-4 overflow-y-auto bg-[#0A0F1C] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <ul className="space-y-3 font-medium flex-1">
                        {routes.map((route) => {
                            const isActive = isRouteActive(route.path);
                            return (
                                <li key={route.path}>
                                    <a
                                        onClick={() => handleClick(route)}
                                        className={`flex items-center p-3 rounded-xl transition-all group cursor-pointer ${isActive ? "bg-[#3B82F6]/15 text-[#3B82F6] font-semibold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon
                                            icon={route.icon}
                                            className={`w-6 h-6 flex-shrink-0 transition duration-75 ${isActive ? "text-[#3B82F6]" : "text-slate-500 group-hover:text-slate-300"
                                                }`}
                                        />
                                        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isExpanded ? "ml-3 opacity-100 max-w-[200px]" : "ml-0 opacity-0 max-w-0"}`}>{route.label}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>

                    {toggleSidebar && (
                        <div className="mt-auto pt-4 border-t border-white/5">
                            <button
                                onClick={toggleSidebar}
                                className="flex justify-center items-center w-full p-3 rounded-xl transition-all text-slate-500 hover:text-white hover:bg-white/5"
                                title={isExpanded ? t('collapseMenu') : t('expandMenu')}
                            >
                                <Icon icon={isExpanded ? "lucide:chevron-left" : "lucide:chevron-right"} className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* BACKDROP para fechar Sidebar no mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
