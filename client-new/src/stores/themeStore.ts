import { create } from 'zustand';

// Available themes in DaisyUI config
export type ThemeName = 'brx-light' | 'brx-onyx' | 'brx-night' | 'brx-terminal';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  description: string;
  isDark: boolean;
  icon: string;
}

// Theme configurations
export const THEMES: Record<ThemeName, ThemeConfig> = {
  'brx-light': {
    name: 'brx-light',
    displayName: 'BRX Light',
    description: 'Thème clair pour la journée',
    isDark: false,
    icon: '☀️',
  },
  'brx-onyx': {
    name: 'brx-onyx',
    displayName: 'BRX Onyx',
    description: 'Thème sombre élégant',
    isDark: true,
    icon: '🌙',
  },
  'brx-night': {
    name: 'brx-night',
    displayName: 'BRX Night',
    description: 'Thème sombre profond',
    isDark: true,
    icon: '🌃',
  },
  'brx-terminal': {
    name: 'brx-terminal',
    displayName: 'BRX Terminal',
    description: 'Thème type Matrix',
    isDark: true,
    icon: '💻',
  },
};

interface ThemeState {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  getThemeConfig: () => ThemeConfig;
}

// Helper to apply theme to DOM
const applyTheme = (theme: ThemeName) => {
  document.documentElement.setAttribute('data-theme', theme);

  // Update color-scheme for better browser integration
  const isDark = THEMES[theme].isDark;
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

  // Save to localStorage manually
  try {
    localStorage.setItem('brx-theme', theme);
  } catch (e) {
    console.warn('Failed to save theme to localStorage:', e);
  }
};

// Detect system theme preference
const getSystemTheme = (): ThemeName => {
  if (typeof window === 'undefined') return 'brx-terminal';

  // Try to get from localStorage first
  try {
    const saved = localStorage.getItem('brx-theme') as ThemeName | null;
    if (saved && THEMES[saved]) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read theme from localStorage:', e);
  }

  // Fallback to system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'brx-terminal' : 'brx-light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: getSystemTheme(),

  setTheme: (theme: ThemeName) => {
    applyTheme(theme);
    set({ currentTheme: theme });
  },

  toggleTheme: () => {
    const current = get().currentTheme;
    const isDark = THEMES[current].isDark;

    // Toggle between light and the last used dark theme
    const newTheme = isDark ? 'brx-light' : 'brx-terminal';

    applyTheme(newTheme);
    set({ currentTheme: newTheme });
  },

  getThemeConfig: () => {
    return THEMES[get().currentTheme];
  },
}));

// Initialize theme on module load
if (typeof window !== 'undefined') {
  const initialTheme = getSystemTheme();
  applyTheme(initialTheme);
}

