'use client'
import React, { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';

interface NavItem {
    label: string;
    path: string;
    children?: NavItem[];
}

// Defines the props for the main Navbar component.
interface NavbarProps {
    navItems: NavItem[];
}

// --- DROPDOWN SUB-COMPONENT ---
// A reusable component to render the nested menu items.
const Dropdown: FC<{ submenus: NavItem[]; isOpen: boolean }> = ({ submenus, isOpen }) => {
    return (
        <ul className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
            {submenus.map((submenu, index) => (
                <li key={index}>
                    <a href={submenu.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {submenu.label}
                    </a>
                </li>
            ))}
        </ul>
    );
};

// --- MENU ITEM SUB-COMPONENT ---
// Renders a single top-level navigation item and handles its dropdown.
const MenuItem: FC<{ item: NavItem }> = ({ item }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const triggerRef = useRef<HTMLLIElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownOpen &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const hasChildren = item.children && item.children.length > 0;

    return (
        <li
            className="relative"
            ref={triggerRef}
            onMouseEnter={() => window.innerWidth > 768 && setDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setDropdownOpen(false)}
        >
            {hasChildren ? (
                <>
                    <button
                        type="button"
                        className="flex items-center gap-1 hover:text-blue-500 focus:outline-none focus:text-blue-500 transition-colors duration-200"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-haspopup="menu"
                        aria-expanded={dropdownOpen ? 'true' : 'false'}
                    >
                        {item.label}
                        <svg
                            className={`h-4 w-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div ref={dropdownRef}>
                        <Dropdown submenus={item.children!} isOpen={dropdownOpen} />
                    </div>
                </>
            ) : (
                <a href={item.path} className="hover:text-blue-500 transition-colors duration-200">
                    {item.label}
                </a>
            )}
        </li>
    );
};

// --- MAIN NAVBAR COMPONENT ---
export const Navbar: FC<NavbarProps> = ({ navItems = [] }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md w-full relative z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-gray-800">
                            <span className="font-extrabold text-blue-600">SiteLogo</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <ul className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item, index) => (
                                <MenuItem key={index} item={item} />
                            ))}
                        </ul>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-controls="mobile-menu"
                            aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger Icon */}
                            {!mobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                // Close Icon
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`} id="mobile-menu">
                <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item, index) => (
                        <li key={index} className="border-b border-gray-200 last:border-b-0">
                            {item.children && item.children.length > 0 ? (
                                <details className="group">
                                    <summary className="flex justify-between items-center w-full py-2 text-base font-medium text-gray-700 hover:text-blue-500 cursor-pointer">
                                        <span>{item.label}</span>
                                        <svg className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <ul className="pl-4 py-1">
                                        {item.children.map((child, childIndex) => (
                                            <li key={childIndex} className="py-1">
                                                <a href={child.path} className="block text-sm text-gray-600 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
                                                    {child.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            ) : (
                                <a href={item.path} className="block py-2 text-base font-medium text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

