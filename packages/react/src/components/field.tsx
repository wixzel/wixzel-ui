import { WarningCircle } from "@phosphor-icons/react";
import { Label as LabelPrimitive } from "radix-ui";
import { type ComponentProps, createContext, type ReactNode, useContext, useId } from "react";
import { cn } from "../lib/cn";

interface FieldContextValue {
  id: string;
  hintId?: string;
  errorId?: string;
  invalid: boolean;
  disabled?: boolean;
  required?: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Props a control spreads to join the surrounding <Field>: its id, the
 * description ids, and the invalid state. Outside a Field it returns nothing.
 */
export function useFieldControl(props: {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: ComponentProps<"input">["aria-invalid"];
  disabled?: boolean;
  required?: boolean;
}) {
  const field = useContext(FieldContext);
  if (!field) return props;
  const describedBy = [props["aria-describedby"], field.hintId, field.errorId].filter(Boolean).join(" ");
  return {
    id: props.id ?? field.id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
    disabled: props.disabled ?? field.disabled,
    required: props.required ?? field.required,
  };
}

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "inline-flex select-none items-center gap-1 text-body-sm font-medium text-fg",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export interface FieldProps extends Omit<ComponentProps<"div">, "children"> {
  label?: ReactNode;
  /** Help shown under the control until there is an error. */
  hint?: ReactNode;
  /** Replaces the hint and marks the control invalid. Say what to do, not just what went wrong. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Text after the label, such as "Optional". */
  labelAside?: ReactNode;
  children: ReactNode;
}

/** Label, control, hint and error, wired together for screen readers. */
export function Field({
  label,
  hint,
  error,
  required,
  disabled,
  labelAside,
  className,
  children,
  id: idProp,
  ...props
}: FieldProps) {
  const auto = useId();
  const id = idProp ?? `wx-field-${auto}`;
  const hintId = hint && !error ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <FieldContext.Provider value={{ id, hintId, errorId, invalid: Boolean(error), disabled, required }}>
      <div className={cn("group/field flex flex-col gap-1.5", disabled && "opacity-60", className)} {...props}>
        {label && (
          <div className="flex items-baseline justify-between gap-2">
            <Label htmlFor={id}>
              {label}
              {required && (
                <span aria-hidden className="text-danger-ink">
                  *
                </span>
              )}
            </Label>
            {labelAside && <span className="text-caption text-fg-subtle">{labelAside}</span>}
          </div>
        )}
        {children}
        {hintId && (
          <p id={hintId} className="text-caption text-fg-muted">
            {hint}
          </p>
        )}
        {errorId && (
          <p
            id={errorId}
            className="flex animate-wx-fade-in items-start gap-1.5 text-caption font-medium text-danger-ink"
          >
            <WarningCircle aria-hidden className="mt-px size-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}
