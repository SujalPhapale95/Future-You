'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system' | 'active';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [accentColor, setAccentColorState] = useState('#e05c4a');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load preferences
        const savedTheme = localStorage.getItem('theme_preference') as Theme || 'dark';
        const savedAccent = localStorage.getItem('accent_color') || '#e05c4a';

        setThemeState(savedTheme);
        setAccentColorState(savedAccent);
        setMounted(true);

        applyTheme(savedTheme);
        applyAccent(savedAccent);
    }, []);

    const applyTheme = (t: Theme) => {
        const root = document.documentElement;
        if (t === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        } else if (t === 'active') { // Custom auto logic if active
            // ...
            root.setAttribute('data-theme', t);
        } else {
            root.setAttribute('data-theme', t);
        }
    };

    const applyAccent = (color: string) => {
        const root = document.documentElement;
        root.style.setProperty('--accent-red', color);
        root.style.setProperty('--glow-red', `${color}26`);
    };

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem('theme_preference', t);
        applyTheme(t);
    };

    const setAccentColor = (color: string) => {
        setAccentColorState(color);
        localStorage.setItem('accent_color', color);
        applyAccent(color);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
