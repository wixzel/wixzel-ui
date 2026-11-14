import { IconContext } from "@phosphor-icons/react";
import type { Product } from "@wixzel/tokens";
import { Direction } from "radix-ui";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { THEME_STORAGE_KEY } from "../lib/theme";
import { ConfirmHost } from "./confirm-dialog";
import { defaultLabels, LabelsContext, type WixzelLabels } from "./labels";
import { TooltipProvider } from "./tooltip";

export type Theme = "light" | "dark" | "system";

// Wixzel icons are Phosphor duotone: a line drawing with a soft fill in the
// same colour behind it. Set once here, so every icon in a product matches.
const icons = { weight: "duotone", size: "1em" } as const;

/**
 * Wraps the app once: icon style, tooltip timing, reading direction, the
 * words components write themselves, and the host for useConfirm(). Put the product on
 * <html data-product="voice"> so its colour is right before React loads.
 */
export function WixzelProvider({
  children,
  dir = "ltr",
  labels,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  /** The product's own words for built-in labels; anything left out stays English. */
  labels?: Partial<WixzelLabels>;
}) {
  const merged = useMemo(() => ({ ...defaultLabels, ...labels }), [labels]);
  return (
    <IconContext.Provider value={icons}>
      <LabelsContext.Provider value={merged}>
        <Direction.Provider dir={dir}>
          <TooltipProvider>
            <ConfirmHost>{children}</ConfirmHost>
          </TooltipProvider>
        </Direction.Provider>
      </LabelsContext.Provider>
    </IconContext.Provider>
  );
}

/** Light, dark, or follow the OS. Saved per browser. */
export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    setThemeState(saved === "light" || saved === "dark" ? saved : "system");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const root = document.documentElement;
    if (next === "system") delete root.dataset.theme;
    else root.dataset.theme = next;
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice still applies for this visit.
    }
  }, []);

  return [theme, setTheme];
}

/** Every product name data-product accepts. */
export type { Product };
