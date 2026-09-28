/** All money is stored as integer kobo. ₦1 = 100 kobo. */

export function nairaToKobo(naira: number): number {
  if (!Number.isFinite(naira)) return 0;
  return Math.round(naira * 100);
}

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

export function formatNaira(kobo: number, opts?: { compact?: boolean }): string {
  const naira = (kobo || 0) / 100;
  if (opts?.compact && Math.abs(naira) >= 1_000_000) {
    const m = naira / 1_000_000;
    return `₦${m.toFixed(m >= 10 ? 0 : 1)}m`;
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: naira % 1 === 0 ? 0 : 2,
  }).format(naira);
}

export function formatNairaInput(naira: number): string {
  if (!Number.isFinite(naira) || naira === 0) return "";
  return new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(
    Math.round(naira),
  );
}

export function parseNairaInput(raw: string): number {
  const cleaned = raw.replace(/[₦,\s]/g, "");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function pctOf(kobo: number, pct: number): number {
  return Math.round((kobo * pct) / 100);
}
