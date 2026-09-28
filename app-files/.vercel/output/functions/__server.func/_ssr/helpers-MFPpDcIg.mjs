import { t as DEFAULT_SETTINGS } from "./products-tSkkRJsj.mjs";
import { l as todayLagos } from "./dates-B8MbA26_.mjs";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
//#region node_modules/.nitro/vite/services/ssr/assets/helpers-MFPpDcIg.js
var scryptAsync = promisify(scrypt);
function makeRef(prefix) {
	return `${prefix}-${Date.now().toString(36).toUpperCase()}${randomBytes(3).toString("hex").toUpperCase()}`;
}
async function hashPin(pin) {
	const salt = randomBytes(16);
	const derived = await scryptAsync(pin, salt, 32);
	return `${salt.toString("hex")}:${derived.toString("hex")}`;
}
async function verifyPin(pin, stored) {
	const [saltHex, hashHex] = stored.split(":");
	if (!saltHex || !hashHex) return false;
	const salt = Buffer.from(saltHex, "hex");
	const expected = Buffer.from(hashHex, "hex");
	const derived = await scryptAsync(pin, salt, 32);
	if (derived.length !== expected.length) return false;
	return timingSafeEqual(derived, expected);
}
function assertPinFormat(pin) {
	if (!/^\d{4}$/.test(pin)) throw new Error("PIN must be 4 digits.");
}
var NG_PHONE = /^(?:\+234|234|0)[789][01]\d{8}$/;
function normalizePhone(raw) {
	const trimmed = raw.replace(/\s+/g, "");
	if (!NG_PHONE.test(trimmed)) throw new Error("Enter a valid Nigerian mobile number.");
	const digits = trimmed.replace(/^\+/, "");
	if (digits.startsWith("234")) return `+${digits}`;
	return `+234${digits.slice(1)}`;
}
async function audit(sql, actor, action, entityType, entityId, details = {}) {
	await sql`
    insert into audit_logs (actor_user_id, action, entity_type, entity_id, details)
    values (${actor}, ${action}, ${entityType}, ${entityId == null ? null : String(entityId)}, ${JSON.stringify(details)}::jsonb)
  `;
}
async function notify(sql, userId, title, body, kind = "info", href = null) {
	await sql`
    insert into notifications (user_id, title, body, kind, href)
    values (${userId}, ${title}, ${body}, ${kind}, ${href})
  `;
}
function mapProfile(row) {
	return {
		userId: row.user_id,
		displayName: row.display_name,
		phone: row.phone,
		hasPin: Boolean(row.pin_hash),
		kycStatus: row.kyc_status,
		kycFullName: row.kyc_full_name,
		kycNinLast4: row.kyc_nin_last4,
		kycBvnLast4: row.kyc_bvn_last4,
		accountStatus: row.account_status,
		role: row.role,
		onboarded: Boolean(row.onboarded_at),
		createdAt: row.created_at
	};
}
async function ensureProfile(sql, userId, seed) {
	const existing = await sql`select * from profiles where user_id = ${userId} limit 1`;
	if (existing[0]) return existing[0];
	await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${(seed?.displayName ?? "").trim()})
    on conflict (user_id) do nothing
  `;
	await sql`
    insert into wallets (user_id)
    values (${userId})
    on conflict (user_id) do nothing
  `;
	const created = await sql`select * from profiles where user_id = ${userId} limit 1`;
	if (!created[0]) throw new Error("Could not create profile.");
	return created[0];
}
async function requireActiveAccount(sql, userId) {
	const row = await ensureProfile(sql, userId);
	if (row.account_status === "suspended") throw new Error("This account is suspended. Contact Faddahy support.");
	return row;
}
async function getPinHash(sql, userId) {
	const [row] = await sql`
    select pin_hash from profiles where user_id = ${userId}
  `;
	if (!row?.pin_hash) throw new Error("Set a 4-digit PIN in your profile first.");
	return row.pin_hash;
}
async function assertPin(sql, userId, pin) {
	assertPinFormat(pin);
	if (!await verifyPin(pin, await getPinHash(sql, userId))) throw new Error("Incorrect PIN.");
}
function parseConfig(raw) {
	if (!raw) return {};
	if (typeof raw === "string") try {
		return JSON.parse(raw);
	} catch {
		return {};
	}
	return raw;
}
function mapPlan(row) {
	return {
		id: row.id,
		userId: row.user_id,
		productType: row.product_type,
		title: row.title,
		status: row.status,
		targetKobo: row.target_kobo,
		contributionKobo: row.contribution_kobo,
		savedKobo: Number(row.saved_kobo),
		availableKobo: Number(row.available_kobo),
		restrictedKobo: Number(row.restricted_kobo),
		frequency: row.frequency,
		startDate: row.start_date,
		endDate: row.end_date,
		maturityDate: row.maturity_date,
		lockMode: row.lock_mode,
		earlyBreakPct: row.early_break_pct,
		termsAcceptedAt: row.terms_accepted_at,
		config: parseConfig(row.config),
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function withUnlock(plan) {
	const today = todayLagos();
	let eligible = false;
	let reason = null;
	if (plan.status !== "active") {
		if (plan.status === "matured" || plan.status === "unlocked") {
			eligible = plan.restrictedKobo > 0 || plan.availableKobo > 0;
			reason = "This plan has reached its release rule.";
		}
		return {
			...plan,
			unlockEligible: eligible,
			unlockReason: reason
		};
	}
	if (plan.productType === "adashi") {
		eligible = Boolean(plan.endDate && today >= plan.endDate);
		reason = eligible ? "Your 30-day cycle has ended." : "Adashi cannot be withdrawn until the cycle ends.";
	} else if (plan.productType === "my_savings") {
		eligible = true;
		reason = plan.endDate && today < plan.endDate ? "You may withdraw early. An early-withdrawal fee applies until the target date." : "You may withdraw from this plan.";
	} else if (plan.productType === "locked") {
		const mode = plan.lockMode ?? "open";
		const hitTarget = plan.targetKobo != null && plan.savedKobo >= plan.targetKobo && plan.targetKobo > 0;
		const hitDate = Boolean(plan.maturityDate && today >= plan.maturityDate);
		if (mode === "target") {
			eligible = hitTarget;
			reason = eligible ? "Target amount reached." : "Locked until the target amount is reached.";
		} else if (mode === "date") {
			eligible = hitDate;
			reason = eligible ? "Maturity date reached." : "Locked until the maturity date.";
		} else if (mode === "either") {
			eligible = hitTarget || hitDate;
			reason = eligible ? hitTarget ? "Target amount reached." : "Maturity date reached." : "Locked until the target amount or the maturity date, whichever comes first.";
		} else {
			const minDays = Number(plan.config.openEndedMinDays ?? 30);
			const held = plan.startDate ? today >= plan.startDate : false;
			const daysHeld = plan.startDate ? Math.max(0, Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${plan.startDate}T00:00:00Z`)) / 864e5)) : 0;
			eligible = held && daysHeld >= minDays;
			reason = eligible ? "Minimum holding period has ended." : `Open-ended lock. Unlock is allowed after ${minDays} days.`;
		}
	} else if (plan.productType === "allowance") {
		eligible = plan.availableKobo > 0;
		reason = eligible ? "Released allowance is available to withdraw." : "Restricted funds stay locked until each allowance date. Early break forfeits a percentage you agreed to.";
	}
	return {
		...plan,
		unlockEligible: eligible,
		unlockReason: reason
	};
}
async function loadSettings(sql) {
	const rows = await sql`
    select product_type, settings from product_settings
  `;
	const next = structuredClone(DEFAULT_SETTINGS);
	for (const row of rows) {
		const parsed = typeof row.settings === "string" ? JSON.parse(row.settings) : row.settings;
		const key = row.product_type;
		if (key in next && parsed && typeof parsed === "object") next[key] = {
			...next[key],
			...parsed
		};
	}
	return next;
}
async function getWallet(sql, userId) {
	const [row] = await sql`
    select available_kobo, restricted_kobo from wallets where user_id = ${userId}
  `;
	if (!row) return {
		available_kobo: 0,
		restricted_kobo: 0
	};
	return {
		available_kobo: Number(row.available_kobo),
		restricted_kobo: Number(row.restricted_kobo)
	};
}
async function applyLedger(sql, args) {
	if (args.amountKobo === 0) {
		const w = await getWallet(sql, args.userId);
		return {
			available: w.available_kobo,
			restricted: w.restricted_kobo
		};
	}
	const deltaAvail = args.bucket === "available" ? args.amountKobo : 0;
	const deltaRest = args.bucket === "restricted" ? args.amountKobo : 0;
	const [wallet] = await sql`
    update wallets
    set
      available_kobo = available_kobo + ${deltaAvail},
      restricted_kobo = restricted_kobo + ${deltaRest},
      updated_at = now()
    where user_id = ${args.userId}
      and available_kobo + ${deltaAvail} >= 0
      and restricted_kobo + ${deltaRest} >= 0
    returning available_kobo, restricted_kobo
  `;
	if (!wallet) throw new Error(args.amountKobo < 0 ? "Not enough money in this balance." : "Wallet could not be updated.");
	const available = Number(wallet.available_kobo);
	const restricted = Number(wallet.restricted_kobo);
	await sql`
    insert into ledger_entries (
      user_id, plan_id, entry_type, amount_kobo, wallet_bucket,
      available_after_kobo, restricted_after_kobo, reference, description, metadata
    ) values (
      ${args.userId},
      ${args.planId ?? null},
      ${args.entryType},
      ${args.amountKobo},
      ${args.bucket},
      ${available},
      ${restricted},
      ${args.reference},
      ${args.description},
      ${JSON.stringify(args.metadata ?? {})}::jsonb
    )
  `;
	return {
		available,
		restricted
	};
}
function mapSchedule(row) {
	return {
		id: row.id,
		planId: row.plan_id,
		kind: row.kind,
		dueDate: row.due_date,
		amountKobo: Number(row.amount_kobo),
		status: row.status,
		completedAt: row.completed_at
	};
}
function mapLedger(row) {
	return {
		id: row.id,
		planId: row.plan_id,
		entryType: row.entry_type,
		amountKobo: Number(row.amount_kobo),
		walletBucket: row.wallet_bucket,
		availableAfterKobo: Number(row.available_after_kobo),
		restrictedAfterKobo: Number(row.restricted_after_kobo),
		reference: row.reference,
		description: row.description,
		createdAt: row.created_at
	};
}
function mapPayment(row) {
	return {
		id: row.id,
		planId: row.plan_id,
		kind: row.kind,
		amountKobo: Number(row.amount_kobo),
		feeKobo: Number(row.fee_kobo),
		status: row.status,
		provider: row.provider,
		reference: row.reference,
		destinationBank: row.destination_bank,
		destinationAccount: row.destination_account,
		destinationName: row.destination_name,
		failureReason: row.failure_reason,
		createdAt: row.created_at
	};
}
async function requireStaff(sql, userId, roles = [
	"admin",
	"finance",
	"support"
]) {
	const row = await ensureProfile(sql, userId);
	if (!roles.includes(row.role)) throw new Error("You do not have access to the staff desk.");
	return row;
}
//#endregion
export { requireStaff as _, ensureProfile as a, makeRef as c, mapPlan as d, mapProfile as f, requireActiveAccount as g, notify as h, audit as i, mapLedger as l, normalizePhone as m, assertPin as n, hashPin as o, mapSchedule as p, assertPinFormat as r, loadSettings as s, applyLedger as t, mapPayment as u, verifyPin as v, withUnlock as y };
