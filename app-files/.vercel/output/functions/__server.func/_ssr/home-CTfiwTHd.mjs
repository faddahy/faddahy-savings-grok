import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PRODUCTS } from "./products-tSkkRJsj.mjs";
import { o as formatShortDate } from "./dates-B8MbA26_.mjs";
import { i as getDashboard, t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { c as Money, d as ProgressBar, f as Screen, i as Empty, r as Card, t as Badge } from "./ui-CM96oOa_.mjs";
import { t as formatNaira } from "./money-BB1B04Xn.mjs";
import { d as CalendarDays, i as Target, o as Plus, s as Lock, t as Wallet, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-CTfiwTHd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	adashi: CalendarDays,
	my_savings: Target,
	locked: Lock,
	allowance: Wallet
};
function HomeRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: (profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home$1, { name: profile.displayName }) });
}
function Home$1({ name }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getDashboard().then(setData).catch((err) => setError(err instanceof Error ? err.message : "Could not load."));
	}, []);
	const first = name.split(" ")[0] || "there";
	const total = (data?.wallet.availableKobo ?? 0) + (data?.wallet.restrictedKobo ?? 0);
	const active = data?.plans.filter((p) => p.status === "active" || p.status === "matured" || p.status === "unlocked") ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		unread: data?.unreadCount ?? 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: "Good to see you,"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: first
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-5 bg-forest-deep p-5 text-cream",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.16em] text-cream/70",
						children: "Total savings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						kobo: total,
						size: "lg",
						className: "mt-1 block text-cream"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-cream/70",
							children: "Available"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							kobo: data?.wallet.availableKobo ?? 0,
							size: "sm",
							className: "text-cream"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-cream/70",
							children: "Restricted"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							kobo: data?.wallet.restrictedKobo ?? 0,
							size: "sm",
							className: "text-cream"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wallet",
							className: "rounded-md bg-cream px-3 py-2 text-sm font-semibold text-forest-deep",
							children: "Deposit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/plans",
							className: "rounded-md border border-cream/30 px-3 py-2 text-sm font-semibold text-cream",
							children: "New plan"
						})]
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				children: error
			}) : null,
			data?.announcements[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.14em] text-moss",
						children: "From Faddahy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-semibold",
						children: data.announcements[0].title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-moss",
						children: data.announcements[0].body
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/plans",
						className: "text-sm font-semibold text-forest",
						children: "See all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: Object.values(PRODUCTS).map((p) => {
						const Icon = ICONS[p.slug];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/plans/new/$product",
							params: { product: p.slug },
							className: "rounded-xl bg-cream p-4 shadow-[var(--shadow-card)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-sm bg-leaf text-forest",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-lg font-semibold leading-tight",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-moss",
									children: p.short
								})
							]
						}, p.slug);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold",
					children: "Active plans"
				}), active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "No plan yet",
					body: "Start with Adashi if you want a 30-day habit, or My Savings if you have a goal.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/plans",
						className: "mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Open a plan"]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: active.slice(0, 4).map((plan) => {
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
										tone: plan.unlockEligible ? "good" : "neutral",
										children: plan.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-baseline justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
										kobo: plan.savedKobo || plan.restrictedKobo,
										size: "sm"
									}), plan.targetKobo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-moss",
										children: ["of ", formatNaira(plan.targetKobo)]
									}) : null]
								}),
								plan.targetKobo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
									className: "mt-2",
									value: pct
								}) : null
							] })
						}, plan.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold",
					children: "Coming up"
				}), data?.upcoming.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "divide-y divide-line p-0",
					children: data.upcoming.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: item.planTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-moss",
							children: [
								item.kind === "allowance" ? "Allowance" : "Contribution",
								" · ",
								formatShortDate(item.dueDate)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							kobo: item.amountKobo,
							size: "sm"
						})]
					}, item.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-moss",
					children: "No upcoming dates yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Recent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wallet",
						className: "text-sm font-semibold text-forest",
						children: "Ledger"
					})]
				}), data?.recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "divide-y divide-line p-0",
					children: data.recent.slice(0, 5).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: row.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] text-sage",
								children: row.reference
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							kobo: row.amountKobo,
							size: "sm",
							className: row.amountKobo < 0 ? "text-danger" : "text-forest"
						})]
					}, row.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-moss",
					children: "No movements yet. Deposit to begin."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/support",
				className: "mt-8 flex items-center justify-between rounded-xl bg-cream px-4 py-3 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold",
					children: "Help and product rules"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-moss" })]
			})
		] })
	});
}
//#endregion
export { HomeRoute as component };
