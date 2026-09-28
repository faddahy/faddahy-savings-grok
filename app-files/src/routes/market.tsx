import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import { Badge, Card, Money, PageTitle, Screen } from "@/components/ui";
import { getDashboard } from "@/lib/fns/profile";

export const Route = createFileRoute("/market")({ component: MarketRoute });

const SAMPLE = [
  { name: "50kg rice (wholesale)", price: 6850000, unit: "bag", note: "Coming soon" },
  { name: "Vegetable oil 25L", price: 4200000, unit: "keg", note: "Coming soon" },
  { name: "Indomie carton", price: 980000, unit: "carton", note: "Coming soon" },
  { name: "Peak milk carton", price: 1450000, unit: "carton", note: "Coming soon" },
];

function MarketRoute() {
  return (
    <SessionGate>
      {() => <MarketPage />}
    </SessionGate>
  );
}

function MarketPage() {
  const [eligible, setEligible] = useState(0);
  useEffect(() => {
    getDashboard()
      .then((d) => setEligible(d.wallet.availableKobo))
      .catch(() => setEligible(0));
  }, []);

  return (
    <AppShell>
      <Screen>
        <PageTitle kicker="Later phase" title="Wholesale market" />
        <Card className="bg-leaf">
          <p className="font-semibold">Designed, not live</p>
          <p className="mt-1 text-sm text-moss">
            Eligible released savings can later pay for wholesale goods. Nothing here moves customer funds into
            Faddahy’s operating account. The marketplace needs suppliers, stock, and a licensed payment rail first.
          </p>
          <p className="mt-3 text-sm">
            Available for a future purchase: <Money kobo={eligible} size="sm" />
          </p>
        </Card>
        <div className="mt-5 space-y-3">
          {SAMPLE.map((item) => (
            <Card key={item.name} className="opacity-80">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs capitalize text-moss">{item.unit}</p>
                </div>
                <Badge tone="warn">{item.note}</Badge>
              </div>
              <Money kobo={item.price} className="mt-2 block" />
              <button
                type="button"
                disabled
                className="mt-3 h-11 w-full rounded-md bg-paper text-sm font-semibold text-sage"
              >
                Not for sale yet
              </button>
            </Card>
          ))}
        </div>
        <Link to="/home" className="mt-6 block text-center text-sm font-semibold text-forest">
          Back to savings
        </Link>
      </Screen>
    </AppShell>
  );
}
