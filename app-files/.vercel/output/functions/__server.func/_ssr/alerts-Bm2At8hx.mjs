import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatDateTime } from "./dates-B8MbA26_.mjs";
import { a as getNotifications, s as markNotificationsRead, t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { f as Screen, i as Empty, l as PageTitle, r as Card } from "./ui-CM96oOa_.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-Bm2At8hx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AlertsRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertsPage, {}) });
}
function AlertsPage() {
	const [items, setItems] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getNotifications().then((rows) => {
			setItems(rows);
			markNotificationsRead();
		}).catch(() => setItems([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Inbox",
			title: "Notifications"
		}),
		!items ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-moss",
			children: "Loading…"
		}) : null,
		items && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Quiet for now",
			body: "Reminders, payouts, and staff notes will show up here."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: items?.map((n) => {
				const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: n.readAt ? "opacity-80" : "",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: n.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-moss",
							children: n.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-sage",
							children: formatDateTime(n.createdAt)
						})
					]
				});
				return n.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: n.href,
					children: inner
				}, n.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: inner }, n.id);
			})
		})
	] }) });
}
//#endregion
export { AlertsRoute as component };
