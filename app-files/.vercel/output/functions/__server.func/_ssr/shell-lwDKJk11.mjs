import { T as require_jsx_runtime, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { t as FaddahyMark } from "./mark-tmzZWDJ_.mjs";
import { a as Store, c as Layers, f as Bell, l as House, n as UserRound, t as Wallet } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-lwDKJk11.js
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/home",
		label: "Home",
		icon: House
	},
	{
		to: "/plans",
		label: "Plans",
		icon: Layers
	},
	{
		to: "/wallet",
		label: "Wallet",
		icon: Wallet
	},
	{
		to: "/market",
		label: "Market",
		icon: Store
	},
	{
		to: "/profile",
		label: "Me",
		icon: UserRound
	}
];
function AppShell({ children, unread = 0 }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none fixed inset-0 hidden lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 w-[28%] bg-forest-deep" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-12 left-10 max-w-xs text-cream",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaddahyMark, { className: "mb-4 h-10 w-10 text-cream" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-semibold leading-tight",
						children: "Faddahy Savings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-cream/80",
						children: "Simple savings that make sense to the poor."
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto min-h-dvh max-w-lg bg-paper shadow-[var(--shadow-card)] lg:min-h-dvh",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/home",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaddahyMark, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold",
							children: "Faddahy"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/alerts",
						className: "relative grid h-11 w-11 place-items-center rounded-full bg-cream shadow-[var(--shadow-card)]",
						"aria-label": "Notifications",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-2 w-2 rounded-full bg-forest" }) : null]
					})]
				}),
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "fixed bottom-0 left-1/2 z-20 w-full max-w-lg -translate-x-1/2 border-t border-line bg-cream/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-5",
						children: TABS.map((tab) => {
							const active = pathname === tab.to || pathname.startsWith(`${tab.to}/`);
							const Icon = tab.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: tab.to,
								className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-forest" : "text-moss"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-5 w-5",
									strokeWidth: active ? 2.4 : 1.8
								}), tab.label]
							}) }, tab.to);
						})
					})
				})
			]
		})]
	});
}
//#endregion
export { AppShell as t };
