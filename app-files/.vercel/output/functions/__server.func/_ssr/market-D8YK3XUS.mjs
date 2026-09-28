import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getDashboard, t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { c as Money, f as Screen, l as PageTitle, r as Card, t as Badge } from "./ui-CM96oOa_.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-D8YK3XUS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE = [
	{
		name: "50kg rice (wholesale)",
		price: 685e4,
		unit: "bag",
		note: "Coming soon"
	},
	{
		name: "Vegetable oil 25L",
		price: 42e5,
		unit: "keg",
		note: "Coming soon"
	},
	{
		name: "Indomie carton",
		price: 98e4,
		unit: "carton",
		note: "Coming soon"
	},
	{
		name: "Peak milk carton",
		price: 145e4,
		unit: "carton",
		note: "Coming soon"
	}
];
function MarketRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketPage, {}) });
}
function MarketPage() {
	const [eligible, setEligible] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		getDashboard().then((d) => setEligible(d.wallet.availableKobo)).catch(() => setEligible(0));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Later phase",
			title: "Wholesale market"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "bg-leaf",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Designed, not live"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-moss",
					children: "Eligible released savings can later pay for wholesale goods. Nothing here moves customer funds into Faddahy’s operating account. The marketplace needs suppliers, stock, and a licensed payment rail first."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm",
					children: ["Available for a future purchase: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						kobo: eligible,
						size: "sm"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 space-y-3",
			children: SAMPLE.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "opacity-80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs capitalize text-moss",
							children: item.unit
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "warn",
							children: item.note
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						kobo: item.price,
						className: "mt-2 block"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: true,
						className: "mt-3 h-11 w-full rounded-md bg-paper text-sm font-semibold text-sage",
						children: "Not for sale yet"
					})
				]
			}, item.name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/home",
			className: "mt-6 block text-center text-sm font-semibold text-forest",
			children: "Back to savings"
		})
	] }) });
}
//#endregion
export { MarketRoute as component };
