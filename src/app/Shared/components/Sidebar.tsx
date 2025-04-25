import { AuthState, logout } from "@/Redux/Slices/AutheticationSlice";
import { Route } from "@/shared/Interfaces/Router";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const routes: Route[] = [
    { path: "/home", label: "Home", icon: "lucide-lab:house-roof" },
    { path: "/transactions", label: "Transactions", icon: "lucide-lab:coins-stack" },
];

export default function NavbarWithSidebar() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false); // controla sidebar
    const [dropdownOpen, setDropdownOpen] = useState(false); // controla dropdown
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

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700" style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid #2f365f"
            }}>
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
                            <a href="/home" className="flex ms-2 md:me-24">
                                <img src="../../favicon.ico" className="h-8 me-3" alt="Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Budget Path
                                </span>
                            </a>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open user menu</span>
                                {/* <img
                                    className="w-8 h-8 rounded-full"
                                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                    alt="user photo"
                                /> */}
                                <span className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-full dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                    </svg>
                                </span>

                            </button>

                            {/* Dropdown aberto */}
                            {dropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-md shadow-md dark:bg-gray-700 dark:divide-gray-600">
                                    <div className="px-4 py-3">
                                        <p className="text-sm text-gray-900 dark:text-white">{nameUser}</p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                                            {email}
                                        </p>
                                    </div>
                                    <ul className="py-1">
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Dashboard
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Settings
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Earnings
                                            </a>
                                        </li>
                                        <li>
                                            <a onClick={handleLogout} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                                                Sign out
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700
                ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
                aria-label="Sidebar"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid #2f365f"
                }}
            >
                <div className="h-full px-3 pb-2 overflow-y-auto bg-white dark:bg-gray-800" style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                }}>
                    <ul className="space-y-2 font-medium">
                        {routes.map((route) => (
                            <li key={route.path}>
                                <a
                                    onClick={() => handleClick(route)}
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                                >
                                    <Icon
                                        icon={route.icon}
                                        className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    />
                                    <span className="ml-3">{route.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
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
