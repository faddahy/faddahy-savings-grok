import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CRqFoxqS.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { c as suggestedContribution, l as todayLagos, n as addDays, r as countPeriodsInclusive, s as generateDates } from "./dates-B8MbA26_.mjs";
import { c as makeRef, d as mapPlan, g as requireActiveAccount, h as notify, i as audit, l as mapLedger, n as assertPin, p as mapSchedule, s as loadSettings, t as applyLedger, y as withUnlock } from "./helpers-MFPpDcIg.mjs";
import { i as pctOf, n as nairaToKobo, t as formatNaira } from "./money-BB1B04Xn.mjs";
import { t as processDueEvents } from "./due-BrDsEfM-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans-Bsu7FtAI.js
function freq(v) {
	if (![
		"daily",
		"every_2_days",
		"every_3_days",
		"weekly",
		"monthly"
	].includes(v)) throw new Error("Choose a valid schedule.");
	return v;
}
var listPlans_createServerFn_handler = createServerRpc({
	id: "69f56a97912f6a35f9fc5cba8b57dbfbf5c9372bd2355d3367ce787e84dad217",
	name: "listPlans",
	filename: "src/lib/fns/plans.ts"
}, (opts) => listPlans.__executeServer(opts));
var listPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPlans_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	await processDueEvents(sql, context.userId);
	return (await sql`
      select * from savings_plans where user_id = ${context.userId}
      order by created_at desc
    `).map((r) => withUnlock(mapPlan(r)));
});
var getPlan_createServerFn_handler = createServerRpc({
	id: "9bdd9516d4b04275cd2ca2fe005f7cff34fa910fc390b196e21b2ba00b93ab9d",
	name: "getPlan",
	filename: "src/lib/fns/plans.ts"
}, (opts) => getPlan.__executeServer(opts));
var getPlan = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => {
	const id = Number(data.id);
	if (!Number.isInteger(id) || id <= 0) throw new Error("Plan not found.");
	return { id };
}).handler(getPlan_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	await processDueEvents(sql, context.userId);
	const [row] = await sql`
      select * from savings_plans where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!row) throw new Error("Plan not found.");
	const schedule = await sql`
      select * from schedule_items where plan_id = ${data.id} and user_id = ${context.userId}
      order by due_date asc, id asc
    `;
	const ledger = await sql`
      select * from ledger_entries
      where user_id = ${context.userId} and plan_id = ${data.id}
      order by created_at desc limit 40
    `;
	const settings = await loadSettings(sql);
	const [wallet] = await sql`
      select available_kobo, restricted_kobo from wallets where user_id = ${context.userId}
    `;
	return {
		plan: withUnlock(mapPlan(row)),
		schedule: schedule.map(mapSchedule),
		ledger: ledger.map(mapLedger),
		settings,
		wallet: {
			availableKobo: Number(wallet?.available_kobo ?? 0),
			restrictedKobo: Number(wallet?.restricted_kobo ?? 0)
		}
	};
});
var createAdashi_createServerFn_handler = createServerRpc({
	id: "7bd8ab92d6235f6b6c7198b10167e4d2df931def0ae6e04966db78ccefc0499b",
	name: "createAdashi",
	filename: "src/lib/fns/plans.ts"
}, (opts) => createAdashi.__executeServer(opts));
var createAdashi = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data.accepted) throw new Error("You must accept the Adashi terms to continue.");
	const contributionNaira = Number(data.contributionNaira);
	if (!Number.isFinite(contributionNaira) || contributionNaira <= 0) throw new Error("Choose a contribution amount.");
	return {
		contributionNaira,
		frequency: freq(data.frequency),
		accepted: true
	};
}).handler(createAdashi_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	const s = (await loadSettings(sql)).adashi;
	if (data.contributionNaira < s.minContributionNaira) throw new Error(`Minimum contribution is ₦${s.minContributionNaira.toLocaleString("en-NG")}.`);
	if (data.contributionNaira > s.maxContributionNaira) throw new Error(`Maximum contribution is ₦${s.maxContributionNaira.toLocaleString("en-NG")}.`);
	if (!s.frequencies.includes(data.frequency)) throw new Error("That schedule is not offered.");
	const start = todayLagos();
	const end = addDays(start, s.cycleDays - 1);
	const contributionKobo = nairaToKobo(data.contributionNaira);
	const dates = generateDates(start, countPeriodsInclusive(start, end, data.frequency), data.frequency).filter((d) => d <= end);
	const targetKobo = contributionKobo * dates.length;
	const title = `Adashi · ${formatNaira(contributionKobo)} ${data.frequency === "daily" ? "daily" : "weekly"}`;
	const [plan] = await sql`
      insert into savings_plans (
        user_id, product_type, title, status, target_kobo, contribution_kobo,
        frequency, start_date, end_date, maturity_date, terms_accepted_at, config
      ) values (
        ${context.userId}, 'adashi', ${title}, 'active', ${targetKobo}, ${contributionKobo},
        ${data.frequency}, ${start}, ${end}, ${end}, now(),
        ${JSON.stringify({
		cycleDays: s.cycleDays,
		missedPenaltyPct: s.missedPenaltyPct,
		payoutFeePct: s.payoutFeePct
	})}::jsonb
      )
      returning id
    `;
	for (const due of dates) await sql`
        insert into schedule_items (plan_id, user_id, kind, due_date, amount_kobo, status)
        values (${plan.id}, ${context.userId}, 'contribution', ${due}, ${contributionKobo}, 'pending')
      `;
	await notify(sql, context.userId, "Adashi started", `${title} runs until ${end}. Your payout does not depend on anyone else.`, "plan", `/plans/${plan.id}`);
	await audit(sql, context.userId, "plan.create", "plan", plan.id, { product: "adashi" });
	return { id: plan.id };
});
var createMySavings_createServerFn_handler = createServerRpc({
	id: "5ff044fc66a98edb67a41d210d20a2b3356ad27743f52fd5358389555b8ac2d1",
	name: "createMySavings",
	filename: "src/lib/fns/plans.ts"
}, (opts) => createMySavings.__executeServer(opts));
var createMySavings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data.accepted) throw new Error("You must accept the My Savings terms.");
	const title = data.title.trim() || "My goal";
	const goalNaira = Number(data.goalNaira);
	const durationDays = Math.round(Number(data.durationDays));
	if (!Number.isFinite(goalNaira) || goalNaira <= 0) throw new Error("Enter a target amount.");
	if (!Number.isFinite(durationDays) || durationDays < 1) throw new Error("Enter a duration.");
	return {
		title,
		goalNaira,
		durationDays,
		frequency: freq(data.frequency),
		accepted: true
	};
}).handler(createMySavings_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	const s = (await loadSettings(sql)).my_savings;
	if (data.goalNaira < s.minGoalNaira || data.goalNaira > s.maxGoalNaira) throw new Error("That target is outside the allowed range.");
	if (data.durationDays < s.minDurationDays || data.durationDays > s.maxDurationDays) throw new Error("That duration is outside the allowed range.");
	if (!s.frequencies.includes(data.frequency)) throw new Error("That schedule is not offered.");
	const start = todayLagos();
	const end = addDays(start, data.durationDays);
	const targetKobo = nairaToKobo(data.goalNaira);
	const contributionKobo = suggestedContribution(targetKobo, start, end, data.frequency);
	const dates = generateDates(start, countPeriodsInclusive(start, end, data.frequency), data.frequency).filter((d) => d <= end);
	const [plan] = await sql`
      insert into savings_plans (
        user_id, product_type, title, status, target_kobo, contribution_kobo,
        frequency, start_date, end_date, maturity_date, terms_accepted_at, config
      ) values (
        ${context.userId}, 'my_savings', ${data.title}, 'active', ${targetKobo}, ${contributionKobo},
        ${data.frequency}, ${start}, ${end}, ${end}, now(),
        ${JSON.stringify({ earlyWithdrawalFeePct: s.earlyWithdrawalFeePct })}::jsonb
      )
      returning id
    `;
	for (const due of dates) await sql`
        insert into schedule_items (plan_id, user_id, kind, due_date, amount_kobo, status)
        values (${plan.id}, ${context.userId}, 'contribution', ${due}, ${contributionKobo}, 'pending')
      `;
	await notify(sql, context.userId, "Goal created", `${data.title}: ${formatNaira(contributionKobo)} ${data.frequency.replaceAll("_", " ")} toward ${formatNaira(targetKobo)}.`, "plan", `/plans/${plan.id}`);
	await audit(sql, context.userId, "plan.create", "plan", plan.id, { product: "my_savings" });
	return { id: plan.id };
});
var createLocked_createServerFn_handler = createServerRpc({
	id: "84e0339aa04dca7482ae91a44cd19a47a92216b8b2209d46cf665bc80ce2f48f",
	name: "createLocked",
	filename: "src/lib/fns/plans.ts"
}, (opts) => createLocked.__executeServer(opts));
var createLocked = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data.accepted) throw new Error("You must accept the Locked Savings terms.");
	const title = data.title.trim() || "Locked savings";
	const fundingNaira = Number(data.fundingNaira);
	if (!Number.isFinite(fundingNaira) || fundingNaira <= 0) throw new Error("Enter the amount to lock.");
	if (![
		"target",
		"date",
		"either",
		"open"
	].includes(data.mode)) throw new Error("Choose a lock rule.");
	return {
		title,
		mode: data.mode,
		targetNaira: data.targetNaira ? Number(data.targetNaira) : void 0,
		durationDays: data.durationDays ? Math.round(Number(data.durationDays)) : void 0,
		fundingNaira,
		pin: data.pin,
		accepted: true
	};
}).handler(createLocked_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	await assertPin(sql, context.userId, data.pin);
	const s = (await loadSettings(sql)).locked;
	if (!s.modes.includes(data.mode)) throw new Error("That lock rule is not offered.");
	const fundingKobo = nairaToKobo(data.fundingNaira);
	const start = todayLagos();
	let targetKobo = null;
	let maturity = null;
	if (data.mode === "target" || data.mode === "either") {
		const t = Number(data.targetNaira ?? 0);
		if (t < s.minTargetNaira) throw new Error("Enter a target amount.");
		targetKobo = nairaToKobo(t);
		if (fundingKobo > targetKobo) throw new Error("Starting amount cannot exceed the target.");
	}
	if (data.mode === "date" || data.mode === "either") {
		const days = Number(data.durationDays ?? 0);
		if (days < s.minLockDays) throw new Error(`Minimum lock is ${s.minLockDays} days.`);
		maturity = addDays(start, days);
	}
	if (data.mode === "open") {
		maturity = null;
		targetKobo = null;
	}
	const [plan] = await sql`
      insert into savings_plans (
        user_id, product_type, title, status, target_kobo, contribution_kobo,
        saved_kobo, restricted_kobo, start_date, maturity_date, lock_mode,
        terms_accepted_at, config
      ) values (
        ${context.userId}, 'locked', ${data.title}, 'active', ${targetKobo}, null,
        ${fundingKobo}, ${fundingKobo}, ${start}, ${maturity}, ${data.mode},
        now(),
        ${JSON.stringify({
		earlyWithdrawalAllowed: s.earlyWithdrawalAllowed,
		openEndedMinDays: s.openEndedMinDays
	})}::jsonb
      )
      returning id
    `;
	const ref = makeRef("LCK");
	await applyLedger(sql, {
		userId: context.userId,
		planId: plan.id,
		entryType: "plan_funding",
		amountKobo: -fundingKobo,
		bucket: "available",
		reference: `${ref}-OUT`,
		description: `Moved to ${data.title}`
	});
	await applyLedger(sql, {
		userId: context.userId,
		planId: plan.id,
		entryType: "plan_funding",
		amountKobo: fundingKobo,
		bucket: "restricted",
		reference: `${ref}-IN`,
		description: `Locked in ${data.title}`
	});
	await notify(sql, context.userId, "Money locked", `${formatNaira(fundingKobo)} is now in ${data.title}. The unlock rule is enforced by the ledger.`, "plan", `/plans/${plan.id}`);
	await audit(sql, context.userId, "plan.create", "plan", plan.id, {
		product: "locked",
		mode: data.mode
	});
	return { id: plan.id };
});
var createAllowance_createServerFn_handler = createServerRpc({
	id: "727cabf7be07b6366067fc37dac5a8ef905186b3eb3732b90769662171d041e7",
	name: "createAllowance",
	filename: "src/lib/fns/plans.ts"
}, (opts) => createAllowance.__executeServer(opts));
var createAllowance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data.accepted) throw new Error("You must accept the Allowance terms.");
	const lumpNaira = Number(data.lumpNaira);
	const allowanceNaira = Number(data.allowanceNaira);
	const earlyBreakPct = Math.round(Number(data.earlyBreakPct));
	if (!Number.isFinite(lumpNaira) || lumpNaira <= 0) throw new Error("Enter the lump sum.");
	if (!Number.isFinite(allowanceNaira) || allowanceNaira <= 0) throw new Error("Enter the allowance amount.");
	if (allowanceNaira > lumpNaira) throw new Error("Allowance cannot be larger than the lump sum.");
	return {
		lumpNaira,
		allowanceNaira,
		frequency: freq(data.frequency),
		earlyBreakPct,
		pin: data.pin,
		accepted: true
	};
}).handler(createAllowance_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	await assertPin(sql, context.userId, data.pin);
	const s = (await loadSettings(sql)).allowance;
	if (data.lumpNaira < s.minLumpNaira) throw new Error(`Minimum lump sum is ₦${s.minLumpNaira.toLocaleString("en-NG")}.`);
	if (data.allowanceNaira < s.minAllowanceNaira) throw new Error(`Minimum allowance is ₦${s.minAllowanceNaira.toLocaleString("en-NG")}.`);
	if (!s.frequencies.includes(data.frequency)) throw new Error("That schedule is not offered.");
	if (data.earlyBreakPct < s.minEarlyBreakPct || data.earlyBreakPct > s.maxEarlyBreakPct) throw new Error(`Early-break charge must be between ${s.minEarlyBreakPct}% and ${s.maxEarlyBreakPct}%.`);
	const lumpKobo = nairaToKobo(data.lumpNaira);
	const allowanceKobo = nairaToKobo(data.allowanceNaira);
	const count = Math.floor(lumpKobo / allowanceKobo);
	if (count < 1) throw new Error("Allowance is too large for this lump sum.");
	const start = todayLagos();
	const dates = generateDates(start, count, data.frequency);
	const title = `Allowance · ${formatNaira(allowanceKobo)}`;
	const [plan] = await sql`
      insert into savings_plans (
        user_id, product_type, title, status, target_kobo, contribution_kobo,
        saved_kobo, restricted_kobo, frequency, start_date, end_date,
        early_break_pct, terms_accepted_at, config
      ) values (
        ${context.userId}, 'allowance', ${title}, 'active', ${lumpKobo}, ${allowanceKobo},
        ${lumpKobo}, ${lumpKobo}, ${data.frequency}, ${start}, ${dates[dates.length - 1] ?? start},
        ${data.earlyBreakPct}, now(),
        ${JSON.stringify({ originalLumpKobo: lumpKobo })}::jsonb
      )
      returning id
    `;
	for (const due of dates) await sql`
        insert into schedule_items (plan_id, user_id, kind, due_date, amount_kobo, status)
        values (${plan.id}, ${context.userId}, 'allowance', ${due}, ${allowanceKobo}, 'pending')
      `;
	const ref = makeRef("ALW");
	await applyLedger(sql, {
		userId: context.userId,
		planId: plan.id,
		entryType: "plan_funding",
		amountKobo: -lumpKobo,
		bucket: "available",
		reference: `${ref}-OUT`,
		description: `Moved to ${title}`
	});
	await applyLedger(sql, {
		userId: context.userId,
		planId: plan.id,
		entryType: "plan_funding",
		amountKobo: lumpKobo,
		bucket: "restricted",
		reference: `${ref}-IN`,
		description: `Held in ${title}`
	});
	await notify(sql, context.userId, "Allowance plan started", `${formatNaira(lumpKobo)} will be released ${data.frequency.replaceAll("_", " ")} at ${formatNaira(allowanceKobo)}.`, "plan", `/plans/${plan.id}`);
	await audit(sql, context.userId, "plan.create", "plan", plan.id, { product: "allowance" });
	return { id: plan.id };
});
var contributeToPlan_createServerFn_handler = createServerRpc({
	id: "5432c153e69f3feeb91633b6f8bd8356ae9888a7269968becd1415b742132a48",
	name: "contributeToPlan",
	filename: "src/lib/fns/plans.ts"
}, (opts) => contributeToPlan.__executeServer(opts));
var contributeToPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const planId = Number(data.planId);
	const naira = Number(data.naira);
	if (!Number.isInteger(planId) || planId <= 0) throw new Error("Plan not found.");
	if (!Number.isFinite(naira) || naira <= 0) throw new Error("Enter a contribution amount.");
	return {
		planId,
		naira,
		pin: data.pin
	};
}).handler(contributeToPlan_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	await assertPin(sql, context.userId, data.pin);
	const [row] = await sql`
      select * from savings_plans where id = ${data.planId} and user_id = ${context.userId}
    `;
	if (!row) throw new Error("Plan not found.");
	const plan = mapPlan(row);
	if (plan.status !== "active" && plan.status !== "unlocked") throw new Error("This plan is not accepting contributions.");
	if (plan.productType === "allowance") throw new Error("Allowance plans are funded once, then released on schedule.");
	const amountKobo = nairaToKobo(data.naira);
	const ref = makeRef("CTB");
	await applyLedger(sql, {
		userId: context.userId,
		planId: plan.id,
		entryType: "contribution",
		amountKobo: -amountKobo,
		bucket: "available",
		reference: `${ref}-OUT`,
		description: `Contribution to ${plan.title}`
	});
	await applyLedger(sql, {
		userId: context.userId,
		planId: plan.id,
		entryType: "contribution",
		amountKobo,
		bucket: "restricted",
		reference: `${ref}-IN`,
		description: `Saved in ${plan.title}`
	});
	await sql`
      update savings_plans
      set saved_kobo = saved_kobo + ${amountKobo},
          restricted_kobo = restricted_kobo + ${amountKobo},
          updated_at = now()
      where id = ${plan.id} and user_id = ${context.userId}
    `;
	const today = todayLagos();
	await sql`
      update schedule_items
      set status = 'completed', completed_at = now()
      where id = (
        select id from schedule_items
        where plan_id = ${plan.id} and user_id = ${context.userId}
          and kind = 'contribution' and status in ('pending', 'missed')
          and due_date <= ${today}
        order by due_date asc, id asc
        limit 1
      )
    `;
	return { ok: true };
});
var withdrawFromPlan_createServerFn_handler = createServerRpc({
	id: "4a8a0168e689e6193880cdccbc99607419ace6d730794d2fb085e829bf3c0843",
	name: "withdrawFromPlan",
	filename: "src/lib/fns/plans.ts"
}, (opts) => withdrawFromPlan.__executeServer(opts));
var withdrawFromPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const planId = Number(data.planId);
	const naira = Number(data.naira);
	if (!Number.isInteger(planId) || planId <= 0) throw new Error("Plan not found.");
	if (!Number.isFinite(naira) || naira <= 0) throw new Error("Enter an amount.");
	return {
		planId,
		naira,
		pin: data.pin,
		earlyBreak: Boolean(data.earlyBreak)
	};
}).handler(withdrawFromPlan_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	await assertPin(sql, context.userId, data.pin);
	await processDueEvents(sql, context.userId);
	const [row] = await sql`
      select * from savings_plans where id = ${data.planId} and user_id = ${context.userId}
    `;
	if (!row) throw new Error("Plan not found.");
	const plan = withUnlock(mapPlan(row));
	const settings = await loadSettings(sql);
	const amountKobo = nairaToKobo(data.naira);
	const today = todayLagos();
	if (plan.productType === "adashi") {
		if (!plan.unlockEligible) throw new Error(plan.unlockReason ?? "Adashi cannot be withdrawn before the cycle ends.");
		const missed = await sql`
        select amount_kobo from schedule_items
        where plan_id = ${plan.id} and user_id = ${context.userId}
          and kind = 'contribution' and status = 'missed'
      `;
		const penaltyPct = Number(plan.config.missedPenaltyPct ?? settings.adashi.missedPenaltyPct);
		const feePct = Number(plan.config.payoutFeePct ?? settings.adashi.payoutFeePct);
		const penaltyKobo = missed.reduce((sum, m) => sum + pctOf(Number(m.amount_kobo), penaltyPct), 0);
		if (amountKobo > plan.restrictedKobo + plan.availableKobo) throw new Error("Amount is more than this plan holds.");
		const feeKobo = pctOf(amountKobo, feePct);
		await releasePlanFunds(sql, context.userId, plan.id, amountKobo, {
			penaltyKobo,
			feeKobo,
			description: `Adashi payout from ${plan.title}`
		});
		await maybeClosePlan(sql, context.userId, plan.id);
		return {
			ok: true,
			penaltyKobo,
			feeKobo
		};
	}
	if (plan.productType === "my_savings") {
		if (amountKobo > plan.restrictedKobo + plan.availableKobo) throw new Error("Amount is more than this plan holds.");
		const feePct = Boolean(plan.endDate && today < plan.endDate) ? Number(plan.config.earlyWithdrawalFeePct ?? settings.my_savings.earlyWithdrawalFeePct) : 0;
		const feeKobo = pctOf(amountKobo, feePct);
		await releasePlanFunds(sql, context.userId, plan.id, amountKobo, {
			feeKobo,
			description: `Withdrawal from ${plan.title}`
		});
		await maybeClosePlan(sql, context.userId, plan.id);
		return {
			ok: true,
			feeKobo,
			penaltyKobo: 0
		};
	}
	if (plan.productType === "locked") {
		if (!plan.unlockEligible) throw new Error(plan.unlockReason ?? "This lock is still in force.");
		if (amountKobo > plan.restrictedKobo + plan.availableKobo) throw new Error("Amount is more than this plan holds.");
		await releasePlanFunds(sql, context.userId, plan.id, amountKobo, { description: `Unlock from ${plan.title}` });
		await maybeClosePlan(sql, context.userId, plan.id);
		return {
			ok: true,
			feeKobo: 0,
			penaltyKobo: 0
		};
	}
	if (plan.productType === "allowance") {
		if (data.earlyBreak) {
			const remaining = plan.restrictedKobo;
			const pct = plan.earlyBreakPct ?? settings.allowance.defaultEarlyBreakPct;
			const forfeit = pctOf(remaining, pct);
			const released = remaining - forfeit;
			if (remaining > 0) {
				const ref = makeRef("BRK");
				if (forfeit > 0) await applyLedger(sql, {
					userId: context.userId,
					planId: plan.id,
					entryType: "forfeit",
					amountKobo: -forfeit,
					bucket: "restricted",
					reference: `${ref}-F`,
					description: `Early-break charge (${pct}%) on ${plan.title}`
				});
				if (released > 0) {
					await applyLedger(sql, {
						userId: context.userId,
						planId: plan.id,
						entryType: "plan_unlock",
						amountKobo: -released,
						bucket: "restricted",
						reference: `${ref}-R`,
						description: `Early break remainder from ${plan.title}`
					});
					await applyLedger(sql, {
						userId: context.userId,
						planId: plan.id,
						entryType: "plan_unlock",
						amountKobo: released,
						bucket: "available",
						reference: `${ref}-A`,
						description: `Released from ${plan.title} after early break`
					});
				}
				await sql`
            update savings_plans
            set restricted_kobo = 0,
                available_kobo = available_kobo + ${released},
                status = 'broken',
                updated_at = now()
            where id = ${plan.id} and user_id = ${context.userId}
          `;
				await sql`
            update schedule_items set status = 'skipped'
            where plan_id = ${plan.id} and user_id = ${context.userId} and status = 'pending'
          `;
			}
			await audit(sql, context.userId, "plan.early_break", "plan", plan.id, {
				forfeit,
				released
			});
			return {
				ok: true,
				feeKobo: forfeit,
				penaltyKobo: 0
			};
		}
		if (amountKobo > plan.availableKobo) throw new Error("Only released allowance can be withdrawn. Restricted funds stay locked.");
		await applyLedger(sql, {
			userId: context.userId,
			planId: plan.id,
			entryType: "plan_unlock",
			amountKobo: -amountKobo,
			bucket: "available",
			reference: makeRef("ALWOUT"),
			description: `Took released allowance from ${plan.title}`
		});
		await sql`
        update savings_plans
        set available_kobo = available_kobo - ${amountKobo}, updated_at = now()
        where id = ${plan.id} and user_id = ${context.userId} and available_kobo >= ${amountKobo}
      `;
		await maybeClosePlan(sql, context.userId, plan.id);
		return {
			ok: true,
			feeKobo: 0,
			penaltyKobo: 0
		};
	}
	throw new Error("Unknown product.");
});
async function releasePlanFunds(sql, userId, planId, amountKobo, opts) {
	const [plan] = await sql`
    select restricted_kobo, available_kobo, title from savings_plans
    where id = ${planId} and user_id = ${userId}
  `;
	if (!plan) throw new Error("Plan not found.");
	const restricted = Number(plan.restricted_kobo);
	const available = Number(plan.available_kobo);
	const fromRestricted = Math.min(amountKobo, restricted);
	const fromAvailable = amountKobo - fromRestricted;
	if (fromAvailable > available) throw new Error("Not enough in this plan.");
	const charges = (opts.penaltyKobo ?? 0) + (opts.feeKobo ?? 0);
	if (amountKobo - charges <= 0 && charges > 0 && amountKobo === restricted + available) {}
	const ref = makeRef("OUT");
	if (fromRestricted > 0) {
		await applyLedger(sql, {
			userId,
			planId,
			entryType: "plan_unlock",
			amountKobo: -fromRestricted,
			bucket: "restricted",
			reference: `${ref}-R`,
			description: opts.description
		});
		await applyLedger(sql, {
			userId,
			planId,
			entryType: "plan_unlock",
			amountKobo: fromRestricted,
			bucket: "available",
			reference: `${ref}-A`,
			description: opts.description
		});
	}
	if (opts.penaltyKobo) await applyLedger(sql, {
		userId,
		planId,
		entryType: "penalty",
		amountKobo: -opts.penaltyKobo,
		bucket: "available",
		reference: `${ref}-P`,
		description: `Missed-contribution penalty`
	});
	if (opts.feeKobo) await applyLedger(sql, {
		userId,
		planId,
		entryType: "fee",
		amountKobo: -opts.feeKobo,
		bucket: "available",
		reference: `${ref}-F`,
		description: `Plan fee`
	});
	await sql`
    update savings_plans
    set restricted_kobo = restricted_kobo - ${fromRestricted},
        available_kobo = available_kobo - ${fromAvailable},
        saved_kobo = greatest(saved_kobo - ${amountKobo}, 0),
        updated_at = now()
    where id = ${planId} and user_id = ${userId}
  `;
}
async function maybeClosePlan(sql, userId, planId) {
	await sql`
    update savings_plans
    set status = 'withdrawn', updated_at = now()
    where id = ${planId} and user_id = ${userId}
      and restricted_kobo = 0 and available_kobo = 0
      and status in ('active', 'matured', 'unlocked', 'broken')
  `;
}
var previewContribution_createServerFn_handler = createServerRpc({
	id: "a372557174b4711f74bc2055744955350375e436e3fb492f5e5738e7df66b058",
	name: "previewContribution",
	filename: "src/lib/fns/plans.ts"
}, (opts) => previewContribution.__executeServer(opts));
var previewContribution = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => {
	return {
		goalNaira: Number(data.goalNaira) || 0,
		durationDays: Math.round(Number(data.durationDays) || 0),
		frequency: data.frequency
	};
}).handler(previewContribution_createServerFn_handler, async ({ data }) => {
	if (data.goalNaira <= 0 || data.durationDays <= 0) return {
		contributionKobo: 0,
		periods: 0,
		endDate: null
	};
	let f;
	try {
		f = freq(data.frequency);
	} catch {
		return {
			contributionKobo: 0,
			periods: 0,
			endDate: null
		};
	}
	const start = todayLagos();
	const end = addDays(start, data.durationDays);
	const targetKobo = nairaToKobo(data.goalNaira);
	const periods = countPeriodsInclusive(start, end, f);
	return {
		contributionKobo: suggestedContribution(targetKobo, start, end, f),
		periods,
		endDate: end
	};
});
//#endregion
export { contributeToPlan_createServerFn_handler, createAdashi_createServerFn_handler, createAllowance_createServerFn_handler, createLocked_createServerFn_handler, createMySavings_createServerFn_handler, getPlan_createServerFn_handler, listPlans_createServerFn_handler, previewContribution_createServerFn_handler, withdrawFromPlan_createServerFn_handler };
