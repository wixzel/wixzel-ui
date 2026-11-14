import { Slot } from "radix-ui";
import { cloneElement, isValidElement, type ReactNode, use } from "react";

const LAZY = Symbol.for("react.lazy");

/**
 * The child a Server Component passes can reach the client as a lazy reference
 * while its module loads, not yet an element. Radix's Slot unwraps these, so
 * anything that inspects a slotted child has to as well.
 */
export function resolveChild(node: ReactNode): ReactNode {
  let current = node as unknown;
  while (typeof current === "object" && current !== null) {
    const { $$typeof, _payload } = current as { $$typeof?: symbol; _payload?: PromiseLike<unknown> };
    if ($$typeof !== LAZY || typeof _payload?.then !== "function") break;
    current = use(_payload as Promise<unknown>);
  }
  return current as ReactNode;
}

/**
 * asChild that keeps a component's own layout. Place the result among the
 * component's other children inside a Slot.Root: the child (a router's Link,
 * say) becomes the outer element, and its own content, passed through `wrap`,
 * lands where this sits, between the component's icons and badges.
 *
 *   <Slot.Root>{icon}{slottable(asChild, children, (c) => <span>{c}</span>)}</Slot.Root>
 *
 * Without asChild it just returns `wrap(children)`.
 */
export function slottable(asChild: boolean | undefined, children: ReactNode, wrap: (content: ReactNode) => ReactNode = (c) => c) {
  if (!asChild) return wrap(children);
  const child = resolveChild(children);
  if (!isValidElement<{ children?: ReactNode }>(child)) return null;
  return <Slot.Slottable>{cloneElement(child, undefined, wrap(child.props.children))}</Slot.Slottable>;
}

/** The text a slotted child carries, for a tooltip or label that repeats it. */
export function slotContent(asChild: boolean | undefined, children: ReactNode) {
  const child = asChild ? resolveChild(children) : children;
  return asChild && isValidElement<{ children?: ReactNode }>(child) ? child.props.children : children;
}
