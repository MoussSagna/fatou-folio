import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applyTheme,
  defaultThemeId,
  getStoredTheme,
  getThemeById,
  setStoredTheme,
  type ThemeId,
} from "../theme/theme";

interface ThemeContextValue {
  themeId: ThemeId;
  setThemeId: (themeId: ThemeId) => void;
  activeTheme: ReturnType<typeof getThemeById>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(themeId);
    setStoredTheme(themeId);
  }, [themeId]);

  const value = useMemo(
    () => ({
      themeId,
      setThemeId: setThemeIdState,
      activeTheme: getThemeById(themeId),
    }),
    [themeId],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

export function resetTheme(): void {
  setStoredTheme(defaultThemeId);
  applyTheme(defaultThemeId);
}
