import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Lock, Plus, Target, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import { Badge, Card, Empty, Money, PageTitle, ProgressBar, Screen } from "@/components/ui";
import { listPlans } from "@/lib/fns/plans";
import { PRODUCTS, type ProductType } from "@/lib/products";
import type { SavingsPlan } from "@/lib/types";
import { formatNaira } from "@/lib/money";

export const Route = createFileRoute("/plans/")({ component: PlansRoute });

const ICONS: Record<ProductType, typeof Wallet> = {
  adashi: CalendarDays,
  my_savings: Target,
  locked: Lock,
  allowance: Wallet,
};

function PlansRoute() {
  return (
    <SessionGate>
      {() => <PlansPage />}
    </SessionGate>
  );
}

function PlansPage() {
  const [plans, setPlans] = useState<SavingsPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPlans()
      .then(setPlans)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load plans."));
  }, []);

  return (
    <AppShell>
      <Screen>
        <PageTitle kicker="Savings" title="Your plans" />
        <div className="mb-6 grid grid-cols-2 gap-3">
          {Object.values(PRODUCTS).map((p) => {
            const Icon = ICONS[p.slug];
            return (
              <Link
                key={p.slug}
                to="/plans/new/$product"
                params={{ product: p.slug }}
                className="flex items-start gap-2 rounded-xl bg-cream p-3 shadow-[var(--shadow-card)]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-leaf text-forest">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-semibold leading-tight">{p.name}</span>
                  <span className="text-xs text-moss">{p.short}</span>
                </span>
              </Link>
            );
          })}
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {!plans ? <p className="text-sm text-moss">Loading plans…</p> : null}
        {plans && plans.length === 0 ? (
          <Empty
            title="Nothing here yet"
            body="Open a product above. You will see terms, dates, and fees before anything is locked in."
          />
        ) : null}
        <div className="space-y-3">
          {plans?.map((plan) => {
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
                    <Badge
                      tone={
                        plan.status === "cancelled" || plan.status === "broken"
                          ? "bad"
                          : plan.unlockEligible
                            ? "good"
                            : "neutral"
                      }
                    >
                      {plan.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span>
                      Saved <Money kobo={plan.savedKobo} size="sm" />
                    </span>
                    <span className="text-moss">
                      Held <Money kobo={plan.restrictedKobo} size="sm" />
                    </span>
                  </div>
                  {plan.targetKobo ? (
                    <>
                      <ProgressBar className="mt-2" value={pct} />
                      <p className="mt-1 text-xs text-moss">Target {formatNaira(plan.targetKobo)}</p>
                    </>
                  ) : null}
                </Card>
              </Link>
            );
          })}
        </div>
      </Screen>
    </AppShell>
  );
}
