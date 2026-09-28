//#region node_modules/.nitro/vite/services/ssr/assets/money-BB1B04Xn.js
/** All money is stored as integer kobo. ₦1 = 100 kobo. */
function nairaToKobo(naira) {
	if (!Number.isFinite(naira)) return 0;
	return Math.round(naira * 100);
}
function formatNaira(kobo, opts) {
	const naira = (kobo || 0) / 100;
	if (opts?.compact && Math.abs(naira) >= 1e6) {
		const m = naira / 1e6;
		return `₦${m.toFixed(m >= 10 ? 0 : 1)}m`;
	}
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: naira % 1 === 0 ? 0 : 2
	}).format(naira);
}
function parseNairaInput(raw) {
	const cleaned = raw.replace(/[₦,\s]/g, "");
	if (!cleaned) return 0;
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : 0;
}
function pctOf(kobo, pct) {
	return Math.round(kobo * pct / 100);
}
//#endregion
export { pctOf as i, nairaToKobo as n, parseNairaInput as r, formatNaira as t };
