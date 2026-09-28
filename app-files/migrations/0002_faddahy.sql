-- Faddahy Savings — customer profiles, wallets, ledger, plans, payments, admin.

create table if not exists profiles (
  user_id text primary key,
  display_name text not null default '',
  phone text,
  pin_hash text,
  kyc_status text not null default 'unverified',
  kyc_full_name text,
  kyc_nin_last4 text,
  kyc_bvn_last4 text,
  kyc_submitted_at timestamptz,
  account_status text not null default 'active',
  role text not null default 'customer',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wallets (
  user_id text primary key references profiles (user_id) on delete cascade,
  available_kobo bigint not null default 0,
  restricted_kobo bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint wallets_available_nonneg check (available_kobo >= 0),
  constraint wallets_restricted_nonneg check (restricted_kobo >= 0)
);

create table if not exists product_settings (
  product_type text primary key,
  settings jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists savings_plans (
  id serial primary key,
  user_id text not null references profiles (user_id) on delete cascade,
  product_type text not null,
  title text not null,
  status text not null default 'active',
  target_kobo bigint,
  contribution_kobo bigint,
  saved_kobo bigint not null default 0,
  available_kobo bigint not null default 0,
  restricted_kobo bigint not null default 0,
  frequency text,
  start_date date,
  end_date date,
  maturity_date date,
  lock_mode text,
  early_break_pct integer,
  terms_version text not null default '1',
  terms_accepted_at timestamptz,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists savings_plans_user_idx on savings_plans (user_id, status);
create index if not exists savings_plans_product_idx on savings_plans (product_type, status);

create table if not exists schedule_items (
  id serial primary key,
  plan_id integer not null references savings_plans (id) on delete cascade,
  user_id text not null,
  kind text not null,
  due_date date not null,
  amount_kobo bigint not null,
  status text not null default 'pending',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists schedule_items_plan_idx on schedule_items (plan_id, due_date);
create index if not exists schedule_items_due_idx on schedule_items (user_id, status, due_date);

create table if not exists ledger_entries (
  id serial primary key,
  user_id text not null,
  plan_id integer,
  entry_type text not null,
  amount_kobo bigint not null,
  wallet_bucket text not null,
  available_after_kobo bigint not null,
  restricted_after_kobo bigint not null,
  reference text not null unique,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists ledger_entries_user_idx on ledger_entries (user_id, created_at desc);
create index if not exists ledger_entries_plan_idx on ledger_entries (plan_id);

create table if not exists payment_intents (
  id serial primary key,
  user_id text not null,
  plan_id integer,
  kind text not null,
  amount_kobo bigint not null,
  fee_kobo bigint not null default 0,
  status text not null default 'pending',
  provider text not null default 'sandbox',
  reference text not null unique,
  destination_bank text,
  destination_account text,
  destination_name text,
  failure_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payment_intents_user_idx on payment_intents (user_id, created_at desc);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  title text not null,
  body text not null,
  kind text not null default 'info',
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

create table if not exists announcements (
  id serial primary key,
  title text not null,
  body text not null,
  audience text not null default 'customers',
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id serial primary key,
  actor_user_id text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on audit_logs (created_at desc);

insert into product_settings (product_type, settings) values
(
  'adashi',
  '{
    "cycleDays": 30,
    "frequencies": ["daily", "weekly"],
    "minContributionNaira": 100,
    "maxContributionNaira": 500000,
    "suggestedNaira": [200, 500, 1000, 2000, 5000, 10000],
    "missedPenaltyPct": 5,
    "payoutFeePct": 1,
    "earlyWithdrawalAllowed": false
  }'::jsonb
),
(
  'my_savings',
  '{
    "frequencies": ["daily", "weekly", "monthly"],
    "minGoalNaira": 1000,
    "maxGoalNaira": 50000000,
    "minDurationDays": 7,
    "maxDurationDays": 730,
    "earlyWithdrawalFeePct": 2,
    "allowAdjustGoal": true
  }'::jsonb
),
(
  'locked',
  '{
    "minLockDays": 7,
    "earlyWithdrawalAllowed": false,
    "modes": ["target", "date", "either", "open"],
    "openEndedMinDays": 30,
    "minTargetNaira": 1000
  }'::jsonb
),
(
  'allowance',
  '{
    "frequencies": ["daily", "every_2_days", "every_3_days", "weekly"],
    "minLumpNaira": 5000,
    "minAllowanceNaira": 500,
    "minEarlyBreakPct": 10,
    "maxEarlyBreakPct": 50,
    "defaultEarlyBreakPct": 15
  }'::jsonb
),
(
  'wallet',
  '{
    "minDepositNaira": 100,
    "maxDepositNaira": 2000000,
    "minWithdrawalNaira": 100,
    "withdrawalFeePct": 0,
    "sandbox": true
  }'::jsonb
)
on conflict (product_type) do nothing;
