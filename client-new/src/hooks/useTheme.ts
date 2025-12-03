import { useThemeStore, THEMES } from '@/stores/themeStore';
import type { ThemeName } from '@/stores/themeStore';

/**
 * Hook to access and control the theme
 *
 * @example
 * ```tsx
 * const { theme, setTheme, toggleTheme, themeConfig, isDark } = useTheme();
 *
 * // Change to a specific theme
 * setTheme('brx-light');
 *
 * // Toggle between light and dark
 * toggleTheme();
 *
 * // Get current theme info
 * console.log(themeConfig.displayName); // "BRX Light"
 * console.log(isDark); // false
 * ```
 */
export const useTheme = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const getThemeConfig = useThemeStore((state) => state.getThemeConfig);

  const themeConfig = getThemeConfig();

  return {
    // Current theme name
    theme: currentTheme,

    // Theme configuration
    themeConfig,

    // Is current theme dark?
    isDark: themeConfig.isDark,

    // All available themes
    allThemes: THEMES,

    // Change to a specific theme
    setTheme,

    // Toggle between light and dark
    toggleTheme,
  };
};

export type UseThemeReturn = ReturnType<typeof useTheme>;
