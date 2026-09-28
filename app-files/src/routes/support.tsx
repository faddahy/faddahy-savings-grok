import { createFileRoute, Link } from "@tanstack/react-router";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import { Card, PageTitle, Screen } from "@/components/ui";

export const Route = createFileRoute("/support")({ component: SupportRoute });

function SupportRoute() {
  return (
    <SessionGate>
      {() => <SupportPage />}
    </SessionGate>
  );
}

function SupportPage() {
  return (
    <AppShell>
      <Screen>
        <PageTitle kicker="Help" title="How Faddahy works" />
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-xl font-semibold">Your money is yours</h2>
            <p className="mt-2 text-sm text-moss">
              Adashi here is not ajo where one person is paid from another person’s contribution. Each plan has its own
              ledger. Customer savings are not working capital for wholesale or staff.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Four products</h2>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-moss">
              <li>Adashi — 30-day personal cycle. No early withdrawal. Penalty on missed days at payout.</li>
              <li>My Savings — your goal, your pace. Early withdrawal has a fee until the target date.</li>
              <li>Locked — server-enforced lock until target, date, either, or the open-ended minimum hold.</li>
              <li>Allowance — lump sum in, a little out on a calendar. Early break forfeits the percentage you chose.</li>
            </ul>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Deposits and withdrawals</h2>
            <p className="mt-2 text-sm text-moss">
              This preview uses a sandbox bank rail. Opening a payment page does not credit you. The server verifies the
              unique reference and writes one ledger line. Duplicate confirms do not double-credit.
            </p>
            <p className="mt-2 text-sm text-moss">
              Live naira requires a CBN-licensed partner (for example Paystack, Flutterwave, or a deposit-taking bank)
              and KYC at their required level. That work is a later phase.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Need a person?</h2>
            <p className="mt-2 text-sm text-moss">
              Write to support through your Faddahy operator. Staff can see your plan status. They cannot quietly edit
              balances. Corrections go through an auditable process.
            </p>
          </Card>
          <Link to="/home" className="block text-center text-sm font-semibold text-forest">
            Back home
          </Link>
        </div>
      </Screen>
    </AppShell>
  );
}
