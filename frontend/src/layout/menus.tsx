import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, } from 'lucide-react';

// --- TYPE DEFINITION ---
// Defines the structure for a single menu item.
export interface MenuItemType {
    label: string;
    href?: string;
    icon?: LucideIcon;
    children?: MenuItemType[];
}


// --- RECURSIVE MENU ITEM COMPONENT ---
// Renders a single item and recursively renders its children if they exist.
// Each item with children manages its own open/closed state.
interface MenuItemProps {
    item: MenuItemType;
    level: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, level }) => {
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(false);
    const Icon = item.icon;

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    // Base padding, increased with each level of nesting
    const paddingLeft = 1 + level * 1.5;

    // Common styles for both button and link
    const itemClasses = `w-full flex items-center text-left text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`;

    if (hasChildren) {
        return (
            <li>
                <button
                    onClick={handleToggle}
                    className={`${itemClasses} p-2`}
                    style={{ paddingLeft: `${paddingLeft}rem` }}
                    aria-expanded={isOpen}
                >
                    {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />}
                    <span className="flex-1">{item.label}</span>
                    <ChevronDown
                        className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                    />
                </button>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'
                        }`}
                >
                    {/* Sub-menu container */}
                    <ul className="mt-1">
                        {item.children?.map((child) => (
                            <MenuItem
                                key={child.label}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </ul>
                </div>
            </li>
        );
    }

    return (
        <li>
            <a
                href={item.href || '#'}
                className={`${itemClasses} p-2`}
                style={{ paddingLeft: `${paddingLeft}rem` }}
            >
                {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />}
                <span>{item.label}</span>
            </a>
        </li>
    );
};


// --- MAIN NESTED MENU COMPONENT ---
// The main component that renders the list of menu items.
interface NestedMenuProps {
    data: MenuItemType[];
}

export const NestedMenu: React.FC<NestedMenuProps> = ({ data }) => {
    return (
        <nav className="p-4">
            <ul className="space-y-1">
                {data.map((item) => (
                    <MenuItem
                        key={item.label}
                        item={item}
                        level={0}
                    />
                ))}
            </ul>
        </nav>
    );
};