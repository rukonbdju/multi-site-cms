"use client";

import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';

// Define the possible theme values.
type Theme = 'light' | 'dark' | 'system';

// Define the shape of the context state.
interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

// Create the context with a default undefined value.
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

// --- ThemeProvider Component ---
// Changed to a default export to match common import patterns that cause this error.
export default function ThemeProvider({ children }: { children: ReactNode }) {
    // State to hold the current theme setting ('light', 'dark', or 'system').
    // We initialize it to 'system' and let the useEffect handle the correct initial value.
    const [theme, setThemeState] = useState<Theme>('system');

    // This effect runs once on mount to set the initial theme from localStorage
    // or default to 'system'.
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setThemeState(savedTheme);
        }
    }, []);

    // This function is responsible for applying the theme class to the <html> element.
    const applyTheme = useCallback((newTheme: Theme) => {
        if (newTheme === 'system') {
            localStorage.removeItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else {
            localStorage.setItem('theme', newTheme);
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    // This effect applies the theme whenever the `theme` state changes.
    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    // This effect listens for changes in the OS color scheme.
    // If the current setting is 'system', it updates the theme in real-time.
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            // We read from localStorage here because the `theme` state might not be updated yet
            // if the user has another tab open. This ensures we only apply changes if 'system' is the preference.
            const currentPreference = localStorage.getItem('theme');
            if (!currentPreference || currentPreference === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [applyTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

// --- Custom useTheme Hook ---
export const useTheme = (): ThemeProviderState => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

