/**
 * wixzel-ui/tokens: the raw tokens and the seed derivation, for a colour only
 * known at runtime:
 *
 *   import { colorVariables, deriveProduct } from "wixzel-ui/tokens";
 *   <html style={colorVariables(deriveProduct({ seed: "#E4572E" }))}>
 */
export * from "@wixzel/tokens";
