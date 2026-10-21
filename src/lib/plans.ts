export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export interface PlanLimits {
  maxBrains: number;
  maxRecordingMinutesPerMonth: number;
}

const PLANS: Record<"admin" | "starter", PlanLimits> = {
  admin: { maxBrains: Infinity, maxRecordingMinutesPerMonth: Infinity },
  starter: { maxBrains: 1, maxRecordingMinutesPerMonth: 300 },
};

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function planFor(email: string | undefined | null): PlanLimits {
  return isAdmin(email) ? PLANS.admin : PLANS.starter;
}
