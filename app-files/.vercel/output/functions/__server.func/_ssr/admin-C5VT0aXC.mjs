import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CRqFoxqS.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { t as DEFAULT_SETTINGS } from "./products-tSkkRJsj.mjs";
import { _ as requireStaff, a as ensureProfile, d as mapPlan, f as mapProfile, h as notify, i as audit, s as loadSettings, u as mapPayment, y as withUnlock } from "./helpers-MFPpDcIg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C5VT0aXC.js
var getStaffContext_createServerFn_handler = createServerRpc({
	id: "99464115c614ce874b85dae021d3e4378051e3ead5624b96ba3781d8b6c77e96",
	name: "getStaffContext",
	filename: "src/lib/fns/admin.ts"
}, (opts) => getStaffContext.__executeServer(opts));
var getStaffContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getStaffContext_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const profile = await ensureProfile(sql, context.userId);
	const [adminCount] = await sql`
      select count(*)::int as c from profiles where role = 'admin'
    `;
	return {
		profile: mapProfile(profile),
		adminExists: Number(adminCount?.c ?? 0) > 0
	};
});
var claimAdmin_createServerFn_handler = createServerRpc({
	id: "36a7de086e9af033a1ffb827bf8fc2c1027f43d8b22c9a9e0ace3dc252bc78b6",
	name: "claimAdmin",
	filename: "src/lib/fns/admin.ts"
}, (opts) => claimAdmin.__executeServer(opts));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimAdmin_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	const [claimed] = await sql`
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
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "ea2e54267377eb9a06b9bc1dfc342928e06f8f3e64cb628b828468c5630e1acc",
	name: "getAdminOverview",
	filename: "src/lib/fns/admin.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId);
	const [customers] = await sql`select count(*)::int as c from profiles`;
	const [plans] = await sql`select count(*)::int as c from savings_plans where status = 'active'`;
	const [wallet] = await sql`
      select coalesce(sum(available_kobo),0)::bigint as available,
             coalesce(sum(restricted_kobo),0)::bigint as restricted
      from wallets
    `;
	const [deposits] = await sql`
      select count(*)::int as c, coalesce(sum(amount_kobo),0)::bigint as s
      from payment_intents where kind = 'deposit' and status = 'succeeded'
    `;
	const [withdrawals] = await sql`
      select count(*)::int as c, coalesce(sum(amount_kobo),0)::bigint as s
      from payment_intents where kind = 'withdrawal' and status = 'succeeded'
    `;
	const [fees] = await sql`
      select coalesce(sum(-amount_kobo),0)::bigint as s
      from ledger_entries where entry_type in ('fee', 'penalty', 'forfeit') and amount_kobo < 0
    `;
	const recent = await sql`
      select * from payment_intents order by created_at desc limit 12
    `;
	const kycQueue = await sql`
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
		kycQueue
	};
});
var listCustomers_createServerFn_handler = createServerRpc({
	id: "f82c59bfe04ea23d91a764388090f5d60cdb19295388c8296537cab86242033a",
	name: "listCustomers",
	filename: "src/lib/fns/admin.ts"
}, (opts) => listCustomers.__executeServer(opts));
var listCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCustomers_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, [
		"admin",
		"support",
		"finance"
	]);
	return (await sql`
      select p.*, w.available_kobo, w.restricted_kobo
      from profiles p
      left join wallets w on w.user_id = p.user_id
      order by p.created_at desc
      limit 200
    `).map((r) => ({
		...mapProfile(r),
		availableKobo: Number(r.available_kobo ?? 0),
		restrictedKobo: Number(r.restricted_kobo ?? 0)
	}));
});
var setCustomerStatus_createServerFn_handler = createServerRpc({
	id: "e9c504f16d8cc9017aa8bf6557c551ed38ee6982d75a76a0a15952fd80339bbc",
	name: "setCustomerStatus",
	filename: "src/lib/fns/admin.ts"
}, (opts) => setCustomerStatus.__executeServer(opts));
var setCustomerStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data.userId) throw new Error("Missing customer.");
	return data;
}).handler(setCustomerStatus_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, ["admin", "support"]);
	if (data.userId === context.userId) throw new Error("You cannot change your own account status.");
	await sql`
      update profiles set account_status = ${data.accountStatus}, updated_at = now()
      where user_id = ${data.userId}
    `;
	await audit(sql, context.userId, "customer.status", "profile", data.userId, { accountStatus: data.accountStatus });
	await notify(sql, data.userId, "Account update", `Your Faddahy account is now ${data.accountStatus}.`, "account", "/profile");
	return { ok: true };
});
var reviewKyc_createServerFn_handler = createServerRpc({
	id: "ddaeb511eb1cdd136c69dab8d9d7c42e8830efda98d98e3b24e0b7f4c5796bf8",
	name: "reviewKyc",
	filename: "src/lib/fns/admin.ts"
}, (opts) => reviewKyc.__executeServer(opts));
var reviewKyc = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(reviewKyc_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, ["admin", "support"]);
	await sql`
      update profiles set kyc_status = ${data.decision}, updated_at = now()
      where user_id = ${data.userId}
    `;
	await audit(sql, context.userId, "kyc.review", "profile", data.userId, { decision: data.decision });
	await notify(sql, data.userId, data.decision === "verified" ? "Identity verified" : "Identity review update", data.decision === "verified" ? "Your KYC documents were accepted. Higher limits can follow once a licensed partner is live." : "Your KYC submission was not accepted. You may submit again from your profile.", "kyc", "/profile");
	return { ok: true };
});
var listAdminPlans_createServerFn_handler = createServerRpc({
	id: "523d19b335f5cfde00b92bfa31c13e7a4abdce918f9887e31e3ab84bc7ee8101",
	name: "listAdminPlans",
	filename: "src/lib/fns/admin.ts"
}, (opts) => listAdminPlans.__executeServer(opts));
var listAdminPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminPlans_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId);
	return (await sql`
      select p.*, pr.display_name
      from savings_plans p
      join profiles pr on pr.user_id = p.user_id
      order by p.created_at desc
      limit 200
    `).map((r) => ({
		...withUnlock(mapPlan(r)),
		customerName: r.display_name
	}));
});
var listAdminTransactions_createServerFn_handler = createServerRpc({
	id: "9e968a1d4d035bf3c598096756524f1022f236e2e3d4e28ea0cca4d7ec530d9e",
	name: "listAdminTransactions",
	filename: "src/lib/fns/admin.ts"
}, (opts) => listAdminTransactions.__executeServer(opts));
var listAdminTransactions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminTransactions_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, ["admin", "finance"]);
	const payments = await sql`
      select pi.*, pr.display_name
      from payment_intents pi
      join profiles pr on pr.user_id = pi.user_id
      order by pi.created_at desc
      limit 200
    `;
	const ledger = await sql`
      select le.id, le.user_id, le.entry_type, le.amount_kobo, le.reference, le.description, le.created_at, pr.display_name
      from ledger_entries le
      join profiles pr on pr.user_id = le.user_id
      order by le.created_at desc
      limit 200
    `;
	return {
		payments: payments.map((p) => ({
			...mapPayment(p),
			customerName: p.display_name
		})),
		ledger: ledger.map((r) => ({
			id: r.id,
			userId: r.user_id,
			customerName: r.display_name,
			entryType: r.entry_type,
			amountKobo: Number(r.amount_kobo),
			reference: r.reference,
			description: r.description,
			createdAt: r.created_at
		}))
	};
});
var getAdminSettings_createServerFn_handler = createServerRpc({
	id: "8cf9541e9564c1f14d0782d961bef8a24bebda80a1485796796382ce44133b06",
	name: "getAdminSettings",
	filename: "src/lib/fns/admin.ts"
}, (opts) => getAdminSettings.__executeServer(opts));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminSettings_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, ["admin"]);
	return loadSettings(sql);
});
var saveAdminSettings_createServerFn_handler = createServerRpc({
	id: "1ca9e109ecb7ed508ba355ffbd72a13f89ad3957003e88d9a52730897f0c55af",
	name: "saveAdminSettings",
	filename: "src/lib/fns/admin.ts"
}, (opts) => saveAdminSettings.__executeServer(opts));
var saveAdminSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data?.adashi || !data?.wallet) throw new Error("Invalid settings.");
	return data;
}).handler(saveAdminSettings_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, ["admin"]);
	for (const key of Object.keys(DEFAULT_SETTINGS)) await sql`
        insert into product_settings (product_type, settings, updated_at)
        values (${key}, ${JSON.stringify(data[key])}::jsonb, now())
        on conflict (product_type) do update
        set settings = excluded.settings, updated_at = now()
      `;
	await audit(sql, context.userId, "settings.update", "product_settings", "all");
	return loadSettings(sql);
});
var postAnnouncement_createServerFn_handler = createServerRpc({
	id: "0880b34a5b02ea375fcf6f91fcfde2602a677c1a6819c448107ab30b04eab150",
	name: "postAnnouncement",
	filename: "src/lib/fns/admin.ts"
}, (opts) => postAnnouncement.__executeServer(opts));
var postAnnouncement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const title = data.title.trim();
	const body = data.body.trim();
	if (title.length < 3 || body.length < 3) throw new Error("Write a title and a message.");
	return {
		title,
		body
	};
}).handler(postAnnouncement_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, ["admin", "support"]);
	const [row] = await sql`
      insert into announcements (title, body, audience, created_by)
      values (${data.title}, ${data.body}, 'customers', ${context.userId})
      returning id
    `;
	const customers = await sql`select user_id from profiles`;
	for (const c of customers) await notify(sql, c.user_id, data.title, data.body, "announcement", "/home");
	await audit(sql, context.userId, "announcement.create", "announcement", row.id);
	return { id: row.id };
});
var listAuditLogs_createServerFn_handler = createServerRpc({
	id: "42a20e9e774b968d29b0d93d99f91c1aead4db0598cf232d8f4f84710b982076",
	name: "listAuditLogs",
	filename: "src/lib/fns/admin.ts"
}, (opts) => listAuditLogs.__executeServer(opts));
var listAuditLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAuditLogs_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireStaff(sql, context.userId, ["admin"]);
	return sql`
      select id, actor_user_id, action, entity_type, entity_id, created_at
      from audit_logs order by created_at desc limit 100
    `;
});
//#endregion
export { claimAdmin_createServerFn_handler, getAdminOverview_createServerFn_handler, getAdminSettings_createServerFn_handler, getStaffContext_createServerFn_handler, listAdminPlans_createServerFn_handler, listAdminTransactions_createServerFn_handler, listAuditLogs_createServerFn_handler, listCustomers_createServerFn_handler, postAnnouncement_createServerFn_handler, reviewKyc_createServerFn_handler, saveAdminSettings_createServerFn_handler, setCustomerStatus_createServerFn_handler };
