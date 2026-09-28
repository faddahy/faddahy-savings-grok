import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans-Bq-w_90J.js
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
var listPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("69f56a97912f6a35f9fc5cba8b57dbfbf5c9372bd2355d3367ce787e84dad217"));
var getPlan = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => {
	const id = Number(data.id);
	if (!Number.isInteger(id) || id <= 0) throw new Error("Plan not found.");
	return { id };
}).handler(createSsrRpc("9bdd9516d4b04275cd2ca2fe005f7cff34fa910fc390b196e21b2ba00b93ab9d"));
var createAdashi = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data.accepted) throw new Error("You must accept the Adashi terms to continue.");
	const contributionNaira = Number(data.contributionNaira);
	if (!Number.isFinite(contributionNaira) || contributionNaira <= 0) throw new Error("Choose a contribution amount.");
	return {
		contributionNaira,
		frequency: freq(data.frequency),
		accepted: true
	};
}).handler(createSsrRpc("7bd8ab92d6235f6b6c7198b10167e4d2df931def0ae6e04966db78ccefc0499b"));
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
}).handler(createSsrRpc("5ff044fc66a98edb67a41d210d20a2b3356ad27743f52fd5358389555b8ac2d1"));
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
}).handler(createSsrRpc("84e0339aa04dca7482ae91a44cd19a47a92216b8b2209d46cf665bc80ce2f48f"));
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
}).handler(createSsrRpc("727cabf7be07b6366067fc37dac5a8ef905186b3eb3732b90769662171d041e7"));
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
}).handler(createSsrRpc("5432c153e69f3feeb91633b6f8bd8356ae9888a7269968becd1415b742132a48"));
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
}).handler(createSsrRpc("4a8a0168e689e6193880cdccbc99607419ace6d730794d2fb085e829bf3c0843"));
var previewContribution = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => {
	return {
		goalNaira: Number(data.goalNaira) || 0,
		durationDays: Math.round(Number(data.durationDays) || 0),
		frequency: data.frequency
	};
}).handler(createSsrRpc("a372557174b4711f74bc2055744955350375e436e3fb492f5e5738e7df66b058"));
//#endregion
export { createMySavings as a, previewContribution as c, createLocked as i, withdrawFromPlan as l, createAdashi as n, getPlan as o, createAllowance as r, listPlans as s, contributeToPlan as t };
