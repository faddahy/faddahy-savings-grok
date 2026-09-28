import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Card, ErrorText, Field, Input } from "@/components/ui";
import { getAdminSettings, listAuditLogs, saveAdminSettings } from "@/lib/fns/admin";
import type { AllSettings } from "@/lib/products";
import { formatDateTime } from "@/lib/dates";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const [logs, setLogs] = useState<Awaited<ReturnType<typeof listAuditLogs>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getAdminSettings().then(setSettings).catch((err: unknown) => setError(err instanceof Error ? err.message : "No access"));
    listAuditLogs().then(setLogs).catch(() => setLogs([]));
  }, []);

  if (error && !settings) return <p className="text-sm text-danger">{error}</p>;
  if (!settings) return <p className="text-sm text-moss">Loading settings…</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Product rules</h1>
      <p className="text-sm text-moss">
        These numbers apply to new plans. Existing plans keep the terms accepted at opening.
      </p>
      <Card className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Adashi</h2>
        <Num
          label="Missed penalty %"
          value={settings.adashi.missedPenaltyPct}
          onChange={(v) => setSettings({ ...settings, adashi: { ...settings.adashi, missedPenaltyPct: v } })}
        />
        <Num
          label="Payout fee %"
          value={settings.adashi.payoutFeePct}
          onChange={(v) => setSettings({ ...settings, adashi: { ...settings.adashi, payoutFeePct: v } })}
        />
      </Card>
      <Card className="space-y-3">
        <h2 className="font-display text-xl font-semibold">My Savings</h2>
        <Num
          label="Early withdrawal fee %"
          value={settings.my_savings.earlyWithdrawalFeePct}
          onChange={(v) =>
            setSettings({ ...settings, my_savings: { ...settings.my_savings, earlyWithdrawalFeePct: v } })
          }
        />
      </Card>
      <Card className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Allowance</h2>
        <Num
          label="Minimum early-break %"
          value={settings.allowance.minEarlyBreakPct}
          onChange={(v) =>
            setSettings({ ...settings, allowance: { ...settings.allowance, minEarlyBreakPct: v } })
          }
        />
        <Num
          label="Maximum early-break %"
          value={settings.allowance.maxEarlyBreakPct}
          onChange={(v) =>
            setSettings({ ...settings, allowance: { ...settings.allowance, maxEarlyBreakPct: v } })
          }
        />
      </Card>
      <Card className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Wallet</h2>
        <Num
          label="Minimum deposit (naira)"
          value={settings.wallet.minDepositNaira}
          onChange={(v) => setSettings({ ...settings, wallet: { ...settings.wallet, minDepositNaira: v } })}
        />
        <Num
          label="Withdrawal fee %"
          value={settings.wallet.withdrawalFeePct}
          onChange={(v) => setSettings({ ...settings, wallet: { ...settings.wallet, withdrawalFeePct: v } })}
        />
      </Card>
      <ErrorText>{error}</ErrorText>
      {msg ? <p className="text-sm text-forest">{msg}</p> : null}
      <Button
        onClick={async () => {
          setError(null);
          try {
            const next = await saveAdminSettings({ data: settings });
            setSettings(next);
            setMsg("Saved.");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save.");
          }
        }}
      >
        Save rules
      </Button>
      <Card>
        <h2 className="font-display text-xl font-semibold">Audit log</h2>
        <div className="mt-3 divide-y divide-line text-sm">
          {logs.map((l) => (
            <div key={l.id} className="py-2">
              <p className="font-semibold">{l.action}</p>
              <p className="text-xs text-sage">
                {l.entity_type} {l.entity_id ?? ""} · {formatDateTime(l.created_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      <Input
        type="number"
        value={String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}
