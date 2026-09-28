import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-CM96oOa_.js
var import_jsx_runtime = require_jsx_runtime();
function Button({ variant = "primary", className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold tracking-tight transition-[transform,background-color,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50", variant === "primary" && "bg-forest text-cream hover:bg-forest-deep", variant === "forest" && "bg-ink text-cream hover:bg-forest-deep", variant === "secondary" && "bg-cream text-ink shadow-[var(--shadow-card)] hover:bg-leaf", variant === "ghost" && "bg-transparent text-ink hover:bg-leaf", variant === "danger" && "bg-danger text-cream hover:opacity-90", className),
		...props,
		children
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-ink",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-moss",
				children: hint
			}) : null
		]
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-line bg-cream px-3 text-base text-ink outline-none transition-shadow duration-150 placeholder:text-sage focus:border-forest focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-forest)_18%,transparent)]", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-md border border-line bg-cream px-3 py-2 text-base text-ink outline-none transition-shadow duration-150 placeholder:text-sage focus:border-forest focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-forest)_18%,transparent)]", className),
		...props
	});
}
function Card({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-cream p-4 shadow-[var(--shadow-card)]", className),
		children
	});
}
function Badge({ tone = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase", tone === "neutral" && "bg-paper text-moss", tone === "good" && "bg-leaf text-forest-deep", tone === "warn" && "bg-warn-soft text-warn", tone === "bad" && "bg-danger-soft text-danger", tone === "forest" && "bg-forest text-cream"),
		children
	});
}
function Screen({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-28 pt-4", className),
		children
	});
}
function PageTitle({ kicker, title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5 flex items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-moss",
			children: kicker
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-[1.75rem] font-semibold text-ink",
			children: title
		})] }), action]
	});
}
function Money({ kobo, className, size = "md" }) {
	const naira = (kobo || 0) / 100;
	const formatted = new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: naira % 1 === 0 ? 0 : 2
	}).format(naira);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("tabular-nums tracking-tight", size === "sm" && "text-sm font-semibold", size === "md" && "text-lg font-semibold", size === "lg" && "font-display text-3xl font-semibold", className),
		children: formatted
	});
}
function ProgressBar({ value, className }) {
	const pct = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-2 overflow-hidden rounded-full bg-paper", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-forest transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
			style: { width: `${pct}%` }
		})
	});
}
function PinPad({ value, onChange, label = "Enter your 4-digit PIN" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-moss",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center gap-2",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-3.5 w-3.5 rounded-full border border-line-strong", value.length > i ? "bg-forest border-forest" : "bg-transparent") }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"",
					"0",
					"⌫"
				].map((key, i) => key === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex h-14 items-center justify-center rounded-lg bg-cream text-lg font-semibold shadow-[var(--shadow-card)] active:scale-[0.98]",
					onClick: () => {
						if (key === "⌫") onChange(value.slice(0, -1));
						else if (value.length < 4) onChange(value + key);
					},
					children: key
				}, key))
			})
		]
	});
}
function Empty({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-col items-start gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: body
			}),
			action
		]
	});
}
function ErrorText({ children }) {
	if (!children) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children
	});
}
//#endregion
export { ErrorText as a, Money as c, ProgressBar as d, Screen as f, Empty as i, PageTitle as l, Button as n, Field as o, Textarea as p, Card as r, Input as s, Badge as t, PinPad as u };
