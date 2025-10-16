"use client";
import React from "react";
import Link from "next/link";
import { useSidebar } from "../context/SidebarContext";
import { MenuItemType, NestedMenu } from "./menus";
import { Box, FileText, LayoutDashboard, Settings, User } from "lucide-react";

// --- SAMPLE MENU DATA ---
// An example configuration for the nested menu.
const menuData: MenuItemType[] = [
  {
    label: 'Dashboard',
    href: '#',
    icon: LayoutDashboard,
  },
  {
    label: 'Pages',
    icon: Box,
    children: [
      {
        label: 'Page 1',
        href: '#',
      },

      {
        label: 'Page 1',
        href: '#',
      },
    ],
  },
  {
    label: 'Reports',
    href: '#',
    icon: FileText,
  }
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();


  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <span>Long</span>
            </>
          ) : (
            <span>logo</span>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <NestedMenu data={menuData} />
      </div>
    </aside>
  );
};

export default AppSidebar;
