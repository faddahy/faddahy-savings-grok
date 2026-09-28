import type { Frequency } from "./dates";
import type { LockMode, ProductType } from "./products";

export type AccountStatus = "active" | "restricted" | "suspended";
export type KycStatus = "unverified" | "pending" | "verified" | "rejected";
export type StaffRole = "customer" | "support" | "finance" | "admin";
export type PlanStatus =
  | "active"
  | "matured"
  | "unlocked"
  | "withdrawn"
  | "cancelled"
  | "broken";
export type ScheduleStatus = "pending" | "completed" | "missed" | "released" | "skipped";
export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "reversed";
export type LedgerType =
  | "deposit"
  | "withdrawal"
  | "contribution"
  | "plan_funding"
  | "allowance_release"
  | "plan_unlock"
  | "fee"
  | "penalty"
  | "forfeit"
  | "correction";
export type PlanConfig = {
  cycleDays?: number;
  missedPenaltyPct?: number;
  payoutFeePct?: number;
  earlyWithdrawalFeePct?: number;
  earlyWithdrawalAllowed?: boolean;
  openEndedMinDays?: number;
  originalLumpKobo?: number;
};

export type Profile = {
  userId: string;
  displayName: string;
  phone: string | null;
  hasPin: boolean;
  kycStatus: KycStatus;
  kycFullName: string | null;
  kycNinLast4: string | null;
  kycBvnLast4: string | null;
  accountStatus: AccountStatus;
  role: StaffRole;
  onboarded: boolean;
  createdAt: string;
};

export type Wallet = {
  availableKobo: number;
  restrictedKobo: number;
};

export type SavingsPlan = {
  id: number;
  userId: string;
  productType: ProductType;
  title: string;
  status: PlanStatus;
  targetKobo: number | null;
  contributionKobo: number | null;
  savedKobo: number;
  availableKobo: number;
  restrictedKobo: number;
  frequency: Frequency | null;
  startDate: string | null;
  endDate: string | null;
  maturityDate: string | null;
  lockMode: LockMode | null;
  earlyBreakPct: number | null;
  termsAcceptedAt: string | null;
  config: PlanConfig;
  createdAt: string;
  updatedAt: string;
  unlockEligible?: boolean;
  unlockReason?: string | null;
};

export type ScheduleItem = {
  id: number;
  planId: number;
  kind: "contribution" | "allowance";
  dueDate: string;
  amountKobo: number;
  status: ScheduleStatus;
  completedAt: string | null;
};

export type LedgerEntry = {
  id: number;
  planId: number | null;
  entryType: LedgerType;
  amountKobo: number;
  walletBucket: "available" | "restricted";
  availableAfterKobo: number;
  restrictedAfterKobo: number;
  reference: string;
  description: string;
  createdAt: string;
};

export type PaymentIntent = {
  id: number;
  planId: number | null;
  kind: "deposit" | "withdrawal";
  amountKobo: number;
  feeKobo: number;
  status: PaymentStatus;
  provider: string;
  reference: string;
  destinationBank: string | null;
  destinationAccount: string | null;
  destinationName: string | null;
  failureReason: string | null;
  createdAt: string;
};

export type AppNotification = {
  id: number;
  title: string;
  body: string;
  kind: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export type Dashboard = {
  profile: Profile;
  wallet: Wallet;
  plans: SavingsPlan[];
  upcoming: Array<ScheduleItem & { planTitle: string; productType: ProductType }>;
  recent: LedgerEntry[];
  unreadCount: number;
  announcements: Array<{ id: number; title: string; body: string; createdAt: string }>;
};
