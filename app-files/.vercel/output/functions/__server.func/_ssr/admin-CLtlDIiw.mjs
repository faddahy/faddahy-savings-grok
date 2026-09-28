import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, S as Navigate, T as require_jsx_runtime, _ as Outlet, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { i as getStaffContext } from "./admin-B5HIen-N.mjs";
import { t as FaddahyMark } from "./mark-tmzZWDJ_.mjs";
import { t as SessionGate } from "./guard-B5qBpRBr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CLtlDIiw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/admin",
		label: "Overview",
		exact: true
	},
	{
		to: "/admin/customers",
		label: "Customers"
	},
	{
		to: "/admin/plans",
		label: "Plans"
	},
	{
		to: "/admin/ledger",
		label: "Ledger"
	},
	{
		to: "/admin/settings",
		label: "Settings"
	}
];
function AdminLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {}) });
}
function Gate() {
	const [ok, setOk] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getStaffContext().then((s) => setOk([
			"admin",
			"finance",
			"support"
		].includes(s.profile.role))).catch(() => setOk(false));
	}, []);
	if (ok === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8 text-sm text-moss",
		children: "Checking staff access…"
	});
	if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/profile" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {});
}
function AdminShell() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-line bg-cream px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/home",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaddahyMark, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold",
						children: "Staff desk"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/home",
					className: "text-sm text-moss",
					children: "Back to app"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto mt-3 flex max-w-5xl gap-1 overflow-x-auto",
				children: LINKS.map((l) => {
					const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: cn("whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold", active ? "bg-forest text-cream" : "text-moss"),
						children: l.label
					}, l.to);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };
