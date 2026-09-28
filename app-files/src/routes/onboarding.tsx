import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SessionGate } from "@/components/guard";
import { Button, ErrorText, Field, Input, PinPad, Screen } from "@/components/ui";
import { completeOnboarding } from "@/lib/fns/profile";
import { FaddahyMark } from "@/components/mark";

export const Route = createFileRoute("/onboarding")({ component: OnboardingRoute });

function OnboardingRoute() {
  return (
    <SessionGate requireOnboarded={false}>
      {(profile) => (profile.onboarded ? <Navigate to="/home" /> : <Onboarding />)}
    </SessionGate>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finish() {
    if (pin !== confirm) {
      setError("PINs do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await completeOnboarding({ data: { displayName, phone, pin } });
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not finish setup.");
      setBusy(false);
    }
  }

  return (
    <Screen className="pb-10">
      <FaddahyMark className="mb-6 h-10 w-10" />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Step {step} of 2</p>
      {step === 1 ? (
        <>
          <h1 className="mt-2 font-display text-3xl font-semibold">Who is saving?</h1>
          <p className="mt-2 text-moss">We use your name and Nigerian number on receipts and reminders.</p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              if (displayName.trim().length < 2) {
                setError("Enter your name.");
                return;
              }
              setStep(2);
            }}
          >
            <Field label="Full name">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                placeholder="e.g. Amina Bello"
              />
            </Field>
            <Field label="Nigerian mobile" hint="080, 081, 090, 091 or +234.">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="0803 000 0000"
              />
            </Field>
            <ErrorText>{error}</ErrorText>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-2 font-display text-3xl font-semibold">Set a 4-digit PIN</h1>
          <p className="mt-2 text-moss">
            Withdrawals, locks, and allowance plans need this PIN. It is stored as a hash, never as the digits.
          </p>
          <div className="mt-8 space-y-6">
            <PinPad
              value={pin.length < 4 ? pin : confirm}
              onChange={(next) => {
                setError(null);
                if (pin.length < 4) setPin(next);
                else setConfirm(next);
              }}
              label={pin.length < 4 ? "Choose a PIN" : "Type it again"}
            />
            <ErrorText>{error}</ErrorText>
            <Button className="w-full" disabled={busy || confirm.length < 4} onClick={finish}>
              {busy ? "Saving…" : "Enter Faddahy"}
            </Button>
            <button type="button" className="w-full text-sm text-moss" onClick={() => { setStep(1); setPin(""); setConfirm(""); }}>
              Back
            </button>
          </div>
        </>
      )}
    </Screen>
  );
}
