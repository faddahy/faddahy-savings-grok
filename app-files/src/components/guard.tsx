import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSessionProfile } from "@/lib/fns/profile";
import type { Profile } from "@/lib/types";
import { FaddahyMark } from "./mark";

export function SessionGate({
  children,
  requireOnboarded = true,
}: {
  children: (profile: Profile) => ReactNode;
  requireOnboarded?: boolean;
}) {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    getSessionProfile()
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load your account.");
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (isPending) return <BootScreen />;
  if (!user) return <RedirectToSignIn />;
  if (error) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }
  if (!profile) return <BootScreen />;
  if (requireOnboarded && !profile.onboarded) return <Navigate to="/onboarding" />;
  return <>{children(profile)}</>;
}

export function BootScreen() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper">
      <div className="flex flex-col items-center gap-3">
        <FaddahyMark className="h-12 w-12" />
        <p className="text-sm text-moss">Loading your savings…</p>
      </div>
    </div>
  );
}
