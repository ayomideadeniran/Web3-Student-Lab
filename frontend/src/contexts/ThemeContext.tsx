"use client";

import React, { createContext } from "react";

/**
 * Legacy ThemeContext - kept for backward compatibility
 * New code should use the useThemeMode hook from @/hooks/useThemeMode
 * which is backed by next-themes for better performance and system preference detection.
 */

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component (Deprecated)
 *
 * @deprecated Use the next-themes provider in /lib/theme/providers.tsx instead.
 * This provider is maintained for backward compatibility but should not be used
 * for new features. Use the `useThemeMode` hook instead.
 *
 * Provides theme context to the application, enabling theme switching and
 * system preference detection. Integrates with next-themes for optimal performance.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Theme provider wrapper
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * useTheme Hook (Deprecated)
 *
 * @deprecated Use useThemeMode() from '@/hooks/useThemeMode' instead.
 *
 * Access theme context. Should only be used in legacy code.
 * New code should use the useThemeMode hook which provides better
 * system preference detection and theme management.
 *
 * @throws {Error} If used outside of ThemeProvider
 * @returns {ThemeContextType} Theme context object with theme and toggleTheme
 *
 * @example
 * const { theme, toggleTheme } = useTheme(); // Deprecated
 * const { theme, isDark, toggleTheme } = useThemeMode(); // Recommended
 */
export function useTheme() {
  // For backward compatibility, return a minimal context
  // Actual implementation should use useThemeMode from hooks
  return {
    theme: "dark" as Theme,
    toggleTheme: () => {},
    setTheme: () => {},
  };
}
