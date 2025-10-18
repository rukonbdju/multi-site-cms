import { BarChart2, ChevronsLeft, Flag, Home, Layers, LifeBuoy, LogOut, Settings, Users } from "lucide-react";
import NestedMenu from "../menus/nested-menu";
import { useState } from "react";
import { useSidebar } from "@/context/sidebar-context";
import { MenuItemType } from "../types";

const menuData: MenuItemType[] = [
    { label: 'Home', href: '#', icon: Home },
    { label: 'Analytics', href: '#', icon: BarChart2 },
    {
        label: 'Projects',
        icon: Layers,
        active: true, // Example of an active parent item
        children: [
            { label: 'Active Projects', href: '#', active: true }, // Example of an active child item
            { label: 'Archived', href: '#' },
            {
                label: 'Templates',
                children: [
                    { label: 'Web App', href: '#' },
                    { label: 'E-commerce', href: '#' },
                ]
            },
        ],
    },
    { label: 'Deployments', href: '#', icon: Flag },
    { label: 'Team', href: '#', icon: Users },
];

const bottomMenuData: MenuItemType[] = [
    { label: 'Support', href: '#', icon: LifeBuoy },
    { label: 'Settings', href: '#', icon: Settings },
];

const Sidebar = () => {
    const { isDesktopExpanded, setIsDesktopExpanded, isMobileOpen } = useSidebar();
    const [isHovered, setIsHovered] = useState(false);
    const isShowing = isDesktopExpanded || isHovered || isMobileOpen;
    const isDesktopShowingWide = isDesktopExpanded || isHovered;

    return (
        <aside
            className={`fixed lg:relative inset-y-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col flex-shrink-0 transition-all duration-300 ease-in-out z-30 
            ${isMobileOpen ? 'w-72 flex' : 'w-0 hidden lg:flex'}
            ${isDesktopShowingWide ? 'lg:w-72' : 'lg:w-20'}
            `}
            onMouseEnter={() => !isDesktopExpanded && !isMobileOpen && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`h-16 flex items-center border-b border-gray-200 dark:border-gray-800 flex-shrink-0 ${isShowing ? 'px-6' : 'px-0 justify-center'}`}>
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">D</div>
                    {isShowing && <span className="text-xl font-semibold text-gray-800 dark:text-white whitespace-nowrap">Dashboard</span>}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
                <NestedMenu data={menuData} isShowing={isShowing} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="mb-4">
                    <NestedMenu data={bottomMenuData} isShowing={isShowing} />
                </div>
                <div className={`rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isShowing ? 'p-4' : 'p-2'}`}>
                    <div className={`flex items-center ${!isShowing && 'justify-center'}`}>
                        <img
                            className={`rounded-full object-cover flex-shrink-0 transition-all duration-300 ${isShowing ? 'h-10 w-10' : 'h-8 w-8'}`}
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            alt="User avatar"
                            title="Jane Doe"
                        />
                        {isShowing && (
                            <>
                                <div className="ml-3 truncate">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">Jane Doe</p>
                                    <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate">View Profile</a>
                                </div>
                                {!isMobileOpen && (
                                    <button className="ml-auto p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-colors flex-shrink-0" aria-label="Log out">
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <button onClick={() => setIsDesktopExpanded(!isDesktopExpanded)} className="w-full mt-4 p-2 hidden lg:flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-colors" title={isDesktopExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'} >
                    <ChevronsLeft className={`h-6 w-6 transition-transform duration-300 ${!isDesktopExpanded && "rotate-180"}`} />
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;