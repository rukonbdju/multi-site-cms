import { FC } from "react";

export const Button: FC<{
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ children, onClick, variant = 'secondary', size = 'md', disabled = false, className = '', onMouseDown }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-gray-400',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
        <button
            onClick={onClick}
            onMouseDown={onMouseDown}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? disabledClasses : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;