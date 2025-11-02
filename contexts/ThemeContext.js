import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEMES, DEFAULT_THEME_KEY } from "@/themes/themes";
import { saveToLocalStorage } from "@/utils/localStorageUtils";

const STORAGE_KEY = "font-stash:theme";

const ThemeContext = createContext({
  themeKey: DEFAULT_THEME_KEY,
  setThemeKey: () => {},
  theme: THEMES[DEFAULT_THEME_KEY],
});

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(DEFAULT_THEME_KEY);

  // Apply CSS variables and persist
  useEffect(() => {
    const theme = THEMES[themeKey] ?? THEMES[DEFAULT_THEME_KEY];
    const root = document.documentElement;
    Object.entries(theme.tokens).forEach(([k, v]) => {
      root.style.setProperty(`--${k}`, v);
    });
    saveToLocalStorage(STORAGE_KEY, themeKey);
  }, [themeKey]);

  const value = useMemo(
    () => ({
      themeKey,
      setThemeKey,
      theme: THEMES[themeKey] ?? THEMES[DEFAULT_THEME_KEY],
    }),
    [themeKey]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
