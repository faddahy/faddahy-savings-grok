import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, Q as require_react, S as Navigate, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as FaddahyMark } from "./mark-tmzZWDJ_.mjs";
import { r as completeOnboarding, t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { a as ErrorText, f as Screen, n as Button, o as Field, s as Input, u as PinPad } from "./ui-CM96oOa_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-DHK9leLO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnboardingRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, {
		requireOnboarded: false,
		children: (profile) => profile.onboarded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/home" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {})
	});
}
function Onboarding() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function finish() {
		if (pin !== confirm) {
			setError("PINs do not match.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await completeOnboarding({ data: {
				displayName,
				phone,
				pin
			} });
			navigate({ to: "/home" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not finish setup.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		className: "pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaddahyMark, { className: "mb-6 h-10 w-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.16em] text-moss",
				children: [
					"Step ",
					step,
					" of 2"
				]
			}),
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl font-semibold",
					children: "Who is saving?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-moss",
					children: "We use your name and Nigerian number on receipts and reminders."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						setError(null);
						if (displayName.trim().length < 2) {
							setError("Enter your name.");
							return;
						}
						setStep(2);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value),
								autoComplete: "name",
								placeholder: "e.g. Amina Bello"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nigerian mobile",
							hint: "080, 081, 090, 091 or +234.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								inputMode: "tel",
								autoComplete: "tel",
								placeholder: "0803 000 0000"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "Continue"
						})
					]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl font-semibold",
					children: "Set a 4-digit PIN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-moss",
					children: "Withdrawals, locks, and allowance plans need this PIN. It is stored as a hash, never as the digits."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinPad, {
							value: pin.length < 4 ? pin : confirm,
							onChange: (next) => {
								setError(null);
								if (pin.length < 4) setPin(next);
								else setConfirm(next);
							},
							label: pin.length < 4 ? "Choose a PIN" : "Type it again"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							disabled: busy || confirm.length < 4,
							onClick: finish,
							children: busy ? "Saving…" : "Enter Faddahy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-full text-sm text-moss",
							onClick: () => {
								setStep(1);
								setPin("");
								setConfirm("");
							},
							children: "Back"
						})
					]
				})
			] })
		]
	});
}
//#endregion
export { OnboardingRoute as component };
