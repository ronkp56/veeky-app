/**
 * ThemeContext.tsx
 *
 * Global theme state provider for the entire Veeky app.
 *
 * Responsibilities:
 * --------------------------------------------------------------------
 * ✔ Store whether the UI is in Dark Mode or Light Mode
 * ✔ Provide a toggleTheme() function to switch modes
 * ✔ Expose `useTheme()` hook for any component
 * ✔ Wrap the entire navigation tree with ThemeProvider
 *
 * Architecture Notes:
 * --------------------------------------------------------------------
 * • This is a minimal, simple context-based theme system.
 * • Dark mode value is stored in React state (not persisted yet).
 * • All screens (Profile, Settings, Login, Feed, etc.) read from here.
 * • In the future, we can replace internal logic with:
 *      - OS color scheme detection
 *      - User preferences from backend
 *      - AsyncStorage persistence
 *
 * API:
 * --------------------------------------------------------------------
 * useTheme() → { isDarkMode, toggleTheme }
 *
 * Example:
 * const { isDarkMode, toggleTheme } = useTheme();
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeContextType = {
  /** Whether the app is currently in dark mode */
  isDarkMode: boolean;

  /** Flip between dark and light mode */
  toggleTheme: () => void;
};

/**
 * Internal context object.
 * Initialized as undefined so `useTheme()` can detect misuse.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider
 *
 * Wrap your entire <NavigationContainer> with this to enable theme switching.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Dark mode state.
   * Default: true (Veeky starts in dark mode by design).
   */
  const [isDarkMode, setIsDarkMode] = useState(true);

  /** Toggle between light and dark themes */
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme
 *
 * Access theme values inside any component.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  // Enforce correct usage
  if (!context)
    throw new Error('useTheme must be used within ThemeProvider');

  return context;
};
