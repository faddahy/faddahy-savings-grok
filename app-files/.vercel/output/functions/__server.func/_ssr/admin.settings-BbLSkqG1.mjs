import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatDateTime } from "./dates-B8MbA26_.mjs";
import { d as saveAdminSettings, r as getAdminSettings, s as listAuditLogs } from "./admin-B5HIen-N.mjs";
import { a as ErrorText, n as Button, o as Field, r as Card, s as Input } from "./ui-CM96oOa_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-BbLSkqG1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getAdminSettings().then(setSettings).catch((err) => setError(err instanceof Error ? err.message : "No access"));
		listAuditLogs().then(setLogs).catch(() => setLogs([]));
	}, []);
	if (error && !settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: error
	});
	if (!settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-moss",
		children: "Loading settings…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Product rules"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: "These numbers apply to new plans. Existing plans keep the terms accepted at opening."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Adashi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Missed penalty %",
						value: settings.adashi.missedPenaltyPct,
						onChange: (v) => setSettings({
							...settings,
							adashi: {
								...settings.adashi,
								missedPenaltyPct: v
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Payout fee %",
						value: settings.adashi.payoutFeePct,
						onChange: (v) => setSettings({
							...settings,
							adashi: {
								...settings.adashi,
								payoutFeePct: v
							}
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "My Savings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Early withdrawal fee %",
					value: settings.my_savings.earlyWithdrawalFeePct,
					onChange: (v) => setSettings({
						...settings,
						my_savings: {
							...settings.my_savings,
							earlyWithdrawalFeePct: v
						}
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Allowance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Minimum early-break %",
						value: settings.allowance.minEarlyBreakPct,
						onChange: (v) => setSettings({
							...settings,
							allowance: {
								...settings.allowance,
								minEarlyBreakPct: v
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Maximum early-break %",
						value: settings.allowance.maxEarlyBreakPct,
						onChange: (v) => setSettings({
							...settings,
							allowance: {
								...settings.allowance,
								maxEarlyBreakPct: v
							}
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Wallet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Minimum deposit (naira)",
						value: settings.wallet.minDepositNaira,
						onChange: (v) => setSettings({
							...settings,
							wallet: {
								...settings.wallet,
								minDepositNaira: v
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Withdrawal fee %",
						value: settings.wallet.withdrawalFeePct,
						onChange: (v) => setSettings({
							...settings,
							wallet: {
								...settings.wallet,
								withdrawalFeePct: v
							}
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-forest",
				children: msg
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					setError(null);
					try {
						const next = await saveAdminSettings({ data: settings });
						setSettings(next);
						setMsg("Saved.");
					} catch (err) {
						setError(err instanceof Error ? err.message : "Could not save.");
					}
				},
				children: "Save rules"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: "Audit log"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 divide-y divide-line text-sm",
				children: logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: l.action
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-sage",
						children: [
							l.entity_type,
							" ",
							l.entity_id ?? "",
							" · ",
							formatDateTime(l.created_at)
						]
					})]
				}, l.id))
			})] })
		]
	});
}
function Num({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			value: String(value),
			onChange: (e) => onChange(Number(e.target.value))
		})
	});
}
//#endregion
export { AdminSettings as component };
