import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Field, Input, Textarea } from "@/components/ui";
import { formatNaira } from "@/lib/money";
import { getAdminOverview, postAnnouncement, reviewKyc } from "@/lib/fns/admin";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminOverview>> | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function reload() {
    getAdminOverview().then(setData).catch(() => setData(null));
  }
  useEffect(() => {
    reload();
  }, []);

  if (!data) return <p className="text-sm text-moss">Loading overview…</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Operations</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Customers" value={String(data.customers)} />
        <Stat label="Active plans" value={String(data.activePlans)} />
        <Stat label="Available" value={formatNaira(data.availableKobo)} />
        <Stat label="Restricted" value={formatNaira(data.restrictedKobo)} />
        <Stat label="Deposits" value={`${data.depositCount} · ${formatNaira(data.depositKobo)}`} />
        <Stat label="Withdrawals" value={`${data.withdrawalCount} · ${formatNaira(data.withdrawalKobo)}`} />
        <Stat label="Fees collected" value={formatNaira(data.feeKobo)} />
      </div>
      <p className="text-sm text-moss">
        Available and restricted figures are customer liabilities. They are not Faddahy operating cash.
      </p>

      <Card>
        <h2 className="font-display text-xl font-semibold">KYC queue</h2>
        {data.kycQueue.length === 0 ? (
          <p className="mt-2 text-sm text-moss">Nothing waiting.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.kycQueue.map((row) => (
              <li key={row.user_id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-paper px-3 py-2">
                <div>
                  <p className="font-semibold">{row.kyc_full_name || row.display_name}</p>
                  <p className="text-xs text-sage">{row.kyc_submitted_at}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      await reviewKyc({ data: { userId: row.user_id, decision: "verified" } });
                      reload();
                    }}
                  >
                    Verify
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await reviewKyc({ data: { userId: row.user_id, decision: "rejected" } });
                      reload();
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-xl font-semibold">Announce</h2>
        <form
          className="mt-3 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await postAnnouncement({ data: { title, body } });
              setTitle("");
              setBody("");
              setMsg("Sent to customers.");
            } catch (err) {
              setMsg(err instanceof Error ? err.message : "Could not send.");
            }
          }}
        >
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Message">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <Button type="submit">Send</Button>
          {msg ? <p className="text-sm text-moss">{msg}</p> : null}
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-xl font-semibold">Recent payments</h2>
        <div className="mt-3 divide-y divide-line">
          {data.recentPayments.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold capitalize">
                  {p.kind} · {formatNaira(p.amountKobo)}
                </p>
                <p className="font-mono text-[11px] text-sage">{p.reference}</p>
              </div>
              <Badge tone={p.status === "succeeded" ? "good" : "warn"}>{p.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums">{value}</p>
    </Card>
  );
}