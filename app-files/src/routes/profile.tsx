import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import { Badge, Button, Card, ErrorText, Field, Input, PageTitle, PinPad, Screen } from "@/components/ui";
import { changePin, submitKyc, updateProfile } from "@/lib/fns/profile";
import { claimAdmin, getStaffContext } from "@/lib/fns/admin";
import type { Profile } from "@/lib/types";

export const Route = createFileRoute("/profile")({ component: ProfileRoute });

function ProfileRoute() {
  return (
    <SessionGate>
      {(profile) => <ProfilePage initial={profile} />}
    </SessionGate>
  );
}

function ProfilePage({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState(initial);
  const [name, setName] = useState(initial.displayName);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [fullName, setFullName] = useState(initial.kycFullName ?? "");
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [nextPin, setNextPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<{ adminExists: boolean; role: Profile["role"] } | null>(null);

  useEffect(() => {
    getStaffContext()
      .then((s) => setStaff({ adminExists: s.adminExists, role: s.profile.role }))
      .catch(() => setStaff(null));
  }, []);

  return (
    <AppShell>
      <Screen>
        <PageTitle kicker="Account" title="Profile" action={<UserButton />} />
        <Card className="mb-4">
          <p className="font-semibold">{profile.displayName || "Saver"}</p>
          <p className="text-sm text-moss">{profile.phone ?? "No phone yet"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={profile.kycStatus === "verified" ? "good" : profile.kycStatus === "pending" ? "warn" : "neutral"}>
              KYC {profile.kycStatus}
            </Badge>
            <Badge>{profile.accountStatus}</Badge>
            {profile.role !== "customer" ? <Badge tone="forest">{profile.role}</Badge> : null}
          </div>
        </Card>

        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            try {
              const next = await updateProfile({ data: { displayName: name, phone } });
              setProfile(next);
              setMessage("Profile saved.");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not save.");
            }
          }}
        >
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </Field>
          <Button type="submit" className="w-full">
            Save details
          </Button>
        </form>

        <h2 className="mt-8 font-display text-xl font-semibold">Identity (KYC)</h2>
        <p className="mt-1 text-sm text-moss">
          A licensed partner will require NIN and BVN before live naira limits. We store only the last four digits.
        </p>
        <form
          className="mt-3 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            try {
              await submitKyc({ data: { fullName, nin, bvn } });
              setMessage("KYC submitted for review.");
              setProfile({ ...profile, kycStatus: "pending" });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not submit KYC.");
            }
          }}
        >
          <Field label="Name on ID">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="NIN (11 digits)">
            <Input value={nin} onChange={(e) => setNin(e.target.value)} inputMode="numeric" maxLength={11} />
          </Field>
          <Field label="BVN (11 digits)">
            <Input value={bvn} onChange={(e) => setBvn(e.target.value)} inputMode="numeric" maxLength={11} />
          </Field>
          <Button type="submit" variant="secondary" className="w-full">
            Submit for review
          </Button>
        </form>

        <h2 className="mt-8 font-display text-xl font-semibold">Change PIN</h2>
        <div className="mt-3 space-y-4">
          <PinPad
            value={currentPin.length < 4 ? currentPin : nextPin}
            onChange={(v) => (currentPin.length < 4 ? setCurrentPin(v) : setNextPin(v))}
            label={currentPin.length < 4 ? "Current PIN" : "New PIN"}
          />
          <Button
            className="w-full"
            variant="secondary"
            disabled={nextPin.length < 4}
            onClick={async () => {
              setError(null);
              try {
                await changePin({ data: { currentPin, nextPin } });
                setCurrentPin("");
                setNextPin("");
                setMessage("PIN updated.");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Could not change PIN.");
              }
            }}
          >
            Update PIN
          </Button>
        </div>

        {staff && !staff.adminExists ? (
          <Card className="mt-8">
            <p className="font-semibold">First staff account</p>
            <p className="mt-1 text-sm text-moss">
              No administrator exists yet. Claiming the desk lets you review KYC, configure product rules, and read the
              ledger. It does not let you spend customer funds.
            </p>
            <Button
              className="mt-3 w-full"
              onClick={async () => {
                try {
                  await claimAdmin();
                  setStaff({ adminExists: true, role: "admin" });
                  setMessage("You are now the administrator.");
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Could not claim admin.");
                }
              }}
            >
              Claim admin desk
            </Button>
          </Card>
        ) : null}

        {staff && (staff.role === "admin" || staff.role === "finance" || staff.role === "support") ? (
          <Link to="/admin" className="mt-6 block">
            <Button className="w-full">Open staff desk</Button>
          </Link>
        ) : null}

        <Link to="/support" className="mt-4 block text-center text-sm font-semibold text-forest">
          Help and product rules
        </Link>

        {message ? <p className="mt-4 text-sm text-forest">{message}</p> : null}
        <ErrorText>{error}</ErrorText>
      </Screen>
    </AppShell>
  );
}
