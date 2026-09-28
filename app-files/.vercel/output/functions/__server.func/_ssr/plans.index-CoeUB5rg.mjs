import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PRODUCTS } from "./products-tSkkRJsj.mjs";
import { t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { c as Money, d as ProgressBar, f as Screen, i as Empty, l as PageTitle, r as Card, t as Badge } from "./ui-CM96oOa_.mjs";
import { t as formatNaira } from "./money-BB1B04Xn.mjs";
import { d as CalendarDays, i as Target, s as Lock, t as Wallet } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
import { s as listPlans } from "./plans-Bq-w_90J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans.index-CoeUB5rg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	adashi: CalendarDays,
	my_savings: Target,
	locked: Lock,
	allowance: Wallet
};
function PlansRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlansPage, {}) });
}
function PlansPage() {
	const [plans, setPlans] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listPlans().then(setPlans).catch((err) => setError(err instanceof Error ? err.message : "Could not load plans."));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Savings",
			title: "Your plans"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid grid-cols-2 gap-3",
			children: Object.values(PRODUCTS).map((p) => {
				const Icon = ICONS[p.slug];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/plans/new/$product",
					params: { product: p.slug },
					className: "flex items-start gap-2 rounded-xl bg-cream p-3 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-leaf text-forest",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold leading-tight",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-moss",
						children: p.short
					})] })]
				}, p.slug);
			})
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			children: error
		}) : null,
		!plans ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-moss",
			children: "Loading plans…"
		}) : null,
		plans && plans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Nothing here yet",
			body: "Open a product above. You will see terms, dates, and fees before anything is locked in."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: plans?.map((plan) => {
				const pct = plan.targetKobo && plan.targetKobo > 0 ? Math.min(100, plan.savedKobo / plan.targetKobo * 100) : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/plans/$planId",
					params: { planId: String(plan.id) },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.14em] text-moss",
								children: PRODUCTS[plan.productType].name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: plan.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: plan.status === "cancelled" || plan.status === "broken" ? "bad" : plan.unlockEligible ? "good" : "neutral",
								children: plan.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Saved ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
								kobo: plan.savedKobo,
								size: "sm"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-moss",
								children: ["Held ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
									kobo: plan.restrictedKobo,
									size: "sm"
								})]
							})]
						}),
						plan.targetKobo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
							className: "mt-2",
							value: pct
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-moss",
							children: ["Target ", formatNaira(plan.targetKobo)]
						})] }) : null
					] })
				}, plan.id);
			})
		})
	] }) });
}
//#endregion
export { PlansRoute as component };
