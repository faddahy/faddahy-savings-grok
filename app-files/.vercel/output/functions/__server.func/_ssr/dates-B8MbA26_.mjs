//#region node_modules/.nitro/vite/services/ssr/assets/dates-B8MbA26_.js
var LAGOS = "Africa/Lagos";
function todayLagos() {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: LAGOS,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(/* @__PURE__ */ new Date());
}
function addDays(isoDate, days) {
	const [y, m, d] = isoDate.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d));
	dt.setUTCDate(dt.getUTCDate() + days);
	return dt.toISOString().slice(0, 10);
}
function diffDays(from, to) {
	const a = Date.parse(`${from}T00:00:00Z`);
	const b = Date.parse(`${to}T00:00:00Z`);
	return Math.round((b - a) / 864e5);
}
function formatLongDate(isoDate) {
	const [y, m, d] = isoDate.split("-").map(Number);
	return new Intl.DateTimeFormat("en-NG", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: LAGOS
	}).format(new Date(Date.UTC(y, m - 1, d, 12)));
}
function formatShortDate(isoDate) {
	const [y, m, d] = isoDate.split("-").map(Number);
	return new Intl.DateTimeFormat("en-NG", {
		day: "numeric",
		month: "short",
		timeZone: LAGOS
	}).format(new Date(Date.UTC(y, m - 1, d, 12)));
}
function formatDateTime(iso) {
	return new Intl.DateTimeFormat("en-NG", {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
		timeZone: LAGOS
	}).format(new Date(iso));
}
var FREQUENCY_LABEL = {
	daily: "Every day",
	every_2_days: "Every 2 days",
	every_3_days: "Every 3 days",
	weekly: "Every week",
	monthly: "Every month"
};
function frequencyStepDays(freq) {
	switch (freq) {
		case "daily": return 1;
		case "every_2_days": return 2;
		case "every_3_days": return 3;
		case "weekly": return 7;
		case "monthly": return 30;
	}
}
function generateDates(start, count, freq) {
	const step = frequencyStepDays(freq);
	const dates = [];
	for (let i = 0; i < count; i++) dates.push(addDays(start, i * step));
	return dates;
}
function suggestedContribution(targetKobo, start, end, freq) {
	const periods = Math.max(1, countPeriodsInclusive(start, end, freq));
	return Math.ceil(targetKobo / periods / 100) * 100;
}
function countPeriodsInclusive(start, end, freq) {
	if (end < start) return 1;
	const step = frequencyStepDays(freq);
	return Math.floor(diffDays(start, end) / step) + 1;
}
//#endregion
export { formatLongDate as a, suggestedContribution as c, formatDateTime as i, todayLagos as l, addDays as n, formatShortDate as o, countPeriodsInclusive as r, generateDates as s, FREQUENCY_LABEL as t };
