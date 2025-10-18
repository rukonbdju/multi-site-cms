export interface Site {
    id: number;
    name: string;
    domain: string;
    logo?: string;
    title: string;
    description: string;
    status: 'active' | 'disabled';
    createdAt: string;
    pageCount: number;
}

export interface MenuItemType {
    label: string;
    href?: string;
    icon?: React.ElementType;
    children?: MenuItemType[];
    active?: boolean;
}

export interface SidebarContextType {
    isDesktopExpanded: boolean;
    setIsDesktopExpanded: (expanded: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

export interface MenuItemProps {
    item: MenuItemType;
    level: number;
    isShowing: boolean;
}