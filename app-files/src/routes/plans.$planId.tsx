import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import {
  Badge,
  Button,
  Card,
  ErrorText,
  Field,
  Input,
  Money,
  PinPad,
  ProgressBar,
  Screen,
} from "@/components/ui";
import { formatLongDate, formatShortDate, FREQUENCY_LABEL, type Frequency } from "@/lib/dates";
import { contributeToPlan, getPlan, withdrawFromPlan } from "@/lib/fns/plans";
import { formatNaira, parseNairaInput } from "@/lib/money";
import { PRODUCTS } from "@/lib/products";
import type { LedgerEntry, SavingsPlan, ScheduleItem } from "@/lib/types";
import type { AllSettings } from "@/lib/products";

export const Route = createFileRoute("/plans/$planId")({ component: PlanRoute });

function PlanRoute() {
  const { planId } = Route.useParams();
  return (
    <SessionGate>
      {() => <PlanPage id={Number(planId)} />}
    </SessionGate>
  );
}

function PlanPage({ id }: { id: number }) {
  const [data, setData] = useState<{
    plan: SavingsPlan;
    schedule: ScheduleItem[];
    ledger: LedgerEntry[];
    settings: AllSettings;
    wallet: { availableKobo: number; restrictedKobo: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"contribute" | "withdraw" | "break" | null>(null);

  function reload() {
    getPlan({ data: { id } })
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load this plan."));
  }

  useEffect(() => {
    reload();
  }, [id]);

  if (error && !data) {
    return (
      <AppShell>
        <Screen>
          <p className="text-sm text-danger">{error}</p>
          <Link to="/plans" className="mt-3 text-sm font-semibold text-forest">
            Back to plans
          </Link>
        </Screen>
      </AppShell>
    );
  }
  if (!data) {
    return (
      <AppShell>
        <Screen>
          <p className="text-sm text-moss">Loading plan…</p>
        </Screen>
      </AppShell>
    );
  }

  const { plan, schedule, ledger, wallet } = data;
  const product = PRODUCTS[plan.productType];
  const pct =
    plan.targetKobo && plan.targetKobo > 0 ? Math.min(100, (plan.savedKobo / plan.targetKobo) * 100) : 0;
  const completed = schedule.filter((s) => s.status === "completed" || s.status === "released").length;
  const missed = schedule.filter((s) => s.status === "missed").length;
  const pending = schedule.filter((s) => s.status === "pending");

  return (
    <AppShell>
      <Screen>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">{product.name}</p>
        <h1 className="font-display text-3xl font-semibold">{plan.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge tone={plan.unlockEligible ? "good" : "neutral"}>{plan.status}</Badge>
          {plan.frequency ? <Badge>{FREQUENCY_LABEL[plan.frequency as Frequency]}</Badge> : null}
        </div>

        <Card className="mt-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-moss">In this plan</p>
              <Money kobo={plan.restrictedKobo + plan.availableKobo} />
            </div>
            <div>
              <p className="text-xs text-moss">Saved</p>
              <Money kobo={plan.savedKobo} />
            </div>
            <div>
              <p className="text-xs text-moss">Released</p>
              <Money kobo={plan.availableKobo} />
            </div>
            <div>
              <p className="text-xs text-moss">Still held</p>
              <Money kobo={plan.restrictedKobo} />
            </div>
          </div>
          {plan.targetKobo ? (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-moss">
                <span>Progress</span>
                <span>
                  {formatNaira(plan.savedKobo)} of {formatNaira(plan.targetKobo)}
                </span>
              </div>
              <ProgressBar value={pct} />
            </div>
          ) : null}
          <p className="mt-3 text-sm text-moss">{plan.unlockReason}</p>
          {plan.startDate ? (
            <p className="mt-2 text-xs text-sage">
              {formatLongDate(plan.startDate)}
              {plan.endDate || plan.maturityDate ? ` → ${formatLongDate(plan.endDate ?? plan.maturityDate ?? "")}` : ""}
            </p>
          ) : null}
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {plan.productType === "adashi" || plan.productType === "my_savings" || plan.productType === "locked" ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setAction("contribute")}
              disabled={plan.status === "withdrawn" || plan.status === "cancelled"}
            >
              Contribute
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" onClick={() => setAction("withdraw")} disabled={plan.availableKobo <= 0}>
              Take allowance
            </Button>
          )}
          <Button
            className="w-full"
            onClick={() => setAction("withdraw")}
            disabled={!plan.unlockEligible && plan.productType !== "my_savings" && plan.productType !== "allowance"}
          >
            {plan.productType === "allowance" ? "Withdraw released" : "Withdraw"}
          </Button>
        </div>
        {plan.productType === "allowance" && plan.status === "active" && plan.restrictedKobo > 0 ? (
          <button
            type="button"
            className="mt-3 w-full text-sm text-danger underline-offset-4 hover:underline"
            onClick={() => setAction("break")}
          >
            Break plan early
          </button>
        ) : null}

        {action ? (
          <PlanAction
            kind={action}
            plan={plan}
            wallet={wallet}
            onClose={() => setAction(null)}
            onDone={() => {
              setAction(null);
              reload();
            }}
          />
        ) : null}

        {schedule.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">Calendar</h2>
            <p className="mt-1 text-sm text-moss">
              {completed} done · {missed} missed · {pending.length} outstanding
            </p>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  title={`${item.dueDate} · ${item.status} · ${formatNaira(item.amountKobo)}`}
                  className={
                    item.status === "completed" || item.status === "released"
                      ? "rounded-sm bg-forest p-1.5"
                      : item.status === "missed"
                        ? "rounded-sm bg-danger/80 p-1.5"
                        : item.status === "skipped"
                          ? "rounded-sm bg-line p-1.5"
                          : "rounded-sm bg-cream p-1.5 shadow-[var(--shadow-card)]"
                  }
                >
                  <p
                    className={`text-center text-[10px] font-semibold ${item.status === "completed" || item.status === "released" || item.status === "missed" ? "text-cream" : "text-moss"}`}
                  >
                    {item.dueDate.slice(8)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]">
              {schedule.slice(0, 12).map((item) => (
                <div key={`row-${item.id}`} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{formatShortDate(item.dueDate)}</p>
                    <p className="text-xs capitalize text-moss">{item.status}</p>
                  </div>
                  <Money kobo={item.amountKobo} size="sm" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold">Plan ledger</h2>
          {ledger.length === 0 ? (
            <p className="mt-2 text-sm text-moss">No movements on this plan yet.</p>
          ) : (
            <div className="mt-3 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]">
              {ledger.map((row) => (
                <div key={row.id} className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{row.description}</p>
                    <Money
                      kobo={row.amountKobo}
                      size="sm"
                      className={row.amountKobo < 0 ? "text-danger" : "text-forest"}
                    />
                  </div>
                  <p className="font-mono text-[11px] text-sage">{row.reference}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </Screen>
    </AppShell>
  );
}

function PlanAction({
  kind,
  plan,
  wallet,
  onClose,
  onDone,
}: {
  kind: "contribute" | "withdraw" | "break";
  plan: SavingsPlan;
  wallet: { availableKobo: number };
  onClose: () => void;
  onDone: () => void;
}) {
  const defaultNaira =
    kind === "contribute"
      ? String((plan.contributionKobo ?? 0) / 100 || 1000)
      : kind === "break"
        ? String(plan.restrictedKobo / 100)
        : String(
            Math.max(
              0,
              (plan.productType === "allowance" ? plan.availableKobo : plan.restrictedKobo + plan.availableKobo) / 100,
            ),
          );
  const [amount, setAmount] = useState(defaultNaira);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      if (kind === "contribute") {
        await contributeToPlan({
          data: { planId: plan.id, naira: parseNairaInput(amount), pin },
        });
      } else {
        await withdrawFromPlan({
          data: {
            planId: plan.id,
            naira: parseNairaInput(amount) || 1,
            pin,
            earlyBreak: kind === "break",
          },
        });
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete this.");
      setBusy(false);
    }
  }

  return (
    <Card className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">
          {kind === "contribute" ? "Contribute" : kind === "break" ? "Early break" : "Withdraw"}
        </h3>
        <button type="button" className="text-sm text-moss" onClick={onClose}>
          Close
        </button>
      </div>
      {kind === "contribute" ? (
        <p className="text-sm text-moss">
          Taken from available wallet ({formatNaira(wallet.availableKobo)}). Deposit first if you need more.
        </p>
      ) : null}
      {kind === "break" ? (
        <p className="text-sm text-danger">
          {plan.earlyBreakPct}% of the remaining restricted balance will be forfeited. This is recorded as a fee, not
          taken from another customer.
        </p>
      ) : null}
      {kind !== "break" ? (
        <Field label="Amount (naira)">
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
        </Field>
      ) : null}
      <PinPad value={pin} onChange={setPin} />
      <ErrorText>{error}</ErrorText>
      <Button className="w-full" variant={kind === "break" ? "danger" : "primary"} disabled={busy || pin.length < 4} onClick={submit}>
        {busy ? "Working…" : "Confirm"}
      </Button>
    </Card>
  );
}
