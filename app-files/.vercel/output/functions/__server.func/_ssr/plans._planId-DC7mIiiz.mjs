import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PRODUCTS } from "./products-tSkkRJsj.mjs";
import { a as formatLongDate, o as formatShortDate, t as FREQUENCY_LABEL } from "./dates-B8MbA26_.mjs";
import { t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { a as ErrorText, c as Money, d as ProgressBar, f as Screen, n as Button, o as Field, r as Card, s as Input, t as Badge, u as PinPad } from "./ui-CM96oOa_.mjs";
import { r as parseNairaInput, t as formatNaira } from "./money-BB1B04Xn.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
import { r as Route$2 } from "./router-0tI-dEZR.mjs";
import { l as withdrawFromPlan, o as getPlan, t as contributeToPlan } from "./plans-Bq-w_90J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans._planId-DC7mIiiz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlanRoute() {
	const { planId } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanPage, { id: Number(planId) }) });
}
function PlanPage({ id }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [action, setAction] = (0, import_react.useState)(null);
	function reload() {
		getPlan({ data: { id } }).then(setData).catch((err) => setError(err instanceof Error ? err.message : "Could not load this plan."));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, [id]);
	if (error && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: error
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/plans",
		className: "mt-3 text-sm font-semibold text-forest",
		children: "Back to plans"
	})] }) });
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-moss",
		children: "Loading plan…"
	}) }) });
	const { plan, schedule, ledger, wallet } = data;
	const product = PRODUCTS[plan.productType];
	const pct = plan.targetKobo && plan.targetKobo > 0 ? Math.min(100, plan.savedKobo / plan.targetKobo * 100) : 0;
	const completed = schedule.filter((s) => s.status === "completed" || s.status === "released").length;
	const missed = schedule.filter((s) => s.status === "missed").length;
	const pending = schedule.filter((s) => s.status === "pending");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-[0.16em] text-moss",
			children: product.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: plan.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: plan.unlockEligible ? "good" : "neutral",
				children: plan.status
			}), plan.frequency ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: FREQUENCY_LABEL[plan.frequency] }) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-moss",
							children: "In this plan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { kobo: plan.restrictedKobo + plan.availableKobo })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-moss",
							children: "Saved"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { kobo: plan.savedKobo })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-moss",
							children: "Released"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { kobo: plan.availableKobo })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-moss",
							children: "Still held"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { kobo: plan.restrictedKobo })] })
					]
				}),
				plan.targetKobo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-xs text-moss",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							formatNaira(plan.savedKobo),
							" of ",
							formatNaira(plan.targetKobo)
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, { value: pct })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-moss",
					children: plan.unlockReason
				}),
				plan.startDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-sage",
					children: [formatLongDate(plan.startDate), plan.endDate || plan.maturityDate ? ` → ${formatLongDate(plan.endDate ?? plan.maturityDate ?? "")}` : ""]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-2 gap-2",
			children: [plan.productType === "adashi" || plan.productType === "my_savings" || plan.productType === "locked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "w-full",
				onClick: () => setAction("contribute"),
				disabled: plan.status === "withdrawn" || plan.status === "cancelled",
				children: "Contribute"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "w-full",
				onClick: () => setAction("withdraw"),
				disabled: plan.availableKobo <= 0,
				children: "Take allowance"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => setAction("withdraw"),
				disabled: !plan.unlockEligible && plan.productType !== "my_savings" && plan.productType !== "allowance",
				children: plan.productType === "allowance" ? "Withdraw released" : "Withdraw"
			})]
		}),
		plan.productType === "allowance" && plan.status === "active" && plan.restrictedKobo > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-3 w-full text-sm text-danger underline-offset-4 hover:underline",
			onClick: () => setAction("break"),
			children: "Break plan early"
		}) : null,
		action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanAction, {
			kind: action,
			plan,
			wallet,
			onClose: () => setAction(null),
			onDone: () => {
				setAction(null);
				reload();
			}
		}) : null,
		schedule.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Calendar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-moss",
					children: [
						completed,
						" done · ",
						missed,
						" missed · ",
						pending.length,
						" outstanding"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-7 gap-1",
					children: schedule.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						title: `${item.dueDate} · ${item.status} · ${formatNaira(item.amountKobo)}`,
						className: item.status === "completed" || item.status === "released" ? "rounded-sm bg-forest p-1.5" : item.status === "missed" ? "rounded-sm bg-danger/80 p-1.5" : item.status === "skipped" ? "rounded-sm bg-line p-1.5" : "rounded-sm bg-cream p-1.5 shadow-[var(--shadow-card)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-center text-[10px] font-semibold ${item.status === "completed" || item.status === "released" || item.status === "missed" ? "text-cream" : "text-moss"}`,
							children: item.dueDate.slice(8)
						})
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]",
					children: schedule.slice(0, 12).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: formatShortDate(item.dueDate)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs capitalize text-moss",
							children: item.status
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							kobo: item.amountKobo,
							size: "sm"
						})]
					}, `row-${item.id}`))
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: "Plan ledger"
			}), ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-moss",
				children: "No movements on this plan yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]",
				children: ledger.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: row.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							kobo: row.amountKobo,
							size: "sm",
							className: row.amountKobo < 0 ? "text-danger" : "text-forest"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] text-sage",
						children: row.reference
					})]
				}, row.id))
			})]
		})
	] }) });
}
function PlanAction({ kind, plan, wallet, onClose, onDone }) {
	const defaultNaira = kind === "contribute" ? String((plan.contributionKobo ?? 0) / 100 || 1e3) : kind === "break" ? String(plan.restrictedKobo / 100) : String(Math.max(0, (plan.productType === "allowance" ? plan.availableKobo : plan.restrictedKobo + plan.availableKobo) / 100));
	const [amount, setAmount] = (0, import_react.useState)(defaultNaira);
	const [pin, setPin] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit() {
		setBusy(true);
		setError(null);
		try {
			if (kind === "contribute") await contributeToPlan({ data: {
				planId: plan.id,
				naira: parseNairaInput(amount),
				pin
			} });
			else await withdrawFromPlan({ data: {
				planId: plan.id,
				naira: parseNairaInput(amount) || 1,
				pin,
				earlyBreak: kind === "break"
			} });
			onDone();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not complete this.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold",
					children: kind === "contribute" ? "Contribute" : kind === "break" ? "Early break" : "Withdraw"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-moss",
					onClick: onClose,
					children: "Close"
				})]
			}),
			kind === "contribute" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-moss",
				children: [
					"Taken from available wallet (",
					formatNaira(wallet.availableKobo),
					"). Deposit first if you need more."
				]
			}) : null,
			kind === "break" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-danger",
				children: [plan.earlyBreakPct, "% of the remaining restricted balance will be forfeited. This is recorded as a fee, not taken from another customer."]
			}) : null,
			kind !== "break" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Amount (naira)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					inputMode: "numeric"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinPad, {
				value: pin,
				onChange: setPin
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				variant: kind === "break" ? "danger" : "primary",
				disabled: busy || pin.length < 4,
				onClick: submit,
				children: busy ? "Working…" : "Confirm"
			})
		]
	});
}
//#endregion
export { PlanRoute as component };
