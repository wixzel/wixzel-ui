import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to learn the Wixzel type scale and depth names. Without
 * this it reads `text-body-md` as a colour and drops it when it meets
 * `text-fg`, and keeps `shadow-raised` next to a later shadow instead of
 * replacing it.
 */
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "display-md",
            "heading-xl",
            "heading-lg",
            "heading-md",
            "heading-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "caption",
            "overline",
          ],
        },
      ],
      shadow: [{ shadow: ["raised", "pressed", "field"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs));
}
