import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { i as formatDateTime } from "./dates-B8MbA26_.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as SessionGate } from "./guard-B5qBpRBr.mjs";
import { a as ErrorText, c as Money, f as Screen, l as PageTitle, n as Button, o as Field, r as Card, s as Input, t as Badge, u as PinPad } from "./ui-CM96oOa_.mjs";
import { r as parseNairaInput, t as formatNaira } from "./money-BB1B04Xn.mjs";
import { t as AppShell } from "./shell-lwDKJk11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-K9Zsoqcg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getWalletOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fa762d29503fb463301f4e2c1ebd53e28dfdcd31b9a4b397c47bf56c8d0ae82a"));
var createDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const naira = Number(data.naira);
	if (!Number.isFinite(naira) || naira <= 0) throw new Error("Enter an amount to deposit.");
	return { naira };
}).handler(createSsrRpc("234b7fd659d1279a9175056c5db0bb57536b8b59d24f0286ed417dcc66da745f"));
var confirmSandboxDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const reference = data.reference.trim();
	if (!reference) throw new Error("Missing payment reference.");
	return { reference };
}).handler(createSsrRpc("9933744accbee53b80e6c11ef7515288d945f5ce8650435f133197cc4264a88d"));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const naira = Number(data.naira);
	if (!Number.isFinite(naira) || naira <= 0) throw new Error("Enter an amount to withdraw.");
	const bank = data.bank.trim();
	const accountNumber = data.accountNumber.replace(/\s+/g, "");
	const accountName = data.accountName.trim();
	if (bank.length < 2) throw new Error("Choose a bank.");
	if (!/^\d{10}$/.test(accountNumber)) throw new Error("Account number must be 10 digits.");
	if (accountName.length < 2) throw new Error("Enter the account name.");
	return {
		naira,
		pin: data.pin,
		bank,
		accountNumber,
		accountName
	};
}).handler(createSsrRpc("cd35374d0dbd2ffe2e38a238472739b02a4a9c7737677c51e12934b507040a2d"));
function WalletRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletPage, {}) });
}
function WalletPage() {
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	function reload() {
		getWalletOverview().then(setData).catch((err) => setError(err instanceof Error ? err.message : "Could not load wallet."));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Money",
			title: "Wallet"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "bg-forest-deep text-cream",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.16em] text-cream/70",
					children: "Available"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					kobo: data?.availableKobo ?? 0,
					size: "lg",
					className: "text-cream"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-cream/80",
					children: [
						"Restricted ",
						formatNaira(data?.restrictedKobo ?? 0),
						" stays in plans until a rule releases it."
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setTab("deposit"),
				children: "Deposit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => setTab("withdraw"),
				children: "Withdraw"
			})]
		}),
		data?.walletSettings.sandbox ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-moss",
			children: "Sandbox rail — deposits are verified server-side and credited once per unique reference. Live naira needs a licensed Nigerian partner."
		}) : null,
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-danger",
			children: error
		}) : null,
		tab === "deposit" && data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositForm, {
			settings: data.walletSettings,
			onDone: () => {
				setTab("overview");
				reload();
			}
		}) : null,
		tab === "withdraw" && data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WithdrawForm, {
			available: data.availableKobo,
			settings: data.walletSettings,
			onDone: () => {
				setTab("overview");
				reload();
			}
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-xl font-semibold",
			children: "Payments"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]",
			children: data?.payments.length ? data.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold capitalize",
					children: [
						p.kind,
						" · ",
						formatNaira(p.amountKobo)
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-sage",
					children: p.reference
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: p.status === "succeeded" ? "good" : p.status === "failed" ? "bad" : "warn",
					children: p.status
				})]
			}, p.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-3 text-sm text-moss",
				children: "No payments yet."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-xl font-semibold",
			children: "Ledger"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 divide-y divide-line rounded-xl bg-cream shadow-[var(--shadow-card)]",
			children: data?.ledger.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: row.description
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						kobo: row.amountKobo,
						size: "sm",
						className: row.amountKobo < 0 ? "text-danger" : "text-forest"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-sage",
					children: [
						formatDateTime(row.createdAt),
						" · ",
						row.reference
					]
				})]
			}, row.id))
		})
	] }) });
}
function DepositForm({ settings, onDone }) {
	const [amount, setAmount] = (0, import_react.useState)("5000");
	const [intent, setIntent] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function start() {
		setBusy(true);
		setError(null);
		try {
			const row = await createDeposit({ data: { naira: parseNairaInput(amount) } });
			setIntent(row);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not start deposit.");
		} finally {
			setBusy(false);
		}
	}
	async function confirm() {
		if (!intent) return;
		setBusy(true);
		setError(null);
		try {
			await confirmSandboxDeposit({ data: { reference: intent.reference } });
			onDone();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not confirm.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-lg font-semibold",
			children: "Sandbox deposit"
		}), !intent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Amount",
				hint: `Between ₦${settings.minDepositNaira.toLocaleString("en-NG")} and ₦${settings.maxDepositNaira.toLocaleString("en-NG")}.`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy,
				onClick: start,
				children: busy ? "Creating reference…" : "Get payment reference"
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: "Transfer is simulated. The ledger will not move until this reference is verified on the server. Confirming twice will not credit twice."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md bg-leaf px-3 py-2 font-mono text-sm",
				children: intent.reference
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: ["Amount ", formatNaira(intent.amountKobo)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy,
				onClick: confirm,
				children: busy ? "Verifying…" : "I have sent the transfer"
			})
		] })]
	});
}
function WithdrawForm({ available, settings, onDone }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [bank, setBank] = (0, import_react.useState)("GTBank");
	const [accountNumber, setAccountNumber] = (0, import_react.useState)("");
	const [accountName, setAccountName] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit() {
		setBusy(true);
		setError(null);
		try {
			await requestWithdrawal({ data: {
				naira: parseNairaInput(amount),
				pin,
				bank,
				accountNumber,
				accountName
			} });
			onDone();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not withdraw.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg font-semibold",
				children: "Withdraw available funds"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-moss",
				children: [
					"Only available money can leave. Restricted plan balances stay until their rule says otherwise. Available",
					" ",
					formatNaira(available),
					". Min ₦",
					settings.minWithdrawalNaira.toLocaleString("en-NG"),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Amount",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					inputMode: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Bank",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: bank,
					onChange: (e) => setBank(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Account number",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: accountNumber,
					onChange: (e) => setAccountNumber(e.target.value),
					inputMode: "numeric",
					maxLength: 10
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Account name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: accountName,
					onChange: (e) => setAccountName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinPad, {
				value: pin,
				onChange: setPin
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorText, { children: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy || pin.length < 4,
				onClick: submit,
				children: busy ? "Sending…" : "Request withdrawal"
			})
		]
	});
}
//#endregion
export { WalletRoute as component };
