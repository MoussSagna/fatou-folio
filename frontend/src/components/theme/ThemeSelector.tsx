import { motion } from "motion/react";

import { useTheme } from "../../context/ThemeContext";
import { themeOptions } from "../../theme/theme";

export function ThemeSelector() {
  const { themeId, setThemeId } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <div
        role="radiogroup"
        aria-label="Palette de couleurs du site"
        className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 p-2 backdrop-blur-sm"
      >
        {themeOptions.map((theme) => {
          const isSelected = theme.id === themeId;

          return (
            <motion.button
              key={theme.id}
              type="button"
              aria-label={`Choisir le thème ${theme.name}`}
              aria-pressed={isSelected}
              onClick={() => setThemeId(theme.id)}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.06 }}
              className="relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
              style={{
                borderColor: isSelected ? "var(--color-primary)" : "rgba(255,255,255,0.15)",
                backgroundColor: isSelected ? "var(--color-primary-soft)" : "transparent",
              }}
            >
              <span
                className="block h-4 w-4 rounded-full shadow-inner"
                style={{ backgroundColor: theme.swatch }}
              />

              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: "var(--color-primary)" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
