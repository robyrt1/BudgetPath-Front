import { Route } from "@/shared/Interfaces/Router";
import { Icon } from "@iconify/react/dist/iconify.js";

export function SideItem({ item, isOpenSide, path, onClick }: { item: Route, isOpenSide: boolean, path: string, onClick: (item: Route) => void }) {
    const handleClick = () => onClick(item);

    return (
        <div
            onClick={handleClick}
            className={`flex items-center gap-3 p-1 px-3 rounded-md cursor-pointer transition-all duration-700 ease-in-out ${!isOpenSide ? 'justify-center' : null}
          ${path === item.path ? 'bg-blue-100' : ''}
        `}
        >
            <div>
                <Icon icon={item.icon} className={`
              ${path === item.path ? 'text-blue-400' : 'text-gray-500'}
              ${isOpenSide ? 'text-sm' : 'text-lg'}
            `}
                />
            </div>
            {isOpenSide &&
                <span className={`text-sm font-semibold ${path === item.path ? 'text-blue-400' : 'text-[#253447] opacity-80'}`}>
                    {item.label}
                </span>
            }
        </div>
    );
}