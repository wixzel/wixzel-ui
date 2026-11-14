import type { Icon, IconProps } from "@phosphor-icons/react";
import { createElement, forwardRef } from "react";

/**
 * A Phosphor icon drawn the Wixzel way, duotone at 1em, with no React context.
 * WixzelProvider sets the same style through IconContext, which only reaches
 * client components; this reaches Server Components too.
 */
export function duotone(Base: Icon): Icon {
  const Duotone = forwardRef<SVGSVGElement, IconProps>((props, ref) =>
    createElement(Base, { weight: "duotone", ...props, ref }),
  );
  Duotone.displayName = Base.displayName;
  return Duotone;
}
