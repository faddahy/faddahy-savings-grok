import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, S as Navigate, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { m as normalizePhone, r as assertPinFormat } from "./helpers-MFPpDcIg.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as RedirectToSignIn, o as useCurrentUserState, t as FaddahyMark } from "./mark-tmzZWDJ_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guard-B5qBpRBr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getSessionProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d962de7f1f4ffe979fc89cf53f0a17189629c5579c5097115c9efbcb649306a6"));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const displayName = data.displayName.trim();
	if (displayName.length < 2) throw new Error("Please enter your name.");
	const phone = normalizePhone(data.phone);
	assertPinFormat(data.pin);
	return {
		displayName,
		phone,
		pin: data.pin
	};
}).handler(createSsrRpc("06d5f26272786f5f782b103b0b735c30a8cdadca1489d8d7af58a79fd9f366e9"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const displayName = data.displayName.trim();
	if (displayName.length < 2) throw new Error("Please enter your name.");
	return {
		displayName,
		phone: normalizePhone(data.phone)
	};
}).handler(createSsrRpc("77e864291e2c19936765b58f5565c065f622ce93e62e20afd3251a438b124fe8"));
var changePin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	assertPinFormat(data.currentPin);
	assertPinFormat(data.nextPin);
	if (data.currentPin === data.nextPin) throw new Error("Choose a new PIN.");
	return data;
}).handler(createSsrRpc("6f9f1ef12cf549ab41ad2ad63c84a1923e227112fdb420703ee2a2536fbf38d2"));
var submitKyc = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const fullName = data.fullName.trim();
	const nin = data.nin.replace(/\s+/g, "");
	const bvn = data.bvn.replace(/\s+/g, "");
	if (fullName.length < 3) throw new Error("Enter the name on your ID.");
	if (!/^\d{11}$/.test(nin)) throw new Error("NIN must be 11 digits.");
	if (!/^\d{11}$/.test(bvn)) throw new Error("BVN must be 11 digits.");
	return {
		fullName,
		nin,
		bvn
	};
}).handler(createSsrRpc("3c2a6c720372a310866a20da7a2784465999a02190833328af06153e8dddc168"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f89251c361405bf24852ad2eefca958b3dbe87c69077cc5f23cebadade21b6b0"));
var getNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cb53c46e062d98a59d6944a9d9e73ecdb9534cf0e8f12f918898a23dcf96b764"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("ad77713ac37bb24f773f4daa6e701d37a25f5af635c9975bd84a796eb619dad9"));
var getProductSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e7b2a50a41cc378221bbad9f1d1898ee1b53156aa2e71c1efe9854450ffb34e5"));
function SessionGate({ children, requireOnboarded = true }) {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setProfile(null);
			return;
		}
		let cancelled = false;
		getSessionProfile().then((p) => {
			if (!cancelled) setProfile(p);
		}).catch((err) => {
			if (!cancelled) setError(err instanceof Error ? err.message : "Could not load your account.");
		});
		return () => {
			cancelled = true;
		};
	}, [user?.id]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			children: error
		})
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, {});
	if (requireOnboarded && !profile.onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: children(profile) });
}
function BootScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaddahyMark, { className: "h-12 w-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: "Loading your savings…"
			})]
		})
	});
}
//#endregion
export { getNotifications as a, submitKyc as c, getDashboard as i, updateProfile as l, changePin as n, getProductSettings as o, completeOnboarding as r, markNotificationsRead as s, SessionGate as t };
