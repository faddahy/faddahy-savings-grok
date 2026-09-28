import { l as todayLagos } from "./dates-B8MbA26_.mjs";
import { c as makeRef, h as notify, t as applyLedger } from "./helpers-MFPpDcIg.mjs";
import { t as formatNaira } from "./money-BB1B04Xn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/due-BrDsEfM-.js
/**
* Advance time-based plan rules. Called from customer reads so the preview
* has no cron, and remains correct when a licensed partner later adds a worker.
*/
async function processDueEvents(sql, userId) {
	const today = todayLagos();
	const dueAllowances = await sql`
    select si.id, si.plan_id, si.amount_kobo
    from schedule_items si
    join savings_plans p on p.id = si.plan_id
    where si.user_id = ${userId}
      and si.kind = 'allowance'
      and si.status = 'pending'
      and si.due_date <= ${today}
      and p.status = 'active'
    order by si.due_date asc, si.id asc
  `;
	for (const item of dueAllowances) {
		const [plan] = await sql`
      select id, restricted_kobo, title from savings_plans
      where id = ${item.plan_id} and user_id = ${userId}
    `;
		if (!plan) continue;
		const amount = Math.min(Number(item.amount_kobo), Number(plan.restricted_kobo));
		if (amount <= 0) {
			await sql`update schedule_items set status = 'skipped' where id = ${item.id} and user_id = ${userId}`;
			continue;
		}
		const refOut = makeRef("REL");
		await applyLedger(sql, {
			userId,
			planId: item.plan_id,
			entryType: "allowance_release",
			amountKobo: -amount,
			bucket: "restricted",
			reference: `${refOut}-R`,
			description: `Allowance released from ${plan.title}`
		});
		await applyLedger(sql, {
			userId,
			planId: item.plan_id,
			entryType: "allowance_release",
			amountKobo: amount,
			bucket: "available",
			reference: `${refOut}-A`,
			description: `Allowance available from ${plan.title}`
		});
		await sql`
      update savings_plans
      set
        restricted_kobo = restricted_kobo - ${amount},
        available_kobo = available_kobo + ${amount},
        updated_at = now()
      where id = ${item.plan_id} and user_id = ${userId}
        and restricted_kobo >= ${amount}
    `;
		await sql`
      update schedule_items
      set status = 'released', completed_at = now()
      where id = ${item.id} and user_id = ${userId}
    `;
		await notify(sql, userId, "Allowance is ready", `${formatNaira(amount)} from ${plan.title} is now available to withdraw.`, "allowance", `/plans/${item.plan_id}`);
	}
	await sql`
    update schedule_items si
    set status = 'missed'
    from savings_plans p
    where si.plan_id = p.id
      and si.user_id = ${userId}
      and si.kind = 'contribution'
      and si.status = 'pending'
      and si.due_date < ${today}
      and p.status = 'active'
      and p.product_type in ('adashi', 'my_savings')
  `;
	const matured = await sql`
    select id, title, product_type from savings_plans
    where user_id = ${userId}
      and status = 'active'
      and product_type = 'adashi'
      and end_date is not null
      and end_date <= ${today}
  `;
	for (const plan of matured) {
		await sql`
      update savings_plans set status = 'matured', updated_at = now()
      where id = ${plan.id} and user_id = ${userId} and status = 'active'
    `;
		await notify(sql, userId, "Adashi cycle complete", `${plan.title} has reached the end of its 30 days. You can withdraw the eligible balance.`, "maturity", `/plans/${plan.id}`);
	}
	const lockedReady = await sql`
    select id, title, lock_mode, target_kobo, saved_kobo, maturity_date, start_date, config
    from savings_plans
    where user_id = ${userId} and status = 'active' and product_type = 'locked'
  `;
	for (const plan of lockedReady) {
		const cfg = typeof plan.config === "string" ? JSON.parse(plan.config) : plan.config ?? {};
		const mode = plan.lock_mode ?? "open";
		const hitTarget = plan.target_kobo != null && Number(plan.saved_kobo) >= Number(plan.target_kobo);
		const hitDate = Boolean(plan.maturity_date && today >= plan.maturity_date);
		let ready = false;
		if (mode === "target") ready = hitTarget;
		else if (mode === "date") ready = hitDate;
		else if (mode === "either") ready = hitTarget || hitDate;
		else {
			const minDays = Number(cfg.openEndedMinDays ?? 30);
			ready = (plan.start_date ? Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${plan.start_date}T00:00:00Z`)) / 864e5) : 0) >= minDays;
		}
		if (ready) {
			await sql`
        update savings_plans set status = 'unlocked', updated_at = now()
        where id = ${plan.id} and user_id = ${userId} and status = 'active'
      `;
			await notify(sql, userId, "Locked savings can be opened", `${plan.title} now meets its unlock rule.`, "unlock", `/plans/${plan.id}`);
		}
	}
}
//#endregion
export { processDueEvents as t };
