import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Home, Layers3, Store, UserRound, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FaddahyMark } from "./mark";

const TABS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/plans", label: "Plans", icon: Layers3 },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/market", label: "Market", icon: Store },
  { to: "/profile", label: "Me", icon: UserRound },
] as const;

export function AppShell({
  children,
  unread = 0,
}: {
  children: ReactNode;
  unread?: number;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-paper">
      <div className="pointer-events-none fixed inset-0 hidden lg:block">
        <div className="absolute inset-y-0 left-0 w-[28%] bg-forest-deep" />
        <div className="absolute bottom-12 left-10 max-w-xs text-cream">
          <FaddahyMark className="mb-4 h-10 w-10 text-cream" />
          <p className="font-display text-3xl font-semibold leading-tight">Faddahy Savings</p>
          <p className="mt-2 text-sm text-cream/80">Simple savings that make sense to the poor.</p>
        </div>
      </div>
      <div className="relative mx-auto min-h-dvh max-w-lg bg-paper shadow-[var(--shadow-card)] lg:min-h-dvh">
        <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Link to="/home" className="flex items-center gap-2">
            <FaddahyMark className="h-8 w-8" />
            <span className="font-display text-lg font-semibold">Faddahy</span>
          </Link>
          <Link
            to="/alerts"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-cream shadow-[var(--shadow-card)]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 ? (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-forest" />
            ) : null}
          </Link>
        </div>
        {children}
        <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-lg -translate-x-1/2 border-t border-line bg-cream/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur">
          <ul className="grid grid-cols-5">
            {TABS.map((tab) => {
              const active = pathname === tab.to || pathname.startsWith(`${tab.to}/`);
              const Icon = tab.icon;
              return (
                <li key={tab.to}>
                  <Link
                    to={tab.to}
                    className={cn(
                      "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                      active ? "text-forest" : "text-moss",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
