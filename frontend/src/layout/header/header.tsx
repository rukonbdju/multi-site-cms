import { Bell, Menu, Search } from "lucide-react";
import ThemeToggler from "../theme-toggler";
import { useSidebar } from "@/context/sidebar-context";

const Header = () => {
    const { setIsMobileOpen } = useSidebar();
    return (
        <header className="sticky top-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 flex-shrink-0">
            <div className="flex items-center">
                <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2" aria-label="Open menu" >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search sites..." className="pl-10 pr-4 py-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggler />
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Notifications">
                    <Bell className="h-6 w-6" />
                </button>
                <img className="h-9 w-9 rounded-full object-cover cursor-pointer" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
            </div>
        </header>
    );
}

export default Header;