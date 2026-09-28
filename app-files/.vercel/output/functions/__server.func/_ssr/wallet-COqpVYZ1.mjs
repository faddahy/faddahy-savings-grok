import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CRqFoxqS.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { c as makeRef, g as requireActiveAccount, h as notify, i as audit, l as mapLedger, n as assertPin, s as loadSettings, t as applyLedger, u as mapPayment } from "./helpers-MFPpDcIg.mjs";
import { i as pctOf, n as nairaToKobo, t as formatNaira } from "./money-BB1B04Xn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-COqpVYZ1.js
var getWalletOverview_createServerFn_handler = createServerRpc({
	id: "fa762d29503fb463301f4e2c1ebd53e28dfdcd31b9a4b397c47bf56c8d0ae82a",
	name: "getWalletOverview",
	filename: "src/lib/fns/wallet.ts"
}, (opts) => getWalletOverview.__executeServer(opts));
var getWalletOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getWalletOverview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	const [wallet] = await sql`
      select available_kobo, restricted_kobo from wallets where user_id = ${context.userId}
    `;
	const payments = await sql`
      select * from payment_intents where user_id = ${context.userId}
      order by created_at desc limit 20
    `;
	const ledger = await sql`
      select * from ledger_entries where user_id = ${context.userId}
      order by created_at desc limit 40
    `;
	const settings = await loadSettings(sql);
	return {
		availableKobo: Number(wallet?.available_kobo ?? 0),
		restrictedKobo: Number(wallet?.restricted_kobo ?? 0),
		payments: payments.map(mapPayment),
		ledger: ledger.map(mapLedger),
		walletSettings: settings.wallet
	};
});
var createDeposit_createServerFn_handler = createServerRpc({
	id: "234b7fd659d1279a9175056c5db0bb57536b8b59d24f0286ed417dcc66da745f",
	name: "createDeposit",
	filename: "src/lib/fns/wallet.ts"
}, (opts) => createDeposit.__executeServer(opts));
var createDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const naira = Number(data.naira);
	if (!Number.isFinite(naira) || naira <= 0) throw new Error("Enter an amount to deposit.");
	return { naira };
}).handler(createDeposit_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	const settings = await loadSettings(sql);
	if (data.naira < settings.wallet.minDepositNaira) throw new Error(`Minimum deposit is ₦${settings.wallet.minDepositNaira.toLocaleString("en-NG")}.`);
	if (data.naira > settings.wallet.maxDepositNaira) throw new Error(`Maximum deposit is ₦${settings.wallet.maxDepositNaira.toLocaleString("en-NG")}.`);
	const amountKobo = nairaToKobo(data.naira);
	const reference = makeRef("DEP");
	const [row] = await sql`
      insert into payment_intents (user_id, kind, amount_kobo, status, provider, reference, metadata)
      values (
        ${context.userId}, 'deposit', ${amountKobo}, 'pending', 'sandbox', ${reference},
        ${JSON.stringify({ rail: "sandbox-bank-transfer" })}::jsonb
      )
      returning *
    `;
	await audit(sql, context.userId, "deposit.create", "payment", reference, { amountKobo });
	return mapPayment(row);
});
var confirmSandboxDeposit_createServerFn_handler = createServerRpc({
	id: "9933744accbee53b80e6c11ef7515288d945f5ce8650435f133197cc4264a88d",
	name: "confirmSandboxDeposit",
	filename: "src/lib/fns/wallet.ts"
}, (opts) => confirmSandboxDeposit.__executeServer(opts));
var confirmSandboxDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const reference = data.reference.trim();
	if (!reference) throw new Error("Missing payment reference.");
	return { reference };
}).handler(confirmSandboxDeposit_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActiveAccount(sql, context.userId);
	const [claimed] = await sql`
      update payment_intents
      set status = 'succeeded', updated_at = now()
      where reference = ${data.reference}
        and user_id = ${context.userId}
        and kind = 'deposit'
        and status = 'pending'
      returning id, amount_kobo, status, kind
    `;
	if (!claimed) {
		const [existing] = await sql`
        select * from payment_intents
        where reference = ${data.reference} and user_id = ${context.userId}
      `;
		if (!existing) throw new Error("Payment not found.");
		if (existing.status === "succeeded") return mapPayment(existing);
		throw new Error("This payment cannot be confirmed.");
	}
	const amount = Number(claimed.amount_kobo);
	try {
		await applyLedger(sql, {
			userId: context.userId,
			entryType: "deposit",
			amountKobo: amount,
			bucket: "available",
			reference: data.reference,
			description: "Sandbox bank deposit",
			metadata: { provider: "sandbox" }
		});
	} catch (err) {
		await sql`
        update payment_intents
        set status = 'failed', failure_reason = 'ledger_credit_failed', updated_at = now()
        where id = ${claimed.id} and user_id = ${context.userId}
      `;
		throw err;
	}
	await notify(sql, context.userId, "Deposit received", `${formatNaira(amount)} has been added to your available balance. Reference ${data.reference}.`, "deposit", "/wallet");
	await audit(sql, context.userId, "deposit.confirm", "payment", data.reference, { amountKobo: amount });
	const [row] = await sql`
      select * from payment_intents where id = ${claimed.id} and user_id = ${context.userId}
    `;
	return mapPayment(row);
});
var requestWithdrawal_createServerFn_handler = createServerRpc({
	id: "cd35374d0dbd2ffe2e38a238472739b02a4a9c7737677c51e12934b507040a2d",
	name: "requestWithdrawal",
	filename: "src/lib/fns/wallet.ts"
}, (opts) => requestWithdrawal.__executeServer(opts));
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
}).handler(requestWithdrawal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await requireActiveAccount(sql, context.userId)).account_status === "restricted") throw new Error("Withdrawals are restricted on this account.");
	await assertPin(sql, context.userId, data.pin);
	const settings = await loadSettings(sql);
	if (data.naira < settings.wallet.minWithdrawalNaira) throw new Error(`Minimum withdrawal is ₦${settings.wallet.minWithdrawalNaira.toLocaleString("en-NG")}.`);
	const amountKobo = nairaToKobo(data.naira);
	const feeKobo = pctOf(amountKobo, settings.wallet.withdrawalFeePct);
	const total = amountKobo + feeKobo;
	const reference = makeRef("WTH");
	const [intent] = await sql`
      insert into payment_intents (
        user_id, kind, amount_kobo, fee_kobo, status, provider, reference,
        destination_bank, destination_account, destination_name
      ) values (
        ${context.userId}, 'withdrawal', ${amountKobo}, ${feeKobo}, 'processing', 'sandbox', ${reference},
        ${data.bank}, ${data.accountNumber}, ${data.accountName}
      )
      returning *
    `;
	try {
		await applyLedger(sql, {
			userId: context.userId,
			entryType: "withdrawal",
			amountKobo: -amountKobo,
			bucket: "available",
			reference,
			description: `Withdrawal to ${data.bank} · ${data.accountNumber}`
		});
		if (feeKobo > 0) await applyLedger(sql, {
			userId: context.userId,
			entryType: "fee",
			amountKobo: -feeKobo,
			bucket: "available",
			reference: `${reference}-FEE`,
			description: "Withdrawal fee"
		});
	} catch (err) {
		await sql`
        update payment_intents
        set status = 'failed', failure_reason = 'insufficient_funds', updated_at = now()
        where id = ${intent.id} and user_id = ${context.userId}
      `;
		throw err;
	}
	await sql`
      update payment_intents
      set status = 'succeeded', updated_at = now()
      where id = ${intent.id} and user_id = ${context.userId}
    `;
	await notify(sql, context.userId, "Withdrawal sent", `${formatNaira(amountKobo)} is on its way to ${data.accountName} (${data.bank}). Sandbox settlement is instant.`, "withdrawal", "/wallet");
	await audit(sql, context.userId, "withdrawal.request", "payment", reference, {
		amountKobo,
		feeKobo,
		total
	});
	const [row] = await sql`
      select * from payment_intents where id = ${intent.id} and user_id = ${context.userId}
    `;
	return mapPayment(row);
});
//#endregion
export { confirmSandboxDeposit_createServerFn_handler, createDeposit_createServerFn_handler, getWalletOverview_createServerFn_handler, requestWithdrawal_createServerFn_handler };
