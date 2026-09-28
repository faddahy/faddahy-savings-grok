import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "forest";
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold tracking-tight transition-[transform,background-color,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-forest text-cream hover:bg-forest-deep",
        variant === "forest" && "bg-ink text-cream hover:bg-forest-deep",
        variant === "secondary" && "bg-cream text-ink shadow-[var(--shadow-card)] hover:bg-leaf",
        variant === "ghost" && "bg-transparent text-ink hover:bg-leaf",
        variant === "danger" && "bg-danger text-cream hover:opacity-90",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-moss">{hint}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-cream px-3 text-base text-ink outline-none transition-shadow duration-150 placeholder:text-sage focus:border-forest focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-forest)_18%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-line bg-cream px-3 py-2 text-base text-ink outline-none transition-shadow duration-150 placeholder:text-sage focus:border-forest focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-forest)_18%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl bg-cream p-4 shadow-[var(--shadow-card)]", className)}>
      {children}
    </div>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn" | "bad" | "forest";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tone === "neutral" && "bg-paper text-moss",
        tone === "good" && "bg-leaf text-forest-deep",
        tone === "warn" && "bg-warn-soft text-warn",
        tone === "bad" && "bg-danger-soft text-danger",
        tone === "forest" && "bg-forest text-cream",
      )}
    >
      {children}
    </span>
  );
}

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-28 pt-4", className)}>
      {children}
    </div>
  );
}

export function PageTitle({
  kicker,
  title,
  action,
}: {
  kicker?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 flex items-end justify-between gap-3">
      <div>
        {kicker ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-moss">{kicker}</p>
        ) : null}
        <h1 className="font-display text-[1.75rem] font-semibold text-ink">{title}</h1>
      </div>
      {action}
    </header>
  );
}

export function Money({
  kobo,
  className,
  size = "md",
}: {
  kobo: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const naira = (kobo || 0) / 100;
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: naira % 1 === 0 ? 0 : 2,
  }).format(naira);
  return (
    <span
      className={cn(
        "tabular-nums tracking-tight",
        size === "sm" && "text-sm font-semibold",
        size === "md" && "text-lg font-semibold",
        size === "lg" && "font-display text-3xl font-semibold",
        className,
      )}
    >
      {formatted}
    </span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-paper", className)}>
      <div
        className="h-full rounded-full bg-forest transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function PinPad({
  value,
  onChange,
  label = "Enter your 4-digit PIN",
}: {
  value: string;
  onChange: (next: string) => void;
  label?: string;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-moss">{label}</p>
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 w-3.5 rounded-full border border-line-strong",
              value.length > i ? "bg-forest border-forest" : "bg-transparent",
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key, i) =>
          key === "" ? (
            <span key={i} />
          ) : (
            <button
              key={key}
              type="button"
              className="flex h-14 items-center justify-center rounded-lg bg-cream text-lg font-semibold shadow-[var(--shadow-card)] active:scale-[0.98]"
              onClick={() => {
                if (key === "⌫") onChange(value.slice(0, -1));
                else if (value.length < 4) onChange(value + key);
              }}
            >
              {key}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-start gap-2">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="text-sm text-moss">{body}</p>
      {action}
    </Card>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-danger">{children}</p>;
}
