import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import {
  Button,
  Card,
  ErrorText,
  Field,
  Input,
  PageTitle,
  PinPad,
  Screen,
} from "@/components/ui";
import { FREQUENCY_LABEL, type Frequency } from "@/lib/dates";
import {
  createAdashi,
  createAllowance,
  createLocked,
  createMySavings,
  previewContribution,
} from "@/lib/fns/plans";
import { getProductSettings } from "@/lib/fns/profile";
import { formatNaira, nairaToKobo, parseNairaInput } from "@/lib/money";
import {
  PRODUCTS,
  allowanceTerms,
  adashiTerms,
  lockedTerms,
  mySavingsTerms,
  type AllSettings,
  type LockMode,
  type ProductType,
} from "@/lib/products";

export const Route = createFileRoute("/plans/new/$product")({ component: NewPlanRoute });

function NewPlanRoute() {
  const { product } = Route.useParams();
  const slug = product as ProductType;
  if (!PRODUCTS[slug]) {
    return (
      <Screen>
        <p>Unknown product.</p>
        <Link to="/plans">Back</Link>
      </Screen>
    );
  }
  return (
    <SessionGate>
      {() => <Wizard slug={slug} />}
    </SessionGate>
  );
}

function Wizard({ slug }: { slug: ProductType }) {
  const [settings, setSettings] = useState<AllSettings | null>(null);
  useEffect(() => {
    getProductSettings().then(setSettings).catch(() => setSettings(null));
  }, []);
  return (
    <AppShell>
      <Screen>
        <PageTitle kicker="New plan" title={PRODUCTS[slug].name} />
        <p className="mb-6 text-sm text-moss">{PRODUCTS[slug].blurb}</p>
        {!settings ? <p className="text-sm text-moss">Loading terms…</p> : <Form slug={slug} settings={settings} />}
      </Screen>
    </AppShell>
  );
}

function Form({ slug, settings }: { slug: ProductType; settings: AllSettings }) {
  if (slug === "adashi") return <AdashiForm settings={settings} />;
  if (slug === "my_savings") return <MySavingsForm settings={settings} />;
  if (slug === "locked") return <LockedForm settings={settings} />;
  return <AllowanceForm settings={settings} />;
}

function Terms({ lines, accepted, onChange }: { lines: string[]; accepted: boolean; onChange: (v: boolean) => void }) {
  return (
    <Card className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Read this first</p>
      <ol className="list-decimal space-y-2 pl-4 text-sm text-moss">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-forest"
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
        />
        I have read these terms and I agree.
      </label>
    </Card>
  );
}

function AdashiForm({ settings }: { settings: AllSettings }) {
  const navigate = useNavigate();
  const s = settings.adashi;
  const [amount, setAmount] = useState(String(s.suggestedNaira[2] ?? 1000));
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const naira = parseNairaInput(amount);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await createAdashi({ data: { contributionNaira: naira, frequency, accepted } });
      navigate({ to: "/plans/$planId", params: { planId: String(res.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open Adashi.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="How much each time?">
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
      </Field>
      <div className="flex flex-wrap gap-2">
        {s.suggestedNaira.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setAmount(String(n))}
            className="rounded-full bg-cream px-3 py-1.5 text-sm shadow-[var(--shadow-card)]"
          >
            {formatNaira(nairaToKobo(n))}
          </button>
        ))}
      </div>
      <Field label="Schedule">
        <div className="grid grid-cols-2 gap-2">
          {s.frequencies.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`h-11 rounded-md text-sm font-semibold ${frequency === f ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`}
            >
              {FREQUENCY_LABEL[f]}
            </button>
          ))}
        </div>
      </Field>
      <Card>
        <p className="text-sm text-moss">30-day personal cycle. Your payout never waits on another customer.</p>
        <p className="mt-2 text-sm">
          If you keep this up: about {formatNaira(nairaToKobo(naira) * (frequency === "daily" ? 30 : 5))} over the cycle,
          before any missed-contribution penalty or payout fee.
        </p>
      </Card>
      <Terms lines={adashiTerms(s)} accepted={accepted} onChange={setAccepted} />
      <ErrorText>{error}</ErrorText>
      <Button className="w-full" disabled={busy || !accepted} onClick={submit}>
        {busy ? "Opening…" : "Start Adashi"}
      </Button>
    </div>
  );
}

function MySavingsForm({ settings }: { settings: AllSettings }) {
  const navigate = useNavigate();
  const s = settings.my_savings;
  const [title, setTitle] = useState("Shop restock");
  const [goal, setGoal] = useState("100000");
  const [days, setDays] = useState("60");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ contributionKobo: number; periods: number; endDate: string | null } | null>(null);

  const goalNaira = parseNairaInput(goal);
  const durationDays = Number(days) || 0;

  useEffect(() => {
    const t = window.setTimeout(() => {
      previewContribution({ data: { goalNaira, durationDays, frequency } })
        .then(setPreview)
        .catch(() => setPreview(null));
    }, 200);
    return () => window.clearTimeout(t);
  }, [goalNaira, durationDays, frequency]);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await createMySavings({
        data: { title, goalNaira, durationDays, frequency, accepted },
      });
      navigate({ to: "/plans/$planId", params: { planId: String(res.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the goal.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="What is this for?">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Target amount">
        <Input value={goal} onChange={(e) => setGoal(e.target.value)} inputMode="numeric" />
      </Field>
      <Field label="Duration (days)">
        <Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" />
      </Field>
      <Field label="How often will you save?">
        <div className="grid grid-cols-3 gap-2">
          {s.frequencies.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`h-11 rounded-md text-xs font-semibold ${frequency === f ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`}
            >
              {FREQUENCY_LABEL[f]}
            </button>
          ))}
        </div>
      </Field>
      {preview && preview.contributionKobo > 0 ? (
        <Card className="bg-leaf">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest-deep">Suggested contribution</p>
          <p className="mt-1 font-display text-2xl font-semibold">{formatNaira(preview.contributionKobo)}</p>
          <p className="mt-1 text-sm text-moss">
            {preview.periods} payments · ends {preview.endDate}
          </p>
        </Card>
      ) : null}
      <Terms lines={mySavingsTerms(s)} accepted={accepted} onChange={setAccepted} />
      <ErrorText>{error}</ErrorText>
      <Button className="w-full" disabled={busy || !accepted} onClick={submit}>
        {busy ? "Creating…" : "Create goal"}
      </Button>
    </div>
  );
}

function LockedForm({ settings }: { settings: AllSettings }) {
  const navigate = useNavigate();
  const s = settings.locked;
  const [title, setTitle] = useState("Hold for later");
  const [mode, setMode] = useState<LockMode>("either");
  const [target, setTarget] = useState("50000");
  const [days, setDays] = useState("30");
  const [funding, setFunding] = useState("10000");
  const [pin, setPin] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await createLocked({
        data: {
          title,
          mode,
          targetNaira: mode === "date" || mode === "open" ? undefined : parseNairaInput(target),
          durationDays: mode === "target" || mode === "open" ? undefined : Number(days),
          fundingNaira: parseNairaInput(funding),
          pin,
          accepted,
        },
      });
      navigate({ to: "/plans/$planId", params: { planId: String(res.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not lock this amount.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-moss">
        Locking moves money from your available wallet into this plan. Deposit first if the wallet is empty.
      </p>
      <Field label="Name">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Unlock rule">
        <div className="grid grid-cols-2 gap-2">
          {s.modes.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`h-11 rounded-md text-xs font-semibold capitalize ${mode === m ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </Field>
      {mode === "target" || mode === "either" ? (
        <Field label="Target amount">
          <Input value={target} onChange={(e) => setTarget(e.target.value)} inputMode="numeric" />
        </Field>
      ) : null}
      {mode === "date" || mode === "either" ? (
        <Field label="Days until maturity">
          <Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" />
        </Field>
      ) : null}
      <Field label="Amount to lock now">
        <Input value={funding} onChange={(e) => setFunding(e.target.value)} inputMode="numeric" />
      </Field>
      <Terms lines={lockedTerms(s, mode)} accepted={accepted} onChange={setAccepted} />
      <PinPad value={pin} onChange={setPin} label="Confirm with your PIN" />
      <ErrorText>{error}</ErrorText>
      <Button className="w-full" disabled={busy || !accepted || pin.length < 4} onClick={submit}>
        {busy ? "Locking…" : "Lock this money"}
      </Button>
    </div>
  );
}

function AllowanceForm({ settings }: { settings: AllSettings }) {
  const navigate = useNavigate();
  const s = settings.allowance;
  const [lump, setLump] = useState("100000");
  const [allowance, setAllowance] = useState("20000");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [pct, setPct] = useState(s.defaultEarlyBreakPct);
  const [pin, setPin] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lumpNaira = parseNairaInput(lump);
  const allowanceNaira = parseNairaInput(allowance);
  const count = allowanceNaira > 0 ? Math.floor(lumpNaira / allowanceNaira) : 0;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await createAllowance({
        data: {
          lumpNaira,
          allowanceNaira,
          frequency,
          earlyBreakPct: pct,
          pin,
          accepted,
        },
      });
      navigate({ to: "/plans/$planId", params: { planId: String(res.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the allowance plan.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-moss">
        The lump sum is taken from your available wallet. Deposit first if you need to.
      </p>
      <Field label="Lump sum">
        <Input value={lump} onChange={(e) => setLump(e.target.value)} inputMode="numeric" />
      </Field>
      <Field label="Allowance each time">
        <Input value={allowance} onChange={(e) => setAllowance(e.target.value)} inputMode="numeric" />
      </Field>
      <Field label="Release every">
        <div className="grid grid-cols-2 gap-2">
          {s.frequencies.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`h-11 rounded-md text-xs font-semibold ${frequency === f ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`}
            >
              {FREQUENCY_LABEL[f]}
            </button>
          ))}
        </div>
      </Field>
      <Field label={`Early-break charge: ${pct}%`} hint="If you break the plan, this share of remaining restricted funds is forfeited.">
        <input
          type="range"
          min={s.minEarlyBreakPct}
          max={s.maxEarlyBreakPct}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="w-full accent-forest"
        />
      </Field>
      {count > 0 ? (
        <Card className="bg-leaf">
          <p className="text-sm">
            {count} releases of {formatNaira(nairaToKobo(allowanceNaira))}. Remainder stays restricted until the last date
            or an early break.
          </p>
        </Card>
      ) : null}
      <Terms lines={allowanceTerms(s, pct)} accepted={accepted} onChange={setAccepted} />
      <PinPad value={pin} onChange={setPin} label="Confirm with your PIN" />
      <ErrorText>{error}</ErrorText>
      <Button className="w-full" disabled={busy || !accepted || pin.length < 4} onClick={submit}>
        {busy ? "Opening…" : "Start allowance"}
      </Button>
    </div>
  );
}
