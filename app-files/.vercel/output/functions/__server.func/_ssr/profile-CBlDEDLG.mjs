import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getStaffContext, t as claimAdmin } from "./admin-B5HIen-N.mjs";
import { a as UserButton } from "./mark-tmzZWDJ_.mjs";
import { c as submitKyc, l as updateProfile, n as changePin, t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { a as ErrorText, f as Screen, l as PageTitle, n as Button, o as Field, r as Card, s as Input, t as Badge, u as PinPad } from "./ui-CM96oOa_.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CBlDEDLG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfileRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: (profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, { initial: profile }) });
}
function ProfilePage({ initial }) {
	const [profile, setProfile] = (0, import_react.useState)(initial);
	const [name, setName] = (0, import_react.useState)(initial.displayName);
	const [phone, setPhone] = (0, import_react.useState)(initial.phone ?? "");
	const [fullName, setFullName] = (0, import_react.useState)(initial.kycFullName ?? "");
	const [nin, setNin] = (0, import_react.useState)("");
	const [bvn, setBvn] = (0, import_react.useState)("");
	const [currentPin, setCurrentPin] = (0, import_react.useState)("");
	const [nextPin, setNextPin] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [staff, setStaff] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getStaffContext().then((s) => setStaff({
			adminExists: s.adminExists,
			role: s.profile.role
		})).catch(() => setStaff(null));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Account",
			title: "Profile",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: profile.displayName || "Saver"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-moss",
					children: profile.phone ?? "No phone yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: profile.kycStatus === "verified" ? "good" : profile.kycStatus === "pending" ? "warn" : "neutral",
							children: ["KYC ", profile.kycStatus]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: profile.accountStatus }),
						profile.role !== "customer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "forest",
							children: profile.role
						}) : null
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				setError(null);
				try {
					const next = await updateProfile({ data: {
						displayName: name,
						phone
					} });
					setProfile(next);
					setMessage("Profile saved.");
				} catch (err) {
					setError(err instanceof Error ? err.message : "Could not save.");
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						inputMode: "tel"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					children: "Save details"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-xl font-semibold",
			children: "Identity (KYC)"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-moss",
			children: "A licensed partner will require NIN and BVN before live naira limits. We store only the last four digits."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				setError(null);
				try {
					await submitKyc({ data: {
						fullName,
						nin,
						bvn
					} });
					setMessage("KYC submitted for review.");
					setProfile({
						...profile,
						kycStatus: "pending"
					});
				} catch (err) {
					setError(err instanceof Error ? err.message : "Could not submit KYC.");
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name on ID",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: fullName,
						onChange: (e) => setFullName(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "NIN (11 digits)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: nin,
						onChange: (e) => setNin(e.target.value),
						inputMode: "numeric",
						maxLength: 11
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "BVN (11 digits)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: bvn,
						onChange: (e) => setBvn(e.target.value),
						inputMode: "numeric",
						maxLength: 11
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "secondary",
					className: "w-full",
					children: "Submit for review"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-xl font-semibold",
			children: "Change PIN"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinPad, {
				value: currentPin.length < 4 ? currentPin : nextPin,
				onChange: (v) => currentPin.length < 4 ? setCurrentPin(v) : setNextPin(v),
				label: currentPin.length < 4 ? "Current PIN" : "New PIN"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				variant: "secondary",
				disabled: nextPin.length < 4,
				onClick: async () => {
					setError(null);
					try {
						await changePin({ data: {
							currentPin,
							nextPin
						} });
						setCurrentPin("");
						setNextPin("");
						setMessage("PIN updated.");
					} catch (err) {
						setError(err instanceof Error ? err.message : "Could not change PIN.");
					}
				},
				children: "Update PIN"
			})]
		}),
		staff && !staff.adminExists ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "First staff account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-moss",
					children: "No administrator exists yet. Claiming the desk lets you review KYC, configure product rules, and read the ledger. It does not let you spend customer funds."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					onClick: async () => {
						try {
							await claimAdmin();
							setStaff({
								adminExists: true,
								role: "admin"
							});
							setMessage("You are now the administrator.");
						} catch (err) {
							setError(err instanceof Error ? err.message : "Could not claim admin.");
						}
					},
					children: "Claim admin desk"
				})
			]
		}) : null,
		staff && (staff.role === "admin" || staff.role === "finance" || staff.role === "support") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin",
			className: "mt-6 block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				children: "Open staff desk"
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/support",
			className: "mt-4 block text-center text-sm font-semibold text-forest",
			children: "Help and product rules"
		}),
		message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-forest",
			children: message
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error })
	] }) });
}
//#endregion
export { ProfileRoute as component };
