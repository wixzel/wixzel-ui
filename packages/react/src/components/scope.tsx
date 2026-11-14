import type { Product } from "@wixzel/tokens";
import { Slot } from "radix-ui";
import { type ComponentProps, createContext, useContext } from "react";

interface Scope {
  theme?: "light" | "dark";
  product?: Product;
}

const ScopeContext = createContext<Scope>({});

/**
 * A region with its own theme or product, such as a dark hero on a light page
 * or a Voice card inside Wixzel One. Menus, tooltips and dialogs opened inside
 * it render in a portal at the end of <body>, outside this element, so they
 * read the scope from context and carry the same attributes.
 *
 * For a whole app, put data-theme and data-product on <html> instead.
 */
export function ThemeScope({
  theme,
  product,
  asChild,
  ...props
}: ComponentProps<"div"> & Scope & { asChild?: boolean }) {
  const parent = useContext(ScopeContext);
  const Comp = asChild ? Slot.Root : "div";
  return (
    <ScopeContext.Provider value={{ theme: theme ?? parent.theme, product: product ?? parent.product }}>
      <Comp data-theme={theme} data-product={product} {...props} />
    </ScopeContext.Provider>
  );
}

/** Spread onto anything rendered in a portal. */
export function useScopeAttributes() {
  const { theme, product } = useContext(ScopeContext);
  return { "data-theme": theme, "data-product": product };
}
