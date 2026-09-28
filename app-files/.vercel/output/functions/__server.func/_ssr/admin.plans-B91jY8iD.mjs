import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PRODUCTS } from "./products-tSkkRJsj.mjs";
import { a as listAdminPlans } from "./admin-B5HIen-N.mjs";
import { c as Money, r as Card, t as Badge } from "./ui-CM96oOa_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.plans-B91jY8iD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPlans() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listAdminPlans().then(setRows).catch(() => setRows([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-4 font-display text-3xl font-semibold",
		children: "Plans"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.14em] text-moss",
					children: PRODUCTS[p.productType].name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: p.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-moss",
					children: p.customerName
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: p.unlockEligible ? "good" : "neutral",
				children: p.status
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap gap-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Saved ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					kobo: p.savedKobo,
					size: "sm"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Held ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					kobo: p.restrictedKobo,
					size: "sm"
				})] }),
				p.targetKobo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Target ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					kobo: p.targetKobo,
					size: "sm"
				})] }) : null
			]
		})] }, p.id))
	})] });
}
//#endregion
export { AdminPlans as component };
