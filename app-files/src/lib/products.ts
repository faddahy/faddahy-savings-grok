import type { Frequency } from "./dates";

export type ProductType = "adashi" | "my_savings" | "locked" | "allowance";

export type LockMode = "target" | "date" | "either" | "open";

export const PRODUCTS: Record<
  ProductType,
  {
    slug: ProductType;
    name: string;
    short: string;
    blurb: string;
    href: string;
  }
> = {
  adashi: {
    slug: "adashi",
    name: "Adashi Savings",
    short: "30-day cycle",
    blurb: "Save a set amount every day or week for 30 days. Your payout is yours alone — it never depends on anyone else.",
    href: "/plans/new/adashi",
  },
  my_savings: {
    slug: "my_savings",
    name: "My Savings",
    short: "Your own goal",
    blurb: "Name a target and a date. We calculate what to put aside so you can reach it.",
    href: "/plans/new/my_savings",
  },
  locked: {
    slug: "locked",
    name: "Locked Savings",
    short: "Hold until ready",
    blurb: "Lock money until you hit a target, a date, or either — whichever you choose. The lock is enforced on the server.",
    href: "/plans/new/locked",
  },
  allowance: {
    slug: "allowance",
    name: "Allowance Savings",
    short: "Release a little at a time",
    blurb: "Put a lump sum away and release a chosen amount to yourself on a schedule.",
    href: "/plans/new/allowance",
  },
};

export const PRODUCT_ORDER: ProductType[] = [
  "adashi",
  "my_savings",
  "locked",
  "allowance",
];

export type AdashiSettings = {
  cycleDays: number;
  frequencies: Frequency[];
  minContributionNaira: number;
  maxContributionNaira: number;
  suggestedNaira: number[];
  missedPenaltyPct: number;
  payoutFeePct: number;
  earlyWithdrawalAllowed: boolean;
};

export type MySavingsSettings = {
  frequencies: Frequency[];
  minGoalNaira: number;
  maxGoalNaira: number;
  minDurationDays: number;
  maxDurationDays: number;
  earlyWithdrawalFeePct: number;
  allowAdjustGoal: boolean;
};

export type LockedSettings = {
  minLockDays: number;
  earlyWithdrawalAllowed: boolean;
  modes: LockMode[];
  openEndedMinDays: number;
  minTargetNaira: number;
};

export type AllowanceSettings = {
  frequencies: Frequency[];
  minLumpNaira: number;
  minAllowanceNaira: number;
  minEarlyBreakPct: number;
  maxEarlyBreakPct: number;
  defaultEarlyBreakPct: number;
};

export type WalletSettings = {
  minDepositNaira: number;
  maxDepositNaira: number;
  minWithdrawalNaira: number;
  withdrawalFeePct: number;
  sandbox: boolean;
};

export type AllSettings = {
  adashi: AdashiSettings;
  my_savings: MySavingsSettings;
  locked: LockedSettings;
  allowance: AllowanceSettings;
  wallet: WalletSettings;
};

export const DEFAULT_SETTINGS: AllSettings = {
  adashi: {
    cycleDays: 30,
    frequencies: ["daily", "weekly"],
    minContributionNaira: 100,
    maxContributionNaira: 500000,
    suggestedNaira: [200, 500, 1000, 2000, 5000, 10000],
    missedPenaltyPct: 5,
    payoutFeePct: 1,
    earlyWithdrawalAllowed: false,
  },
  my_savings: {
    frequencies: ["daily", "weekly", "monthly"],
    minGoalNaira: 1000,
    maxGoalNaira: 50000000,
    minDurationDays: 7,
    maxDurationDays: 730,
    earlyWithdrawalFeePct: 2,
    allowAdjustGoal: true,
  },
  locked: {
    minLockDays: 7,
    earlyWithdrawalAllowed: false,
    modes: ["target", "date", "either", "open"],
    openEndedMinDays: 30,
    minTargetNaira: 1000,
  },
  allowance: {
    frequencies: ["daily", "every_2_days", "every_3_days", "weekly"],
    minLumpNaira: 5000,
    minAllowanceNaira: 500,
    minEarlyBreakPct: 10,
    maxEarlyBreakPct: 50,
    defaultEarlyBreakPct: 15,
  },
  wallet: {
    minDepositNaira: 100,
    maxDepositNaira: 2000000,
    minWithdrawalNaira: 100,
    withdrawalFeePct: 0,
    sandbox: true,
  },
};

export const LOCK_MODE_COPY: Record<LockMode, { title: string; body: string }> = {
  target: {
    title: "Unlock at target",
    body: "You may unlock when the saved amount reaches your target. The date does not matter.",
  },
  date: {
    title: "Unlock on a date",
    body: "You may unlock on the maturity date, even if the target is not yet reached.",
  },
  either: {
    title: "Whichever comes first",
    body: "The plan unlocks when you hit the target amount or the maturity date — whichever happens first.",
  },
  open: {
    title: "Open-ended lock",
    body: "No target and no maturity date. Money stays locked until the minimum holding period ends, then you may unlock.",
  },
};

export function adashiTerms(s: AdashiSettings): string[] {
  return [
    `Adashi is a ${s.cycleDays}-day personal savings cycle. Your balance is yours alone. It does not depend on anyone else joining or paying.`,
    `You agree to contribute on the schedule you choose (daily or weekly).`,
    `Missed contributions are marked on your calendar. At payout, a ${s.missedPenaltyPct}% penalty is applied on each missed contribution.`,
    `You cannot withdraw before the cycle ends.`,
    `When the cycle ends you may withdraw the eligible balance. A ${s.payoutFeePct}% payout fee applies.`,
    `Using released funds in the Faddahy wholesale marketplace is planned for a later phase and is not live yet.`,
    `Deposits are verified by the payment partner before they are credited. Opening a payment page does not add money.`,
  ];
}

export function mySavingsTerms(s: MySavingsSettings): string[] {
  return [
    `My Savings is a personal goal. You choose the target, the duration, and how often you contribute.`,
    `Suggested contributions are calculated from your target, duration, and schedule. You may save more than the suggestion.`,
    `You may withdraw before the target date. An early-withdrawal fee of ${s.earlyWithdrawalFeePct}% of the withdrawn amount applies.`,
    `After the target date, withdrawals from this plan have no early-withdrawal fee.`,
    `You may keep more than one My Savings goal.`,
    `Deposits are verified server-side before they are credited to your ledger.`,
  ];
}

export function lockedTerms(s: LockedSettings, mode: LockMode): string[] {
  const lines = [
    `Locked Savings is designed to keep money out of everyday spending until the rule you choose is met.`,
    LOCK_MODE_COPY[mode].body,
    `The withdrawal rule is enforced by the server. Hiding a button in the app is not how the lock works.`,
    `Faddahy does not claim this lock is legally irreversible. It is a product rule between you and this service, subject to the licensed financial partner’s processing.`,
  ];
  if (!s.earlyWithdrawalAllowed) {
    lines.push("Early withdrawal is not available on a strict lock. You must wait until the plan is eligible to unlock.");
  }
  if (mode === "open") {
    lines.push(`Open-ended plans have a minimum holding period of ${s.openEndedMinDays} days before unlock is allowed.`);
  }
  return lines;
}

export function allowanceTerms(s: AllowanceSettings, pct: number): string[] {
  return [
    `You deposit a lump sum. That money sits in this plan as restricted funds.`,
    `On each allowance date, the agreed amount becomes available to withdraw. The rest stays restricted.`,
    `If you break the plan early, ${pct}% of the remaining restricted balance is forfeited as an early-break charge (minimum ${s.minEarlyBreakPct}%, maximum ${s.maxEarlyBreakPct}%).`,
    `Forfeited amounts are recorded as company fee revenue. They are not taken from other customers.`,
    `Pausing, editing, or cancelling follows the same early-break rule unless the remaining balance is already fully released.`,
    `Allowance dates are generated when you open the plan and are not silently shifted.`,
  ];
}
