import { cn } from "@/lib/cn";

export function FaddahyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-forest", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M8 21.5c0-1.2.6-2.4 2.2-3.2C11.7 17.6 13.7 17 16 17s4.3.6 5.8 1.3c1.6.8 2.2 2 2.2 3.2 0 .8-.5 1.5-1.6 1.5H9.6c-1.1 0-1.6-.7-1.6-1.5Z"
        fill="#F4EFE4"
      />
      <path
        d="M16 8.5c.2 2.4 1.1 4.1 2.8 5.4-1.9.3-3.4 1.2-4.3 2.6-.2-2.6.2-4.9 1.5-8Z"
        fill="#F4EFE4"
      />
    </svg>
  );
}
