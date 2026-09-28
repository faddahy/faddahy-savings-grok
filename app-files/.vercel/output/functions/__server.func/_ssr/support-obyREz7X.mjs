import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { f as Screen, l as PageTitle, r as Card } from "./ui-CM96oOa_.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-obyREz7X.js
var import_jsx_runtime = require_jsx_runtime();
function SupportRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportPage, {}) });
}
function SupportPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
		kicker: "Help",
		title: "How Faddahy works"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: "Your money is yours"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-moss",
				children: "Adashi here is not ajo where one person is paid from another person’s contribution. Each plan has its own ledger. Customer savings are not working capital for wholesale or staff."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: "Four products"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 list-disc space-y-1 pl-4 text-sm text-moss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Adashi — 30-day personal cycle. No early withdrawal. Penalty on missed days at payout." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "My Savings — your goal, your pace. Early withdrawal has a fee until the target date." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Locked — server-enforced lock until target, date, either, or the open-ended minimum hold." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Allowance — lump sum in, a little out on a calendar. Early break forfeits the percentage you chose." })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Deposits and withdrawals"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-moss",
					children: "This preview uses a sandbox bank rail. Opening a payment page does not credit you. The server verifies the unique reference and writes one ledger line. Duplicate confirms do not double-credit."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-moss",
					children: "Live naira requires a CBN-licensed partner (for example Paystack, Flutterwave, or a deposit-taking bank) and KYC at their required level. That work is a later phase."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: "Need a person?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-moss",
				children: "Write to support through your Faddahy operator. Staff can see your plan status. They cannot quietly edit balances. Corrections go through an auditable process."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/home",
				className: "block text-center text-sm font-semibold text-forest",
				children: "Back home"
			})
		]
	})] }) });
}
//#endregion
export { SupportRoute as component };
