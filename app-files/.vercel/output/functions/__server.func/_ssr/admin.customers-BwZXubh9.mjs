import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as listCustomers, f as setCustomerStatus } from "./admin-B5HIen-N.mjs";
import { c as Money, n as Button, r as Card, t as Badge } from "./ui-CM96oOa_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers-BwZXubh9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Customers() {
	const [rows, setRows] = (0, import_react.useState)([]);
	function reload() {
		listCustomers().then(setRows).catch(() => setRows([]));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-4 font-display text-3xl font-semibold",
		children: "Customers"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: c.displayName || "Unnamed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-moss",
						children: c.phone ?? "No phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.role }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: c.kycStatus === "verified" ? "good" : "neutral",
								children: ["KYC ", c.kycStatus]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: c.accountStatus === "active" ? "good" : "bad",
								children: c.accountStatus
							})
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Available ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						kobo: c.availableKobo,
						size: "sm"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Restricted ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						kobo: c.restrictedKobo,
						size: "sm"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						"active",
						"restricted",
						"suspended"
					].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: status === "active" ? "secondary" : status === "suspended" ? "danger" : "ghost",
						className: "h-9 px-3 text-xs",
						onClick: async () => {
							await setCustomerStatus({ data: {
								userId: c.userId,
								accountStatus: status
							} });
							reload();
						},
						children: status
					}, status))
				})
			]
		}, c.userId))
	})] });
}
//#endregion
export { Customers as component };
