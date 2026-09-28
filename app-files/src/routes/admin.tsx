import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/guard";
import { FaddahyMark } from "@/components/mark";
import { cn } from "@/lib/cn";
import { getStaffContext } from "@/lib/fns/admin";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const LINKS = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/plans", label: "Plans" },
  { to: "/admin/ledger", label: "Ledger" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminLayout() {
  return (
    <SessionGate>
      {() => <Gate />}
    </SessionGate>
  );
}

function Gate() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    getStaffContext()
      .then((s) => setOk(["admin", "finance", "support"].includes(s.profile.role)))
      .catch(() => setOk(false));
  }, []);
  if (ok === null) return <p className="p-8 text-sm text-moss">Checking staff access…</p>;
  if (!ok) return <Navigate to="/profile" />;
  return <AdminShell />;
}

function AdminShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line bg-cream px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link to="/home" className="flex items-center gap-2">
            <FaddahyMark className="h-8 w-8" />
            <span className="font-display text-lg font-semibold">Staff desk</span>
          </Link>
          <Link to="/home" className="text-sm text-moss">
            Back to app
          </Link>
        </div>
        <nav className="mx-auto mt-3 flex max-w-5xl gap-1 overflow-x-auto">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold",
                  active ? "bg-forest text-cream" : "text-moss",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
