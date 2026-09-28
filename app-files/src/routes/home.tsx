import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Lock, Plus, Target, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import { Badge, Card, Empty, Money, ProgressBar, Screen } from "@/components/ui";
import { formatShortDate } from "@/lib/dates";
import { getDashboard } from "@/lib/fns/profile";
import { PRODUCTS, type ProductType } from "@/lib/products";
import type { Dashboard } from "@/lib/types";
import { formatNaira } from "@/lib/money";

export const Route = createFileRoute("/home")({ component: HomeRoute });

const ICONS: Record<ProductType, typeof Wallet> = {
  adashi: CalendarDays,
  my_savings: Target,
  locked: Lock,
  allowance: Wallet,
};

function HomeRoute() {
  return (
    <SessionGate>
      {(profile) => <Home name={profile.displayName} />}
    </SessionGate>
  );
}

function Home({ name }: { name: string }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load."));
  }, []);

  const first = name.split(" ")[0] || "there";
  const total = (data?.wallet.availableKobo ?? 0) + (data?.wallet.restrictedKobo ?? 0);
  const active = data?.plans.filter((p) => p.status === "active" || p.status === "matured" || p.status === "unlocked") ?? [];

  return (
    <AppShell unread={data?.unreadCount ?? 0}>
      <Screen>
        <p className="text-sm text-moss">Good to see you,</p>
        <h1 className="font-display text-3xl font-semibold">{first}</h1>

        <Card className="mt-5 bg-forest-deep p-5 text-cream">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/70">Total savings</p>
          <Money kobo={total} size="lg" className="mt-1 block text-cream" />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-cream/70">Available</p>
              <Money kobo={data?.wallet.availableKobo ?? 0} size="sm" className="text-cream" />
            </div>
            <div>
              <p className="text-cream/70">Restricted</p>
              <Money kobo={data?.wallet.restrictedKobo ?? 0} size="sm" className="text-cream" />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Link to="/wallet" className="rounded-md bg-cream px-3 py-2 text-sm font-semibold text-forest-deep">
              Deposit
            </Link>
            <Link to="/plans" className="rounded-md border border-cream/30 px-3 py-2 text-sm font-semibold text-cream">
              New plan
            </Link>
          </div>
        </Card>

        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

        {data?.announcements[0] ? (
          <Card className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">From Faddahy</p>
            <p className="mt-1 font-semibold">{data.announcements[0].title}</p>
            <p className="mt-1 text-sm text-moss">{data.announcements[0].body}</p>
          </Card>
        ) : null}

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold">Products</h2>
            <Link to="/plans" className="text-sm font-semibold text-forest">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(PRODUCTS).map((p) => {
              const Icon = ICONS[p.slug];
              return (
                <Link key={p.slug} to="/plans/new/$product" params={{ product: p.slug }} className="rounded-xl bg-cream p-4 shadow-[var(--shadow-card)]">
                  <span className="grid h-9 w-9 place-items-center rounded-sm bg-leaf text-forest">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-3 font-display text-lg font-semibold leading-tight">{p.name}</p>
                  <p className="mt-1 text-xs text-moss">{p.short}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-semibold">Active plans</h2>
          {active.length === 0 ? (
            <Empty
              title="No plan yet"
              body="Start with Adashi if you want a 30-day habit, or My Savings if you have a goal."
              action={
                <Link to="/plans" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest">
                  <Plus className="h-4 w-4" /> Open a plan
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {active.slice(0, 4).map((plan) => {
                const pct =
                  plan.targetKobo && plan.targetKobo > 0
                    ? Math.min(100, (plan.savedKobo / plan.targetKobo) * 100)
                    : 0;
                return (
                  <Link key={plan.id} to="/plans/$planId" params={{ planId: String(plan.id) }}>
                    <Card>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">
                            {PRODUCTS[plan.productType].name}
                          </p>
                          <p className="font-semibold">{plan.title}</p>
                        </div>
                        <Badge tone={plan.unlockEligible ? "good" : "neutral"}>{plan.status}</Badge>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <Money kobo={plan.savedKobo || plan.restrictedKobo} size="sm" />
                        {plan.targetKobo ? (
                          <span className="text-xs text-moss">of {formatNaira(plan.targetKobo)}</span>
                        ) : null}
                      </div>
                      {plan.targetKobo ? <ProgressBar className="mt-2" value={pct} /> : null}
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-semibold">Coming up</h2>
          {data?.upcoming.length ? (
            <Card className="divide-y divide-line p-0">
              {data.upcoming.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{item.planTitle}</p>
                    <p className="text-xs text-moss">
                      {item.kind === "allowance" ? "Allowance" : "Contribution"} · {formatShortDate(item.dueDate)}
                    </p>
                  </div>
                  <Money kobo={item.amountKobo} size="sm" />
                </div>
              ))}
            </Card>
          ) : (
            <p className="text-sm text-moss">No upcoming dates yet.</p>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold">Recent</h2>
            <Link to="/wallet" className="text-sm font-semibold text-forest">
              Ledger
            </Link>
          </div>
          {data?.recent.length ? (
            <Card className="divide-y divide-line p-0">
              {data.recent.slice(0, 5).map((row) => (
                <div key={row.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{row.description}</p>
                    <p className="font-mono text-[11px] text-sage">{row.reference}</p>
                  </div>
                  <Money
                    kobo={row.amountKobo}
                    size="sm"
                    className={row.amountKobo < 0 ? "text-danger" : "text-forest"}
                  />
                </div>
              ))}
            </Card>
          ) : (
            <p className="text-sm text-moss">No movements yet. Deposit to begin.</p>
          )}
        </section>

        <Link to="/support" className="mt-8 flex items-center justify-between rounded-xl bg-cream px-4 py-3 shadow-[var(--shadow-card)]">
          <span className="text-sm font-semibold">Help and product rules</span>
          <ChevronRight className="h-4 w-4 text-moss" />
        </Link>
      </Screen>
    </AppShell>
  );
}
