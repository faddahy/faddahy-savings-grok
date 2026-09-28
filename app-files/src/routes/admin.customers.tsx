import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Money } from "@/components/ui";
import { listCustomers, setCustomerStatus } from "@/lib/fns/admin";

export const Route = createFileRoute("/admin/customers")({ component: Customers });

function Customers() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listCustomers>>>([]);
  function reload() {
    listCustomers().then(setRows).catch(() => setRows([]));
  }
  useEffect(() => {
    reload();
  }, []);

  return (
    <div>
      <h1 className="mb-4 font-display text-3xl font-semibold">Customers</h1>
      <div className="space-y-3">
        {rows.map((c) => (
          <Card key={c.userId} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{c.displayName || "Unnamed"}</p>
              <p className="text-sm text-moss">{c.phone ?? "No phone"}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge>{c.role}</Badge>
                <Badge tone={c.kycStatus === "verified" ? "good" : "neutral"}>KYC {c.kycStatus}</Badge>
                <Badge tone={c.accountStatus === "active" ? "good" : "bad"}>{c.accountStatus}</Badge>
              </div>
            </div>
            <div className="text-sm">
              <p>
                Available <Money kobo={c.availableKobo} size="sm" />
              </p>
              <p>
                Restricted <Money kobo={c.restrictedKobo} size="sm" />
              </p>
            </div>
            <div className="flex gap-2">
              {(["active", "restricted", "suspended"] as const).map((status) => (
                <Button
                  key={status}
                  variant={status === "active" ? "secondary" : status === "suspended" ? "danger" : "ghost"}
                  className="h-9 px-3 text-xs"
                  onClick={async () => {
                    await setCustomerStatus({ data: { userId: c.userId, accountStatus: status } });
                    reload();
                  }}
                >
                  {status}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
