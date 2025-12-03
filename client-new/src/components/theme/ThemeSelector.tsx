import { useTheme } from '@/hooks/useTheme';
import type { ThemeName } from '@/stores/themeStore';
import { FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  className?: string;
}

/**
 * Dropdown selector to choose from all available themes
 */
export const ThemeSelector = ({ className }: ThemeSelectorProps) => {
  const { theme, allThemes, setTheme, themeConfig } = useTheme();

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
  };

  return (
    <div className={cn('dropdown dropdown-end', className)}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost gap-2"
        aria-label="Sélectionner un thème"
      >
        <span className="text-xl">{themeConfig.icon}</span>
        <span className="hidden sm:inline">{themeConfig.displayName}</span>
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-200 rounded-box z-[1] w-64 p-2 shadow-xl mt-3 border border-base-300"
      >
        <li className="menu-title px-4 py-2">
          <span className="text-xs font-semibold">Sélectionner un thème</span>
        </li>

        {Object.values(allThemes).map((themeOption) => {
          const isActive = theme === themeOption.name;

          return (
            <li key={themeOption.name}>
              <button
                onClick={() => handleThemeChange(themeOption.name)}
                className={cn(
                  'flex items-center justify-between gap-3 px-4 py-3',
                  isActive && 'active'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{themeOption.icon}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{themeOption.displayName}</span>
                    <span className="text-xs opacity-70">
                      {themeOption.description}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <FiCheck className="h-5 w-5 text-primary" />
                )}
              </button>
            </li>
          );
        })}

        <div className="divider my-1"></div>

        <li className="px-4 py-2">
          <div className="flex items-center gap-2 text-xs opacity-60">
            <span>💡</span>
            <span>Le thème est sauvegardé automatiquement</span>
          </div>
        </li>
      </ul>
    </div>
  );
};
