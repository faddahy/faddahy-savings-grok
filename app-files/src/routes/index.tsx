import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Lock, Target, Wallet } from "lucide-react";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FaddahyMark } from "@/components/mark";
import { Button, Card } from "@/components/ui";
import { Navigate } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({ component: Landing });

const ICONS = {
  adashi: CalendarDays,
  my_savings: Target,
  locked: Lock,
  allowance: Wallet,
};

function Landing() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/home" />;

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-5 pb-16 pt-6">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaddahyMark className="h-9 w-9" />
          <span className="font-display text-xl font-semibold">Faddahy</span>
        </div>
        <SignedOut>
          <Link to="/login" className="text-sm font-semibold text-forest">
            Sign in
          </Link>
        </SignedOut>
        <SignedIn>
          <Link to="/home" className="text-sm font-semibold text-forest">
            Open app
          </Link>
        </SignedIn>
      </header>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Nigeria</p>
      <h1 className="mt-3 font-display text-[2.35rem] font-semibold leading-[1.08]">
        Simple savings that make sense to the poor.
      </h1>
      <p className="mt-4 text-[1.05rem] text-moss">
        Built for market women, traders, artisans, and anyone who earns daily or weekly. Save small,
        keep it safe, and take it out by the rules you agreed to — not by whoever shouts loudest.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Link to="/login">
          <Button className="w-full">
            Start saving
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <p className="text-center text-xs text-sage">No pooled Adashi. Your money is yours.</p>
      </div>

      <section className="mt-12 space-y-3">
        {Object.values(PRODUCTS).map((p) => {
          const Icon = ICONS[p.slug];
          return (
            <Card key={p.slug} className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-leaf text-forest">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">{p.short}</p>
                <h2 className="font-display text-xl font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-moss">{p.blurb}</p>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">How your money is kept</h2>
        <ul className="mt-4 space-y-3 text-sm text-moss">
          <li>Every naira is a ledger line with a unique reference.</li>
          <li>Locks, maturity, and allowance dates are enforced on the server.</li>
          <li>Customer savings are not working capital for wholesale or staff.</li>
          <li>A licensed payment partner is required before live naira. This preview uses a verified sandbox rail.</li>
        </ul>
      </section>
    </main>
  );
}
