import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CRqFoxqS.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { a as ensureProfile, d as mapPlan, f as mapProfile, g as requireActiveAccount, i as audit, l as mapLedger, m as normalizePhone, o as hashPin, p as mapSchedule, r as assertPinFormat, s as loadSettings, v as verifyPin, y as withUnlock } from "./helpers-MFPpDcIg.mjs";
import { t as processDueEvents } from "./due-BrDsEfM-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BKj7PaJn.js
var getSessionProfile_createServerFn_handler = createServerRpc({
	id: "d962de7f1f4ffe979fc89cf53f0a17189629c5579c5097115c9efbcb649306a6",
	name: "getSessionProfile",
	filename: "src/lib/fns/profile.ts"
}, (opts) => getSessionProfile.__executeServer(opts));
var getSessionProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSessionProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const row = await ensureProfile(sql, context.userId);
	return mapProfile(row);
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "06d5f26272786f5f782b103b0b735c30a8cdadca1489d8d7af58a79fd9f366e9",
	name: "completeOnboarding",
	filename: "src/lib/fns/profile.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const displayName = data.displayName.trim();
	if (displayName.length < 2) throw new Error("Please enter your name.");
	const phone = normalizePhone(data.phone);
	assertPinFormat(data.pin);
	return {
		displayName,
		phone,
		pin: data.pin
	};
}).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
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
	await audit(sql, context.userId, "onboarding.complete", "profile", context.userId, { phone: data.phone });
	const [row] = await sql`select * from profiles where user_id = ${context.userId}`;
	return mapProfile(row);
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "77e864291e2c19936765b58f5565c065f622ce93e62e20afd3251a438b124fe8",
	name: "updateProfile",
	filename: "src/lib/fns/profile.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const displayName = data.displayName.trim();
	if (displayName.length < 2) throw new Error("Please enter your name.");
	return {
		displayName,
		phone: normalizePhone(data.phone)
	};
}).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	await sql`
      update profiles
      set display_name = ${data.displayName}, phone = ${data.phone}, updated_at = now()
      where user_id = ${context.userId}
    `;
	const [row] = await sql`select * from profiles where user_id = ${context.userId}`;
	return mapProfile(row);
});
var changePin_createServerFn_handler = createServerRpc({
	id: "6f9f1ef12cf549ab41ad2ad63c84a1923e227112fdb420703ee2a2536fbf38d2",
	name: "changePin",
	filename: "src/lib/fns/profile.ts"
}, (opts) => changePin.__executeServer(opts));
var changePin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	assertPinFormat(data.currentPin);
	assertPinFormat(data.nextPin);
	if (data.currentPin === data.nextPin) throw new Error("Choose a new PIN.");
	return data;
}).handler(changePin_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const [row] = await sql`
      select pin_hash from profiles where user_id = ${context.userId}
    `;
	if (!row?.pin_hash) throw new Error("No PIN is set yet.");
	if (!await verifyPin(data.currentPin, row.pin_hash)) throw new Error("Current PIN is incorrect.");
	await sql`update profiles set pin_hash = ${await hashPin(data.nextPin)}, updated_at = now() where user_id = ${context.userId}`;
	await audit(sql, context.userId, "pin.change", "profile", context.userId);
	return { ok: true };
});
var submitKyc_createServerFn_handler = createServerRpc({
	id: "3c2a6c720372a310866a20da7a2784465999a02190833328af06153e8dddc168",
	name: "submitKyc",
	filename: "src/lib/fns/profile.ts"
}, (opts) => submitKyc.__executeServer(opts));
var submitKyc = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const fullName = data.fullName.trim();
	const nin = data.nin.replace(/\s+/g, "");
	const bvn = data.bvn.replace(/\s+/g, "");
	if (fullName.length < 3) throw new Error("Enter the name on your ID.");
	if (!/^\d{11}$/.test(nin)) throw new Error("NIN must be 11 digits.");
	if (!/^\d{11}$/.test(bvn)) throw new Error("BVN must be 11 digits.");
	return {
		fullName,
		nin,
		bvn
	};
}).handler(submitKyc_createServerFn_handler, async ({ context, data }) => {
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
	await audit(sql, context.userId, "kyc.submit", "profile", context.userId, { ninLast4: data.nin.slice(-4) });
	return { ok: true };
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "f89251c361405bf24852ad2eefca958b3dbe87c69077cc5f23cebadade21b6b0",
	name: "getDashboard",
	filename: "src/lib/fns/profile.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const profileRow = await requireActiveAccount(sql, context.userId);
	await processDueEvents(sql, context.userId);
	const [wallet] = await sql`
      select available_kobo, restricted_kobo from wallets where user_id = ${context.userId}
    `;
	const planRows = await sql`
      select * from savings_plans where user_id = ${context.userId}
      order by created_at desc
    `;
	const upcoming = await sql`
      select si.*, p.title as plan_title, p.product_type
      from schedule_items si
      join savings_plans p on p.id = si.plan_id
      where si.user_id = ${context.userId}
        and si.status = 'pending'
        and p.status in ('active', 'matured', 'unlocked')
      order by si.due_date asc
      limit 8
    `;
	const recent = await sql`
      select * from ledger_entries where user_id = ${context.userId}
      order by created_at desc limit 8
    `;
	const [unread] = await sql`
      select count(*)::int as c from notifications
      where user_id = ${context.userId} and read_at is null
    `;
	const announcements = await sql`
      select id, title, body, created_at from announcements
      where audience in ('customers', 'all')
      order by created_at desc limit 3
    `;
	return {
		profile: mapProfile(profileRow),
		wallet: {
			availableKobo: Number(wallet?.available_kobo ?? 0),
			restrictedKobo: Number(wallet?.restricted_kobo ?? 0)
		},
		plans: planRows.map((r) => withUnlock(mapPlan(r))),
		upcoming: upcoming.map((r) => ({
			...mapSchedule(r),
			planTitle: r.plan_title,
			productType: r.product_type
		})),
		recent: recent.map(mapLedger),
		unreadCount: Number(unread?.c ?? 0),
		announcements: announcements.map((a) => ({
			id: a.id,
			title: a.title,
			body: a.body,
			createdAt: a.created_at
		}))
	};
});
var getNotifications_createServerFn_handler = createServerRpc({
	id: "cb53c46e062d98a59d6944a9d9e73ecdb9534cf0e8f12f918898a23dcf96b764",
	name: "getNotifications",
	filename: "src/lib/fns/profile.ts"
}, (opts) => getNotifications.__executeServer(opts));
var getNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getNotifications_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	return (await sql`
      select * from notifications where user_id = ${context.userId}
      order by created_at desc limit 50
    `).map((r) => ({
		id: r.id,
		title: r.title,
		body: r.body,
		kind: r.kind,
		href: r.href,
		readAt: r.read_at,
		createdAt: r.created_at
	}));
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "ad77713ac37bb24f773f4daa6e701d37a25f5af635c9975bd84a796eb619dad9",
	name: "markNotificationsRead",
	filename: "src/lib/fns/profile.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql())`
      update notifications set read_at = now()
      where user_id = ${context.userId} and read_at is null
    `;
	return { ok: true };
});
var getProductSettings_createServerFn_handler = createServerRpc({
	id: "e7b2a50a41cc378221bbad9f1d1898ee1b53156aa2e71c1efe9854450ffb34e5",
	name: "getProductSettings",
	filename: "src/lib/fns/profile.ts"
}, (opts) => getProductSettings.__executeServer(opts));
var getProductSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getProductSettings_createServerFn_handler, async () => {
	const sql = await getSql();
	return loadSettings(sql);
});
//#endregion
export { changePin_createServerFn_handler, completeOnboarding_createServerFn_handler, getDashboard_createServerFn_handler, getNotifications_createServerFn_handler, getProductSettings_createServerFn_handler, getSessionProfile_createServerFn_handler, markNotificationsRead_createServerFn_handler, submitKyc_createServerFn_handler, updateProfile_createServerFn_handler };
