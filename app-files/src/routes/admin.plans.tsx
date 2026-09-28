import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Card, Money } from "@/components/ui";
import { listAdminPlans } from "@/lib/fns/admin";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/admin/plans")({ component: AdminPlans });

function AdminPlans() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listAdminPlans>>>([]);
  useEffect(() => {
    listAdminPlans().then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <div>
      <h1 className="mb-4 font-display text-3xl font-semibold">Plans</h1>
      <div className="space-y-3">
        {rows.map((p) => (
          <Card key={p.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-moss">{PRODUCTS[p.productType].name}</p>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-moss">{p.customerName}</p>
              </div>
              <Badge tone={p.unlockEligible ? "good" : "neutral"}>{p.status}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <span>
                Saved <Money kobo={p.savedKobo} size="sm" />
              </span>
              <span>
                Held <Money kobo={p.restrictedKobo} size="sm" />
              </span>
              {p.targetKobo ? (
                <span>
                  Target <Money kobo={p.targetKobo} size="sm" />
                </span>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
