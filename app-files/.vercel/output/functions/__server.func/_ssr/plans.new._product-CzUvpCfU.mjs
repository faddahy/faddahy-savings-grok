import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as lockedTerms, i as allowanceTerms, n as PRODUCTS, o as mySavingsTerms, r as adashiTerms } from "./products-tSkkRJsj.mjs";
import { t as FREQUENCY_LABEL } from "./dates-B8MbA26_.mjs";
import { o as getProductSettings, t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { a as ErrorText, f as Screen, l as PageTitle, n as Button, o as Field, r as Card, s as Input, u as PinPad } from "./ui-CM96oOa_.mjs";
import { n as nairaToKobo, r as parseNairaInput, t as formatNaira } from "./money-BB1B04Xn.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
import { n as Route } from "./router-0tI-dEZR.mjs";
import { a as createMySavings, c as previewContribution, i as createLocked, n as createAdashi, r as createAllowance } from "./plans-Bq-w_90J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans.new._product-CzUvpCfU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewPlanRoute() {
	const { product } = Route.useParams();
	const slug = product;
	if (!PRODUCTS[slug]) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Unknown product." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/plans",
		children: "Back"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wizard, { slug }) });
}
function Wizard({ slug }) {
	const [settings, setSettings] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getProductSettings().then(setSettings).catch(() => setSettings(null));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "New plan",
			title: PRODUCTS[slug].name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 text-sm text-moss",
			children: PRODUCTS[slug].blurb
		}),
		!settings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-moss",
			children: "Loading terms…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, {
			slug,
			settings
		})
	] }) });
}
function Form({ slug, settings }) {
	if (slug === "adashi") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdashiForm, { settings });
	if (slug === "my_savings") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MySavingsForm, { settings });
	if (slug === "locked") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockedForm, { settings });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllowanceForm, { settings });
}
function Terms({ lines, accepted, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.14em] text-moss",
				children: "Read this first"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "list-decimal space-y-2 pl-4 text-sm text-moss",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-1 h-4 w-4 accent-forest",
					checked: accepted,
					onChange: (e) => onChange(e.target.checked)
				}), "I have read these terms and I agree."]
			})
		]
	});
}
function AdashiForm({ settings }) {
	const navigate = useNavigate();
	const s = settings.adashi;
	const [amount, setAmount] = (0, import_react.useState)(String(s.suggestedNaira[2] ?? 1e3));
	const [frequency, setFrequency] = (0, import_react.useState)("daily");
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const naira = parseNairaInput(amount);
	async function submit() {
		setBusy(true);
		setError(null);
		try {
			const res = await createAdashi({ data: {
				contributionNaira: naira,
				frequency,
				accepted
			} });
			navigate({
				to: "/plans/$planId",
				params: { planId: String(res.id) }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open Adashi.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "How much each time?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: s.suggestedNaira.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setAmount(String(n)),
					className: "rounded-full bg-cream px-3 py-1.5 text-sm shadow-[var(--shadow-card)]",
					children: formatNaira(nairaToKobo(n))
				}, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Schedule",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: s.frequencies.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFrequency(f),
						className: `h-11 rounded-md text-sm font-semibold ${frequency === f ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`,
						children: FREQUENCY_LABEL[f]
					}, f))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: "30-day personal cycle. Your payout never waits on another customer."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm",
				children: [
					"If you keep this up: about ",
					formatNaira(nairaToKobo(naira) * (frequency === "daily" ? 30 : 5)),
					" over the cycle, before any missed-contribution penalty or payout fee."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terms, {
				lines: adashiTerms(s),
				accepted,
				onChange: setAccepted
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy || !accepted,
				onClick: submit,
				children: busy ? "Opening…" : "Start Adashi"
			})
		]
	});
}
function MySavingsForm({ settings }) {
	const navigate = useNavigate();
	const s = settings.my_savings;
	const [title, setTitle] = (0, import_react.useState)("Shop restock");
	const [goal, setGoal] = (0, import_react.useState)("100000");
	const [days, setDays] = (0, import_react.useState)("60");
	const [frequency, setFrequency] = (0, import_react.useState)("daily");
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const goalNaira = parseNairaInput(goal);
	const durationDays = Number(days) || 0;
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => {
			previewContribution({ data: {
				goalNaira,
				durationDays,
				frequency
			} }).then(setPreview).catch(() => setPreview(null));
		}, 200);
		return () => window.clearTimeout(t);
	}, [
		goalNaira,
		durationDays,
		frequency
	]);
	async function submit() {
		setBusy(true);
		setError(null);
		try {
			const res = await createMySavings({ data: {
				title,
				goalNaira,
				durationDays,
				frequency,
				accepted
			} });
			navigate({
				to: "/plans/$planId",
				params: { planId: String(res.id) }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create the goal.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "What is this for?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Target amount",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: goal,
					onChange: (e) => setGoal(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Duration (days)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: days,
					onChange: (e) => setDays(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "How often will you save?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: s.frequencies.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFrequency(f),
						className: `h-11 rounded-md text-xs font-semibold ${frequency === f ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`,
						children: FREQUENCY_LABEL[f]
					}, f))
				})
			}),
			preview && preview.contributionKobo > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "bg-leaf",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.14em] text-forest-deep",
						children: "Suggested contribution"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl font-semibold",
						children: formatNaira(preview.contributionKobo)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-moss",
						children: [
							preview.periods,
							" payments · ends ",
							preview.endDate
						]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terms, {
				lines: mySavingsTerms(s),
				accepted,
				onChange: setAccepted
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy || !accepted,
				onClick: submit,
				children: busy ? "Creating…" : "Create goal"
			})
		]
	});
}
function LockedForm({ settings }) {
	const navigate = useNavigate();
	const s = settings.locked;
	const [title, setTitle] = (0, import_react.useState)("Hold for later");
	const [mode, setMode] = (0, import_react.useState)("either");
	const [target, setTarget] = (0, import_react.useState)("50000");
	const [days, setDays] = (0, import_react.useState)("30");
	const [funding, setFunding] = (0, import_react.useState)("10000");
	const [pin, setPin] = (0, import_react.useState)("");
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit() {
		setBusy(true);
		setError(null);
		try {
			const res = await createLocked({ data: {
				title,
				mode,
				targetNaira: mode === "date" || mode === "open" ? void 0 : parseNairaInput(target),
				durationDays: mode === "target" || mode === "open" ? void 0 : Number(days),
				fundingNaira: parseNairaInput(funding),
				pin,
				accepted
			} });
			navigate({
				to: "/plans/$planId",
				params: { planId: String(res.id) }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not lock this amount.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: "Locking moves money from your available wallet into this plan. Deposit first if the wallet is empty."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Unlock rule",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: s.modes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMode(m),
						className: `h-11 rounded-md text-xs font-semibold capitalize ${mode === m ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`,
						children: m
					}, m))
				})
			}),
			mode === "target" || mode === "either" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Target amount",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: target,
					onChange: (e) => setTarget(e.target.value),
					inputMode: "numeric"
				})
			}) : null,
			mode === "date" || mode === "either" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Days until maturity",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: days,
					onChange: (e) => setDays(e.target.value),
					inputMode: "numeric"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Amount to lock now",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: funding,
					onChange: (e) => setFunding(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terms, {
				lines: lockedTerms(s, mode),
				accepted,
				onChange: setAccepted
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinPad, {
				value: pin,
				onChange: setPin,
				label: "Confirm with your PIN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy || !accepted || pin.length < 4,
				onClick: submit,
				children: busy ? "Locking…" : "Lock this money"
			})
		]
	});
}
function AllowanceForm({ settings }) {
	const navigate = useNavigate();
	const s = settings.allowance;
	const [lump, setLump] = (0, import_react.useState)("100000");
	const [allowance, setAllowance] = (0, import_react.useState)("20000");
	const [frequency, setFrequency] = (0, import_react.useState)("weekly");
	const [pct, setPct] = (0, import_react.useState)(s.defaultEarlyBreakPct);
	const [pin, setPin] = (0, import_react.useState)("");
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const lumpNaira = parseNairaInput(lump);
	const allowanceNaira = parseNairaInput(allowance);
	const count = allowanceNaira > 0 ? Math.floor(lumpNaira / allowanceNaira) : 0;
	async function submit() {
		setBusy(true);
		setError(null);
		try {
			const res = await createAllowance({ data: {
				lumpNaira,
				allowanceNaira,
				frequency,
				earlyBreakPct: pct,
				pin,
				accepted
			} });
			navigate({
				to: "/plans/$planId",
				params: { planId: String(res.id) }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open the allowance plan.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: "The lump sum is taken from your available wallet. Deposit first if you need to."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Lump sum",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: lump,
					onChange: (e) => setLump(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Allowance each time",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: allowance,
					onChange: (e) => setAllowance(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Release every",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: s.frequencies.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFrequency(f),
						className: `h-11 rounded-md text-xs font-semibold ${frequency === f ? "bg-forest text-cream" : "bg-cream shadow-[var(--shadow-card)]"}`,
						children: FREQUENCY_LABEL[f]
					}, f))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: `Early-break charge: ${pct}%`,
				hint: "If you break the plan, this share of remaining restricted funds is forfeited.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: s.minEarlyBreakPct,
					max: s.maxEarlyBreakPct,
					value: pct,
					onChange: (e) => setPct(Number(e.target.value)),
					className: "w-full accent-forest"
				})
			}),
			count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "bg-leaf",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						count,
						" releases of ",
						formatNaira(nairaToKobo(allowanceNaira)),
						". Remainder stays restricted until the last date or an early break."
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terms, {
				lines: allowanceTerms(s, pct),
				accepted,
				onChange: setAccepted
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinPad, {
				value: pin,
				onChange: setPin,
				label: "Confirm with your PIN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy || !accepted || pin.length < 4,
				onClick: submit,
				children: busy ? "Opening…" : "Start allowance"
			})
		]
	});
}
//#endregion
export { NewPlanRoute as component };
