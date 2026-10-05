import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { THEMES, DEFAULT_THEME_KEY } from '@/lib/theme/tokens';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils/localStorageUtils';

const STORAGE_KEY = 'font-stash:theme';

const ThemeContext = createContext({
  themeKey: 'system',
  setThemeKey: () => {},
  theme: THEMES[DEFAULT_THEME_KEY],
});

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadFromLocalStorage(STORAGE_KEY, 'system');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeKey(stored);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const applyTheme = (key, isDynamic = false) => {
      let activeKey = key;
      if (key === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeKey = isDark ? 'dark' : 'light';
      }

      const theme = THEMES[activeKey] ?? THEMES[DEFAULT_THEME_KEY];
      const root = document.documentElement;

      if (isDynamic) {
        root.classList.add('theme-transitioning');
      }

      Object.entries(theme.tokens).forEach(([k, v]) => {
        root.style.setProperty(`--${k}`, v);
      });
      root.setAttribute('data-theme', key);

      if (activeKey === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      if (isDynamic) {
        setTimeout(() => {
          root.classList.remove('theme-transitioning');
        }, 300);
      }
    };

    applyTheme(themeKey, true);
    saveToLocalStorage(STORAGE_KEY, themeKey);

    if (themeKey === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system', true);
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [themeKey, isLoaded]);

  const value = useMemo(
    () => ({
      themeKey,
      setThemeKey,
      theme: THEMES[themeKey] ?? THEMES[DEFAULT_THEME_KEY] ?? THEMES['dark'],
    }),
    [themeKey]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
