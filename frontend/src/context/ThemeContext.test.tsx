import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeSelector } from "../components/theme/ThemeSelector";
import { ThemeProvider, useTheme } from "./ThemeContext";

function ThemeProbe() {
  const { themeId } = useTheme();

  return <div data-testid="theme-id">{themeId}</div>;
}

function renderThemeHarness() {
  return render(
    <ThemeProvider>
      <ThemeProbe />
      <ThemeSelector />
    </ThemeProvider>,
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.removeProperty("--color-primary");
    document.documentElement.style.removeProperty("--color-primary-strong");
    document.documentElement.style.removeProperty("--color-primary-soft");
  });

  it("uses the default theme when no stored theme is available", () => {
    renderThemeHarness();

    expect(screen.getByTestId("theme-id")).toHaveTextContent("midnight");
    expect(document.documentElement.dataset.theme).toBe("midnight");
  });

  it("renders the theme selector and marks the current theme as selected", () => {
    renderThemeHarness();

    const midnightButton = screen.getByRole("button", {
      name: /choisir le thème midnight/i,
    });

    expect(midnightButton).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /choisir le thème violet/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("updates the active theme and persists it in localStorage", async () => {
    const user = userEvent.setup();

    renderThemeHarness();

    await user.click(
      screen.getByRole("button", { name: /choisir le thème violet/i }),
    );

    expect(screen.getByTestId("theme-id")).toHaveTextContent("violet");
    expect(document.documentElement.dataset.theme).toBe("violet");
    expect(window.localStorage.getItem("fatou-theme")).toBe("violet");
  });

  it("falls back to the default theme when the stored value is invalid", () => {
    window.localStorage.setItem("fatou-theme", "invalid-value");

    renderThemeHarness();

    expect(screen.getByTestId("theme-id")).toHaveTextContent("midnight");
    expect(document.documentElement.dataset.theme).toBe("midnight");
  });
});
