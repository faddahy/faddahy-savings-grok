import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Card, Money } from "@/components/ui";
import { listAdminTransactions } from "@/lib/fns/admin";
import { formatDateTime } from "@/lib/dates";
import { formatNaira } from "@/lib/money";

export const Route = createFileRoute("/admin/ledger")({ component: AdminLedger });

function AdminLedger() {
  const [data, setData] = useState<Awaited<ReturnType<typeof listAdminTransactions>> | null>(null);
  useEffect(() => {
    listAdminTransactions().then(setData).catch(() => setData(null));
  }, []);
  if (!data) return <p className="text-sm text-moss">Loading ledger…</p>;
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Reconciliation</h1>
      <Card>
        <h2 className="font-display text-xl font-semibold">Payment intents</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-moss">
              <tr>
                <th className="py-2">Customer</th>
                <th>Kind</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="py-2">{p.customerName}</td>
                  <td className="capitalize">{p.kind}</td>
                  <td className="tabular-nums">{formatNaira(p.amountKobo)}</td>
                  <td>
                    <Badge tone={p.status === "succeeded" ? "good" : "warn"}>{p.status}</Badge>
                  </td>
                  <td className="font-mono text-xs">{p.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h2 className="font-display text-xl font-semibold">Ledger lines</h2>
        <div className="mt-3 divide-y divide-line">
          {data.ledger.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-3 py-2">
              <div>
                <p className="text-sm font-semibold">{row.customerName}</p>
                <p className="text-sm text-moss">{row.description}</p>
                <p className="font-mono text-[11px] text-sage">
                  {row.reference} · {formatDateTime(row.createdAt)}
                </p>
              </div>
              <Money kobo={row.amountKobo} size="sm" className={row.amountKobo < 0 ? "text-danger" : "text-forest"} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
