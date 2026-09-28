import { createFileRoute } from "@tanstack/react-router";
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
  PageTitle,
  PinPad,
  Screen,
} from "@/components/ui";
import { confirmSandboxDeposit, createDeposit, getWalletOverview, requestWithdrawal } from "@/lib/fns/wallet";
import { formatDateTime } from "@/lib/dates";
import { formatNaira, parseNairaInput } from "@/lib/money";
import type { LedgerEntry, PaymentIntent } from "@/lib/types";
import type { WalletSettings } from "@/lib/products";

export const Route = createFileRoute("/wallet")({ component: WalletRoute });

function WalletRoute() {
  return (
    <SessionGate>
      {() => <WalletPage />}
    </SessionGate>
  );
}

function WalletPage() {
  const [tab, setTab] = useState<"overview" | "deposit" | "withdraw">("overview");
  const [data, setData] = useState<{
    availableKobo: number;
    restrictedKobo: number;
    payments: PaymentIntent[];
    ledger: LedgerEntry[];
    walletSettings: WalletSettings;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    getWalletOverview()
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load wallet."));
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <AppShell>
      <Screen>
        <PageTitle kicker="Money" title="Wallet" />
        <Card className="bg-forest-deep text-cream">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/70">Available</p>
          <Money kobo={data?.availableKobo ?? 0} size="lg" className="text-cream" />
          <p className="mt-3 text-sm text-cream/80">
            Restricted {formatNaira(data?.restrictedKobo ?? 0)} stays in plans until a rule releases it.
          </p>
        </Card>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={() => setTab("deposit")}>Deposit</Button>
          <Button variant="secondary" onClick={() => setTab("withdraw")}>
            Withdraw
          </Button>
        </div>
        {data?.walletSettings.sandbox ? (
          <p className="mt-3 text-xs text-moss">
            Sandbox rail — deposits are verified server-side and credited once per unique reference. Live naira needs a
            licensed Nigerian partner.
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        {tab === "deposit" && data ? (
          <DepositForm
            settings={data.walletSettings}
            onDone={() => {
              setTab("overview");
              reload();
            }}
          />
        ) : null}
        {tab === "withdraw" && data ? (
          <WithdrawForm
            available={data.availableKobo}
            settings={data.walletSettings}
            onDone={() => {
              setTab("overview");
              reload();
            }}
          />
        ) : null}

        <h2 className="mt-8 font-display text-xl font-semibold">Payments</h2>
        <div className="mt-3 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]">
          {data?.payments.length ? (
            data.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold capitalize">
                    {p.kind} · {formatNaira(p.amountKobo)}
                  </p>
                  <p className="font-mono text-[11px] text-sage">{p.reference}</p>
                </div>
                <Badge tone={p.status === "succeeded" ? "good" : p.status === "failed" ? "bad" : "warn"}>
                  {p.status}
                </Badge>
              </div>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-moss">No payments yet.</p>
          )}
        </div>

        <h2 className="mt-8 font-display text-xl font-semibold">Ledger</h2>
        <div className="mt-3 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]">
          {data?.ledger.map((row) => (
            <div key={row.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm">{row.description}</p>
                <Money kobo={row.amountKobo} size="sm" className={row.amountKobo < 0 ? "text-danger" : "text-forest"} />
              </div>
              <p className="text-[11px] text-sage">
                {formatDateTime(row.createdAt)} · {row.reference}
              </p>
            </div>
          ))}
        </div>
      </Screen>
    </AppShell>
  );
}

function DepositForm({
  settings,
  onDone,
}: {
  settings: WalletSettings;
  onDone: () => void;
}) {
  const [amount, setAmount] = useState("5000");
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const row = await createDeposit({ data: { naira: parseNairaInput(amount) } });
      setIntent(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start deposit.");
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!intent) return;
    setBusy(true);
    setError(null);
    try {
      await confirmSandboxDeposit({ data: { reference: intent.reference } });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm.");
      setBusy(false);
    }
  }

  return (
    <Card className="mt-4 space-y-4">
      <h3 className="font-display text-lg font-semibold">Sandbox deposit</h3>
      {!intent ? (
        <>
          <Field label="Amount" hint={`Between ₦${settings.minDepositNaira.toLocaleString("en-NG")} and ₦${settings.maxDepositNaira.toLocaleString("en-NG")}.`}>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
          </Field>
          <ErrorText>{error}</ErrorText>
          <Button className="w-full" disabled={busy} onClick={start}>
            {busy ? "Creating reference…" : "Get payment reference"}
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-moss">
            Transfer is simulated. The ledger will not move until this reference is verified on the server. Confirming
            twice will not credit twice.
          </p>
          <div className="rounded-md bg-leaf px-3 py-2 font-mono text-sm">{intent.reference}</div>
          <p className="text-sm">Amount {formatNaira(intent.amountKobo)}</p>
          <ErrorText>{error}</ErrorText>
          <Button className="w-full" disabled={busy} onClick={confirm}>
            {busy ? "Verifying…" : "I have sent the transfer"}
          </Button>
        </>
      )}
    </Card>
  );
}

function WithdrawForm({
  available,
  settings,
  onDone,
}: {
  available: number;
  settings: WalletSettings;
  onDone: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("GTBank");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await requestWithdrawal({
        data: {
          naira: parseNairaInput(amount),
          pin,
          bank,
          accountNumber,
          accountName,
        },
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not withdraw.");
      setBusy(false);
    }
  }

  return (
    <Card className="mt-4 space-y-4">
      <h3 className="font-display text-lg font-semibold">Withdraw available funds</h3>
      <p className="text-sm text-moss">
        Only available money can leave. Restricted plan balances stay until their rule says otherwise. Available{" "}
        {formatNaira(available)}. Min ₦{settings.minWithdrawalNaira.toLocaleString("en-NG")}.
      </p>
      <Field label="Amount">
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
      </Field>
      <Field label="Bank">
        <Input value={bank} onChange={(e) => setBank(e.target.value)} />
      </Field>
      <Field label="Account number">
        <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} inputMode="numeric" maxLength={10} />
      </Field>
      <Field label="Account name">
        <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} />
      </Field>
      <PinPad value={pin} onChange={setPin} />
      <ErrorText>{error}</ErrorText>
      <Button className="w-full" disabled={busy || pin.length < 4} onClick={submit}>
        {busy ? "Sending…" : "Request withdrawal"}
      </Button>
    </Card>
  );
}
