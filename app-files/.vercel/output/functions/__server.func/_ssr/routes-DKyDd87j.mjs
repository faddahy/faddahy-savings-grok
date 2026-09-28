import { S as Navigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PRODUCTS } from "./products-tSkkRJsj.mjs";
import { i as SignedOut, o as useCurrentUserState, r as SignedIn, t as FaddahyMark } from "./mark-tmzZWDJ_.mjs";
import { n as Button, r as Card } from "./ui-CM96oOa_.mjs";
import { d as CalendarDays, i as Target, p as ArrowRight, s as Lock, t as Wallet } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DKyDd87j.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	adashi: CalendarDays,
	my_savings: Target,
	locked: Lock,
	allowance: Wallet
};
function Landing() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return null;
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/home" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-lg px-5 pb-16 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-10 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaddahyMark, { className: "h-9 w-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-semibold",
							children: "Faddahy"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-sm font-semibold text-forest",
						children: "Sign in"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/home",
						className: "text-sm font-semibold text-forest",
						children: "Open app"
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.18em] text-moss",
				children: "Nigeria"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-[2.35rem] font-semibold leading-[1.08]",
				children: "Simple savings that make sense to the poor."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[1.05rem] text-moss",
				children: "Built for market women, traders, artisans, and anyone who earns daily or weekly. Save small, keep it safe, and take it out by the rules you agreed to — not by whoever shouts loudest."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						children: ["Start saving", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-sage",
					children: "No pooled Adashi. Your money is yours."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-12 space-y-3",
				children: Object.values(PRODUCTS).map((p) => {
					const Icon = ICONS[p.slug];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 shrink-0 place-items-center rounded-md bg-leaf text-forest",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.14em] text-moss",
								children: p.short
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-moss",
								children: p.blurb
							})
						] })]
					}, p.slug);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold",
					children: "How your money is kept"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-3 text-sm text-moss",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Every naira is a ledger line with a unique reference." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Locks, maturity, and allowance dates are enforced on the server." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Customer savings are not working capital for wholesale or staff." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A licensed payment partner is required before live naira. This preview uses a verified sandbox rail." })
					]
				})]
			})
		]
	});
}
//#endregion
export { Landing as component };
