import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJsAdniy.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B5HIen-N.js
var getStaffContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("99464115c614ce874b85dae021d3e4378051e3ead5624b96ba3781d8b6c77e96"));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("36a7de086e9af033a1ffb827bf8fc2c1027f43d8b22c9a9e0ace3dc252bc78b6"));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ea2e54267377eb9a06b9bc1dfc342928e06f8f3e64cb628b828468c5630e1acc"));
var listCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f82c59bfe04ea23d91a764388090f5d60cdb19295388c8296537cab86242033a"));
var setCustomerStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data.userId) throw new Error("Missing customer.");
	return data;
}).handler(createSsrRpc("e9c504f16d8cc9017aa8bf6557c551ed38ee6982d75a76a0a15952fd80339bbc"));
var reviewKyc = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("ddaeb511eb1cdd136c69dab8d9d7c42e8830efda98d98e3b24e0b7f4c5796bf8"));
var listAdminPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("523d19b335f5cfde00b92bfa31c13e7a4abdce918f9887e31e3ab84bc7ee8101"));
var listAdminTransactions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9e968a1d4d035bf3c598096756524f1022f236e2e3d4e28ea0cca4d7ec530d9e"));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8cf9541e9564c1f14d0782d961bef8a24bebda80a1485796796382ce44133b06"));
var saveAdminSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data?.adashi || !data?.wallet) throw new Error("Invalid settings.");
	return data;
}).handler(createSsrRpc("1ca9e109ecb7ed508ba355ffbd72a13f89ad3957003e88d9a52730897f0c55af"));
var postAnnouncement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	const title = data.title.trim();
	const body = data.body.trim();
	if (title.length < 3 || body.length < 3) throw new Error("Write a title and a message.");
	return {
		title,
		body
	};
}).handler(createSsrRpc("0880b34a5b02ea375fcf6f91fcfde2602a677c1a6819c448107ab30b04eab150"));
var listAuditLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("42a20e9e774b968d29b0d93d99f91c1aead4db0598cf232d8f4f84710b982076"));
//#endregion
export { listAdminPlans as a, listCustomers as c, saveAdminSettings as d, setCustomerStatus as f, getStaffContext as i, postAnnouncement as l, getAdminOverview as n, listAdminTransactions as o, getAdminSettings as r, listAuditLogs as s, claimAdmin as t, reviewKyc as u };
