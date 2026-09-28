import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { DEFAULT_SETTINGS, type AllSettings } from "@/lib/products";
import {
  audit,
  ensureProfile,
  loadSettings,
  mapPayment,
  mapPlan,
  mapProfile,
  notify,
  requireStaff,
  withUnlock,
} from "@/lib/server/helpers";

export const getStaffContext = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profile = await ensureProfile(sql, context.userId);
    const [adminCount] = await sql<{ c: number }>`
      select count(*)::int as c from profiles where role = 'admin'
    `;
    return {
      profile: mapProfile(profile),
      adminExists: Number(adminCount?.c ?? 0) > 0,
    };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const [claimed] = await sql<{ user_id: string }>`
      update profiles
      set role = 'admin', updated_at = now()
      where user_id = ${context.userId}
        and not exists (select 1 from profiles where role = 'admin')
      returning user_id
    `;
    if (!claimed) throw new Error("An administrator is already assigned.");
    await audit(sql, context.userId, "admin.claim", "profile", context.userId);
    return { ok: true };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId);
    const [customers] = await sql<{ c: number }>`select count(*)::int as c from profiles`;
    const [plans] = await sql<{ c: number }>`select count(*)::int as c from savings_plans where status = 'active'`;
    const [wallet] = await sql<{ available: number; restricted: number }>`
      select coalesce(sum(available_kobo),0)::bigint as available,
             coalesce(sum(restricted_kobo),0)::bigint as restricted
      from wallets
    `;
    const [deposits] = await sql<{ c: number; s: number }>`
      select count(*)::int as c, coalesce(sum(amount_kobo),0)::bigint as s
      from payment_intents where kind = 'deposit' and status = 'succeeded'
    `;
    const [withdrawals] = await sql<{ c: number; s: number }>`
      select count(*)::int as c, coalesce(sum(amount_kobo),0)::bigint as s
      from payment_intents where kind = 'withdrawal' and status = 'succeeded'
    `;
    const [fees] = await sql<{ s: number }>`
      select coalesce(sum(-amount_kobo),0)::bigint as s
      from ledger_entries where entry_type in ('fee', 'penalty', 'forfeit') and amount_kobo < 0
    `;
    const recent = await sql<Parameters<typeof mapPayment>[0]>`
      select * from payment_intents order by created_at desc limit 12
    `;
    const kycQueue = await sql<{ user_id: string; display_name: string; kyc_full_name: string | null; kyc_submitted_at: string | null }>`
      select user_id, display_name, kyc_full_name, kyc_submitted_at
      from profiles where kyc_status = 'pending' order by kyc_submitted_at asc
    `;
    return {
      customers: Number(customers?.c ?? 0),
      activePlans: Number(plans?.c ?? 0),
      availableKobo: Number(wallet?.available ?? 0),
      restrictedKobo: Number(wallet?.restricted ?? 0),
      depositCount: Number(deposits?.c ?? 0),
      depositKobo: Number(deposits?.s ?? 0),
      withdrawalCount: Number(withdrawals?.c ?? 0),
      withdrawalKobo: Number(withdrawals?.s ?? 0),
      feeKobo: Number(fees?.s ?? 0),
      recentPayments: recent.map(mapPayment),
      kycQueue,
    };
  });

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin", "support", "finance"]);
    const rows = await sql<Parameters<typeof mapProfile>[0] & { available_kobo: number | null; restricted_kobo: number | null }>`
      select p.*, w.available_kobo, w.restricted_kobo
      from profiles p
      left join wallets w on w.user_id = p.user_id
      order by p.created_at desc
      limit 200
    `;
    return rows.map((r) => ({
      ...mapProfile(r),
      availableKobo: Number(r.available_kobo ?? 0),
      restrictedKobo: Number(r.restricted_kobo ?? 0),
    }));
  });

export const setCustomerStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { userId: string; accountStatus: "active" | "restricted" | "suspended" }) => {
    if (!data.userId) throw new Error("Missing customer.");
    return data;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin", "support"]);
    if (data.userId === context.userId) throw new Error("You cannot change your own account status.");
    await sql`
      update profiles set account_status = ${data.accountStatus}, updated_at = now()
      where user_id = ${data.userId}
    `;
    await audit(sql, context.userId, "customer.status", "profile", data.userId, {
      accountStatus: data.accountStatus,
    });
    await notify(
      sql,
      data.userId,
      "Account update",
      `Your Faddahy account is now ${data.accountStatus}.`,
      "account",
      "/profile",
    );
    return { ok: true };
  });

export const reviewKyc = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { userId: string; decision: "verified" | "rejected" }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin", "support"]);
    await sql`
      update profiles set kyc_status = ${data.decision}, updated_at = now()
      where user_id = ${data.userId}
    `;
    await audit(sql, context.userId, "kyc.review", "profile", data.userId, {
      decision: data.decision,
    });
    await notify(
      sql,
      data.userId,
      data.decision === "verified" ? "Identity verified" : "Identity review update",
      data.decision === "verified"
        ? "Your KYC documents were accepted. Higher limits can follow once a licensed partner is live."
        : "Your KYC submission was not accepted. You may submit again from your profile.",
      "kyc",
      "/profile",
    );
    return { ok: true };
  });

export const listAdminPlans = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId);
    const rows = await sql<Parameters<typeof mapPlan>[0] & { display_name: string }>`
      select p.*, pr.display_name
      from savings_plans p
      join profiles pr on pr.user_id = p.user_id
      order by p.created_at desc
      limit 200
    `;
    return rows.map((r) => ({ ...withUnlock(mapPlan(r)), customerName: r.display_name }));
  });

export const listAdminTransactions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin", "finance"]);
    const payments = await sql<Parameters<typeof mapPayment>[0] & { display_name: string }>`
      select pi.*, pr.display_name
      from payment_intents pi
      join profiles pr on pr.user_id = pi.user_id
      order by pi.created_at desc
      limit 200
    `;
    const ledger = await sql<{
      id: number;
      user_id: string;
      entry_type: string;
      amount_kobo: number;
      reference: string;
      description: string;
      created_at: string;
      display_name: string;
    }>`
      select le.id, le.user_id, le.entry_type, le.amount_kobo, le.reference, le.description, le.created_at, pr.display_name
      from ledger_entries le
      join profiles pr on pr.user_id = le.user_id
      order by le.created_at desc
      limit 200
    `;
    return {
      payments: payments.map((p) => ({ ...mapPayment(p), customerName: p.display_name })),
      ledger: ledger.map((r) => ({
        id: r.id,
        userId: r.user_id,
        customerName: r.display_name,
        entryType: r.entry_type,
        amountKobo: Number(r.amount_kobo),
        reference: r.reference,
        description: r.description,
        createdAt: r.created_at,
      })),
    };
  });

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin"]);
    return loadSettings(sql);
  });

export const saveAdminSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: AllSettings) => {
    if (!data?.adashi || !data?.wallet) throw new Error("Invalid settings.");
    return data;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin"]);
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof AllSettings)[]) {
      await sql`
        insert into product_settings (product_type, settings, updated_at)
        values (${key}, ${JSON.stringify(data[key])}::jsonb, now())
        on conflict (product_type) do update
        set settings = excluded.settings, updated_at = now()
      `;
    }
    await audit(sql, context.userId, "settings.update", "product_settings", "all");
    return loadSettings(sql);
  });

export const postAnnouncement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { title: string; body: string }) => {
    const title = data.title.trim();
    const body = data.body.trim();
    if (title.length < 3 || body.length < 3) throw new Error("Write a title and a message.");
    return { title, body };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin", "support"]);
    const [row] = await sql<{ id: number }>`
      insert into announcements (title, body, audience, created_by)
      values (${data.title}, ${data.body}, 'customers', ${context.userId})
      returning id
    `;
    const customers = await sql<{ user_id: string }>`select user_id from profiles`;
    for (const c of customers) {
      await notify(sql, c.user_id, data.title, data.body, "announcement", "/home");
    }
    await audit(sql, context.userId, "announcement.create", "announcement", row.id);
    return { id: row.id };
  });

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireStaff(sql, context.userId, ["admin"]);
    return sql<{
      id: number;
      actor_user_id: string;
      action: string;
      entity_type: string;
      entity_id: string | null;
      created_at: string;
    }>`
      select id, actor_user_id, action, entity_type, entity_id, created_at
      from audit_logs order by created_at desc limit 100
    `;
  });
