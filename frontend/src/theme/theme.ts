export type ThemeId =
  | "midnight"
  | "rose"
  | "violet"
  | "blue"
  | "green"
  | "orange";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  swatch: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
}

export const themeOptions: ThemeOption[] = [
  {
    id: "midnight",
    name: "Midnight",
    swatch: "#d5b5ff",
    accent: "#d5b5ff",
    accentStrong: "#c38dff",
    accentSoft: "rgba(213, 181, 255, 0.18)",
  },
  {
    id: "rose",
    name: "Rose",
    swatch: "#f9a8d4",
    accent: "#f9a8d4",
    accentStrong: "#f472b6",
    accentSoft: "rgba(249, 168, 212, 0.18)",
  },
  {
    id: "violet",
    name: "Violet",
    swatch: "#a78bfa",
    accent: "#a78bfa",
    accentStrong: "#8b5cf6",
    accentSoft: "rgba(167, 139, 250, 0.18)",
  },
  {
    id: "blue",
    name: "Blue",
    swatch: "#7dd3fc",
    accent: "#7dd3fc",
    accentStrong: "#38bdf8",
    accentSoft: "rgba(125, 211, 252, 0.18)",
  },
  {
    id: "green",
    name: "Green",
    swatch: "#86efac",
    accent: "#86efac",
    accentStrong: "#4ade80",
    accentSoft: "rgba(134, 239, 172, 0.18)",
  },
  {
    id: "orange",
    name: "Orange",
    swatch: "#fbbf24",
    accent: "#fbbf24",
    accentStrong: "#f59e0b",
    accentSoft: "rgba(251, 191, 36, 0.18)",
  },
];

export const defaultThemeId: ThemeId = "midnight";

const storageKey = "fatou-theme";

export function isThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === "string" &&
    themeOptions.some((option) => option.id === value)
  );
}

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") {
    return defaultThemeId;
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme && isThemeId(storedTheme)) {
    return storedTheme;
  }

  return defaultThemeId;
}

export function setStoredTheme(themeId: ThemeId): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, themeId);
}

export function applyTheme(themeId: ThemeId): void {
  const theme =
    themeOptions.find((option) => option.id === themeId) ??
    themeOptions[0];

  const root = document.documentElement;

  root.dataset.theme = theme.id;
  root.style.setProperty("--color-primary", theme.accent);
  root.style.setProperty("--color-primary-strong", theme.accentStrong);
  root.style.setProperty("--color-primary-soft", theme.accentSoft);
  root.style.setProperty("--color-button-text", "#111111");
}

export function getThemeById(themeId: ThemeId): ThemeOption {
  return (
    themeOptions.find((option) => option.id === themeId) ??
    themeOptions[0]
  );
}
