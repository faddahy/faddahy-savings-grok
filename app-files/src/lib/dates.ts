const LAGOS = "Africa/Lagos";

export function todayLagos(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LAGOS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function diffDays(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

export function formatLongDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: LAGOS,
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

export function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    timeZone: LAGOS,
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: LAGOS,
  }).format(new Date(iso));
}

export type Frequency =
  | "daily"
  | "every_2_days"
  | "every_3_days"
  | "weekly"
  | "monthly";

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  daily: "Every day",
  every_2_days: "Every 2 days",
  every_3_days: "Every 3 days",
  weekly: "Every week",
  monthly: "Every month",
};

export function frequencyStepDays(freq: Frequency): number {
  switch (freq) {
    case "daily":
      return 1;
    case "every_2_days":
      return 2;
    case "every_3_days":
      return 3;
    case "weekly":
      return 7;
    case "monthly":
      return 30;
  }
}

export function generateDates(
  start: string,
  count: number,
  freq: Frequency,
): string[] {
  const step = frequencyStepDays(freq);
  const dates: string[] = [];
  for (let i = 0; i < count; i++) dates.push(addDays(start, i * step));
  return dates;
}

export function periodCount(start: string, end: string, freq: Frequency): number {
  const total = Math.max(0, diffDays(start, end));
  const step = frequencyStepDays(freq);
  return Math.max(1, Math.floor(total / step) + (freq === "daily" ? 1 : 0) || 1);
}

export function suggestedContribution(
  targetKobo: number,
  start: string,
  end: string,
  freq: Frequency,
): number {
  const periods = Math.max(1, countPeriodsInclusive(start, end, freq));
  return Math.ceil(targetKobo / periods / 100) * 100;
}

export function countPeriodsInclusive(
  start: string,
  end: string,
  freq: Frequency,
): number {
  if (end < start) return 1;
  const step = frequencyStepDays(freq);
  return Math.floor(diffDays(start, end) / step) + 1;
}
