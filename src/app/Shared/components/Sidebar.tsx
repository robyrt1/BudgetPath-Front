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
                                    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Transactions
                                </span>
                            </a>
                        </li>

                        <li>
                            <a onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Overlay ao abrir o menu no mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
