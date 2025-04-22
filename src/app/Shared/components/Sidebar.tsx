import { Route } from "@/shared/Interfaces/Router";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./../../../Redux/Slices/AutheticationSlice";



const Sidebar = () => {
    const router = useRouter()
    const path = usePathname()


    const [isOpen, setIsOpen] = useState(false);

    const routes: Route[] = [
        {
            path: "/home", label: "Home", icon: 'mdi-light:home'
        },
        { path: "/transactions", label: "Transactions", icon: "mdi-light:bank" }
    ]


    const dispatch = useDispatch();

    function handleSide() {
        setIsOpen(!isOpen)
    }
    function handleLogout() {
        dispatch(logout());
        window.location.href = "/SignIn";
    };
    const handleClick = (item: Route) => router.push(item.path)

    return (
        // <nav
        //     className={"select-none relative border-r border-zinc-300 transition-all duration-400 ease-in-out " + (isOpen ? 'w-120' : 'w-16')}
        //     style={{
        //         backgroundColor: "var(--background)",
        //         color: "var(--foreground)",
        //         border: "1px solid #2f365f"
        //     }}>
        //     <div className="flex flex-col gap-3 p-2">
        //         <div className={"flex items-center gap-2 text-xl my-2 " + (!isOpen ? 'justify-center' : null)}>
        //             <Icon icon="mdi:link-lock" className="text-2xl text-[#395df1]" />
        //             {isOpen &&
        //                 <span className="font-semibold text-[#0f1949]"> Budget Path</span>
        //             }
        //         </div>
        //     </div>

        //     <div className="flex flex-col">
        //         <nav className="flex flex-col gap-1">
        //             {routes.map(route => (
        //                 <SideItem key={route.path} item={route} isOpenSide={isOpen} path={path} onClick={handleClick} />
        //             ))}
        //         </nav>
        //     </div>

        //     <button onClick={handleSide} className="absolute flex justify-center items-center top-4 -right-2.5 h-5 w-5 bg-gray-100 rounded-full border border-gray-200 cursor-pointer outline-0">
        //         <Icon icon={isOpen ? 'ri:arrow-left-s-line' : 'ri:arrow-right-s-line'} className="text-gray-500" />
        //     </button>
        // </nav>
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 text-gray-900 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid #2f365f"
                }}
            >
                ☰
            </button>
            <div
                id="drawer-navigation"
                className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } dark:bg-gray-800 flex flex-col md:translate-x-0`}
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid #2f365f"
                }}
                aria-labelledby="drawer-navigation-label"
            >
                <h5
                    id="drawer-navigation-label"
                    className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
                >
                    Budget Path
                </h5>

                <div className="py-4 overflow-y-auto flex-1">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a
                                href="/home"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10.707 1.293a1 1 0 0 0-1.414 0l-8 8A1 1 0 0 0 2 11h1v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4h2v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7h1a1 1 0 0 0 .707-1.707l-8-8Z" />
                                </svg>

                                <span className="ms-3">Home</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/transactions"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 23 23"><path fill="#b8b8b8" d="M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9c0-1.02 1.11-1.39 1.81-1.39c1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.45-.82-1.92-2.54-2.24V5h-2v1.26c-2.48.56-2.49 2.86-2.49 2.96c0 2.27 2.25 2.91 3.35 3.31c1.58.56 2.28 1.07 2.28 2.03c0 1.13-1.05 1.61-1.98 1.61c-1.82 0-2.34-1.87-2.4-2.09l-1.66.67c.63 2.19 2.28 2.78 2.9 2.96V19h2v-1.24c.4-.09 2.9-.59 2.9-3.22c0-1.39-.61-2.61-3.01-3.44M3 21H1v-6h6v2H4.52c1.61 2.41 4.36 4 7.48 4a9 9 0 0 0 9-9h2c0 6.08-4.92 11-11 11c-3.72 0-7.01-1.85-9-4.67zm-2-9C1 5.92 5.92 1 12 1c3.72 0 7.01 1.85 9 4.67V3h2v6h-6V7h2.48C17.87 4.59 15.12 3 12 3a9 9 0 0 0-9 9z" /></svg>                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Transactions
                                </span>
                            </a>
                        </li>

                    </ul>
                </div>
                <div>
                    <a onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                            <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                            <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                    </a>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* <button onClick={handleSide} className="absolute flex justify-center items-center top-4 -right-2.5 h-5 w-5 bg-gray-100 rounded-full border border-gray-200 cursor-pointer outline-0">
                <Icon icon={isOpen ? 'ri:arrow-left-s-line' : 'ri:arrow-right-s-line'} className="text-gray-500" />
            </button> */}
        </div>
    );
};

export default Sidebar;
