import * as Icons from "lucide-react"; // Revert to namespace import
import React from 'react'; // Import React for JSX

// This type includes *all* exports from "lucide-react",
// including non-icon utilities like `createReactComponent`.
// The runtime check below is crucial to filter these out.
type IconName = keyof typeof Icons;

interface DynamicIconProps {
    name: IconName;
    size?: number;
    color?: string;
}

export function DynamicIcon({ name, size = 24, color = "currentColor" }: DynamicIconProps) {
    const LucideIcon = Icons[name] as React.ElementType | undefined;

    if (!LucideIcon) {
        return null;
    }

    return <LucideIcon size={size} color={color} />;
}


