import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MenuItemProps } from "../types";

const MenuItem = ({ item, level, isShowing }: MenuItemProps) => {
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(item.active || false);
    const Icon = item.icon;

    const handleToggle = () => {
        if (isShowing) setIsOpen(!isOpen);
    };

    const baseItemClasses = 'w-full flex items-center text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200';
    const activeClasses = item.active ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white';

    const itemContent = (
        <>
            {Icon && <Icon className={`${!isShowing ? 'mr-0' : 'mr-2'} h-5 w-5 flex-shrink-0 ${item.active ? ' text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} ${!isShowing && 'mr-0'}`} aria-hidden="true" />}
            {isShowing && <span className="flex-1 truncate">{item.label}</span>}
            {isShowing && hasChildren && <ChevronDown className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />}
        </>
    );

    if (hasChildren) {
        return (
            <li>
                <button onClick={handleToggle} className={`${baseItemClasses} ${activeClasses} p-2.5 ${!isShowing && 'justify-center'}`} style={{ paddingLeft: isShowing ? `${1 + level * 1.5}rem` : '0.625rem' }} aria-expanded={isOpen} >
                    {itemContent}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && isShowing ? 'max-h-screen' : 'max-h-0'}`} >
                    <ul className="mt-1 space-y-1">
                        {item.children?.map((child) => <MenuItem key={child.label} item={child} level={level + 1} isShowing={isShowing} />)}
                    </ul>
                </div>
            </li>
        );
    }

    return (
        <li>
            <a href={item.href || '#'} className={`${baseItemClasses} ${activeClasses} p-2.5 ${!isShowing && 'justify-center'}`} style={{ paddingLeft: isShowing ? `${1 + level * 1.5}rem` : '0.625rem' }} >
                {itemContent}
            </a>
        </li>
    );
}

export default MenuItem;