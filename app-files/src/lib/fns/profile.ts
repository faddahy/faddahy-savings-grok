import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  assertPinFormat,
  audit,
  ensureProfile,
  hashPin,
  mapProfile,
  normalizePhone,
  requireActiveAccount,
  verifyPin,
} from "@/lib/server/helpers";
import { processDueEvents } from "@/lib/server/due";
import { loadSettings, mapPlan, withUnlock } from "@/lib/server/helpers";
import { mapLedger, mapSchedule } from "@/lib/server/helpers";
import type { Dashboard, Profile } from "@/lib/types";
import type { ProductType } from "@/lib/products";

export const getSessionProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const row = await ensureProfile(sql, context.userId);
    return mapProfile(row);
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { displayName: string; phone: string; pin: string }) => {
    const displayName = data.displayName.trim();
    if (displayName.length < 2) throw new Error("Please enter your name.");
    const phone = normalizePhone(data.phone);
    assertPinFormat(data.pin);
    return { displayName, phone, pin: data.pin };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireActiveAccount(sql, context.userId);
    const pinHash = await hashPin(data.pin);
    await sql`
      update profiles
      set display_name = ${data.displayName},
          phone = ${data.phone},
          pin_hash = ${pinHash},
          onboarded_at = coalesce(onboarded_at, now()),
          updated_at = now()
      where user_id = ${context.userId}
    `;
    await audit(sql, context.userId, "onboarding.complete", "profile", context.userId, {
      phone: data.phone,
    });
    const [row] = await sql`select * from profiles where user_id = ${context.userId}`;
    return mapProfile(row as Parameters<typeof mapProfile>[0]);
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { displayName: string; phone: string }) => {
    const displayName = data.displayName.trim();
    if (displayName.length < 2) throw new Error("Please enter your name.");
    return { displayName, phone: normalizePhone(data.phone) };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireActiveAccount(sql, context.userId);
    await sql`
      update profiles
      set display_name = ${data.displayName}, phone = ${data.phone}, updated_at = now()
      where user_id = ${context.userId}
    `;
    const [row] = await sql`select * from profiles where user_id = ${context.userId}`;
    return mapProfile(row as Parameters<typeof mapProfile>[0]);
  });

export const changePin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { currentPin: string; nextPin: string }) => {
    assertPinFormat(data.currentPin);
    assertPinFormat(data.nextPin);
    if (data.currentPin === data.nextPin) throw new Error("Choose a new PIN.");
    return data;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [row] = await sql<{ pin_hash: string | null }>`
      select pin_hash from profiles where user_id = ${context.userId}
    `;
    if (!row?.pin_hash) throw new Error("No PIN is set yet.");
    const ok = await verifyPin(data.currentPin, row.pin_hash);
    if (!ok) throw new Error("Current PIN is incorrect.");
    const pinHash = await hashPin(data.nextPin);
    await sql`update profiles set pin_hash = ${pinHash}, updated_at = now() where user_id = ${context.userId}`;
    await audit(sql, context.userId, "pin.change", "profile", context.userId);
    return { ok: true };
  });

export const submitKyc = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { fullName: string; nin: string; bvn: string }) => {
    const fullName = data.fullName.trim();
    const nin = data.nin.replace(/\s+/g, "");
    const bvn = data.bvn.replace(/\s+/g, "");
    if (fullName.length < 3) throw new Error("Enter the name on your ID.");
    if (!/^\d{11}$/.test(nin)) throw new Error("NIN must be 11 digits.");
    if (!/^\d{11}$/.test(bvn)) throw new Error("BVN must be 11 digits.");
    return { fullName, nin, bvn };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireActiveAccount(sql, context.userId);
    await sql`
      update profiles
      set kyc_full_name = ${data.fullName},
          kyc_nin_last4 = ${data.nin.slice(-4)},
          kyc_bvn_last4 = ${data.bvn.slice(-4)},
          kyc_status = 'pending',
          kyc_submitted_at = now(),
          updated_at = now()
      where user_id = ${context.userId}
    `;
    await audit(sql, context.userId, "kyc.submit", "profile", context.userId, {
      ninLast4: data.nin.slice(-4),
    });
    return { ok: true };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Dashboard> => {
    const sql = await getSql();
    const profileRow = await requireActiveAccount(sql, context.userId);
    await processDueEvents(sql, context.userId);

    const [wallet] = await sql<{ available_kobo: number; restricted_kobo: number }>`
      select available_kobo, restricted_kobo from wallets where user_id = ${context.userId}
    `;
    const planRows = await sql<Parameters<typeof mapPlan>[0]>`
      select * from savings_plans where user_id = ${context.userId}
      order by created_at desc
    `;
    const upcoming = await sql<
      Parameters<typeof mapSchedule>[0] & { plan_title: string; product_type: ProductType }
    >`
      select si.*, p.title as plan_title, p.product_type
      from schedule_items si
      join savings_plans p on p.id = si.plan_id
      where si.user_id = ${context.userId}
        and si.status = 'pending'
        and p.status in ('active', 'matured', 'unlocked')
      order by si.due_date asc
      limit 8
    `;
    const recent = await sql<Parameters<typeof mapLedger>[0]>`
      select * from ledger_entries where user_id = ${context.userId}
      order by created_at desc limit 8
    `;
    const [unread] = await sql<{ c: number }>`
      select count(*)::int as c from notifications
      where user_id = ${context.userId} and read_at is null
    `;
    const announcements = await sql<{ id: number; title: string; body: string; created_at: string }>`
      select id, title, body, created_at from announcements
      where audience in ('customers', 'all')
      order by created_at desc limit 3
    `;

    return {
      profile: mapProfile(profileRow),
      wallet: {
        availableKobo: Number(wallet?.available_kobo ?? 0),
        restrictedKobo: Number(wallet?.restricted_kobo ?? 0),
      },
      plans: planRows.map((r) => withUnlock(mapPlan(r))),
      upcoming: upcoming.map((r) => ({
        ...mapSchedule(r),
        planTitle: r.plan_title,
        productType: r.product_type,
      })),
      recent: recent.map(mapLedger),
      unreadCount: Number(unread?.c ?? 0),
      announcements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        createdAt: a.created_at,
      })),
    };
  });

export const getNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const rows = await sql<{
      id: number;
      title: string;
      body: string;
      kind: string;
      href: string | null;
      read_at: string | null;
      created_at: string;
    }>`
      select * from notifications where user_id = ${context.userId}
      order by created_at desc limit 50
    `;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      kind: r.kind,
      href: r.href,
      readAt: r.read_at,
      createdAt: r.created_at,
    }));
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      update notifications set read_at = now()
      where user_id = ${context.userId} and read_at is null
    `;
    return { ok: true };
  });

export const getProductSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return loadSettings(sql);
  });

export type { Profile };
