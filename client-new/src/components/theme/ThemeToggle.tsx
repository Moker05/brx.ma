import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Simple toggle button to switch between light and dark themes
 */
export const ThemeToggle = ({ className, showLabel = false }: ThemeToggleProps) => {
  const { isDark, toggleTheme, themeConfig } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'btn btn-ghost btn-circle swap swap-rotate',
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Passer au thème ${isDark ? 'clair' : 'sombre'}`}
    >
      {/* Sun icon (light mode) */}
      <FiSun
        className={cn(
          'swap-off h-6 w-6 transition-transform duration-300',
          !isDark && 'rotate-0 scale-100',
          isDark && 'rotate-90 scale-0'
        )}
      />

      {/* Moon icon (dark mode) */}
      <FiMoon
        className={cn(
          'swap-on h-6 w-6 transition-transform duration-300',
          isDark && 'rotate-0 scale-100',
          !isDark && '-rotate-90 scale-0'
        )}
      />

      {showLabel && (
        <span className="ml-2 hidden sm:inline">
          {themeConfig.displayName}
        </span>
      )}
    </button>
  );
};
