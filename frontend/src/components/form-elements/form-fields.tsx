import React from 'react';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// TYPE DEFINITIONS (Interfaces for props)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Base props for most form elements
interface BaseFormElementProps {
    label: string;
    name: string;
    id?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

// By combining our Base props with the standard React HTML attributes (omitting duplicates),
// we fix the type conflict while retaining all the standard props and our custom ones.

// Props for the Input component
type InputProps = BaseFormElementProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseFormElementProps>;

// Props for the Textarea component
type TextareaProps = BaseFormElementProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseFormElementProps> & {
    rows?: number;
};

// Defines the shape of an option for Select and RadioGroup
interface Option {
    value: string;
    label: string;
}

// Props for the Select component
type SelectProps = BaseFormElementProps & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, keyof BaseFormElementProps> & {
    options: Option[];
};

// A custom base for Checkbox where the label is optional
interface BaseCheckboxProps extends Omit<BaseFormElementProps, 'label'> {
    label?: string;
}
// Props for the Checkbox component
type CheckboxProps = BaseCheckboxProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseCheckboxProps>;

// Props for the RadioGroup component
type RadioGroupProps = BaseFormElementProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseFormElementProps> & {
    options: Option[];
};

// Props for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// REUSABLE FORM COMPONENTS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * A styled, reusable text input component.
 */
export const Input: React.FC<InputProps> = ({ label, name, id, error, disabled, className = '', ...props }) => {
    const inputId = id || name;
    const errorClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <input
                id={inputId}
                name={name}
                disabled={disabled}
                className={`block w-full px-3 py-2 bg-white dark:bg-gray-800 border ${errorClass} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

/**
 * A styled, reusable textarea component for longer text input.
 */
export const Textarea: React.FC<TextareaProps> = ({ label, name, id, error, disabled, className = '', rows = 4, ...props }) => {
    const textareaId = id || name;
    const errorClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <textarea
                id={textareaId}
                name={name}
                disabled={disabled}
                rows={rows}
                className={`block w-full px-3 py-2 bg-white dark:bg-gray-800 border ${errorClass} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

/**
 * A styled, reusable select (dropdown) component.
 */
export const Select: React.FC<SelectProps> = ({ label, name, id, options, error, disabled, className = '', ...props }) => {
    const selectId = id || name;
    const errorClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <select
                id={selectId}
                name={name}
                disabled={disabled}
                className={`block w-full px-3 py-2 bg-white dark:bg-gray-800 border ${errorClass} rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

/**
 * A styled, reusable checkbox component.
 */
export const Checkbox: React.FC<CheckboxProps> = ({ label, name, id, error, disabled, className = '', ...props }) => {
    const checkboxId = id || name;

    return (
        <div className={`mb-4 ${className}`}>
            <div className="flex items-center">
                <input
                    id={checkboxId}
                    name={name}
                    type="checkbox"
                    disabled={disabled}
                    className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    {...props}
                />
                {label && (
                    <label htmlFor={checkboxId} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        {label}
                    </label>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

/**
 * A styled, reusable radio button group component.
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, error, disabled, className = '', ...props }) => {
    return (
        <fieldset className={`mb-4 ${className}`}>
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</legend>
            <div className="space-y-2">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${name}-${option.value}`}
                            name={name}
                            type="radio"
                            value={option.value}
                            disabled={disabled}
                            className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            {...props}
                        />
                        <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </fieldset>
    );
};

/**
 * A styled, reusable button component with multiple variants.
 */
export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150';

    const variantClasses = {
        primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 focus:ring-indigo-500',
        danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    };

    return (
        <button
            type="button"
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

