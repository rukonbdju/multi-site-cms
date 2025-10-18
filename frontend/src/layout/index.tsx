'use client';
import { useSidebar } from "@/context/sidebar-context";
import Sidebar from "./sidebar/sidebar";
import Header from "./header/header";
import { ReactNode } from "react";
import CustomScrollbarStyles from "./custom-scrollbar-style";

const AppLayout = ({ children }: { children: ReactNode }) => {
    const { isMobileOpen, setIsMobileOpen } = useSidebar();
    return (
        <div className="h-screen w-full bg-white dark:bg-gray-900 flex overflow-hidden">
            <CustomScrollbarStyles />
            {isMobileOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setIsMobileOpen(false)} />}
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;