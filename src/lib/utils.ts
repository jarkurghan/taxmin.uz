import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, addMinutes } from "date-fns";
import { uz } from "date-fns/locale";
import type { MatchStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMatchDate(date: string | Date): string {
  return format(new Date(date), "d-MMMM, HH:mm", { locale: uz });
}

export function formatMatchTime(date: string | Date): string {
  return format(new Date(date), "HH:mm");
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: uz });
}

export function isPredictionLocked(scheduledAt: string | Date, minutesBefore = 5): boolean {
  const lockTime = addMinutes(new Date(scheduledAt), -minutesBefore);
  return isPast(lockTime);
}

export function getMatchStatusLabel(status: MatchStatus): string {
  const labels: Record<MatchStatus, string> = {
    scheduled: "Rejalashtirilgan",
    live: "Jonli efir 🔴",
    finished: "Tugagan",
    postponed: "Kechiktirilgan",
  };
  return labels[status];
}

export function getPointsLabel(points: number | null): { label: string; color: string } {
  if (points === null) return { label: "—", color: "text-gray-400" };
  if (points === 5) return { label: "Aniq 🎯", color: "text-emerald-600" };
  if (points === 3) return { label: "Deyarli ✅", color: "text-blue-600" };
  if (points === 1) return { label: "G'olib ✔️", color: "text-yellow-600" };
  return { label: "Noto'g'ri ❌", color: "text-red-500" };
}

export function getUserDisplayName(user: { firstName: string; lastName?: string | null; username?: string | null }): string {
  if (user.username) return `@${user.username}`;
  return [user.firstName, user.lastName].filter(Boolean).join(" ");
}

export function getRankMedal(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}.`;
}

// Team flag emoji by 3-letter code
const FLAG_MAP: Record<string, string> = {
  USA: "🇺🇸", MEX: "🇲🇽", CAN: "🇨🇦", BRA: "🇧🇷", ARG: "🇦🇷",
  FRA: "🇫🇷", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", GER: "🇩🇪", ESP: "🇪🇸", POR: "🇵🇹",
  NED: "🇳🇱", BEL: "🇧🇪", ITA: "🇮🇹", URU: "🇺🇾", COL: "🇨🇴",
  ECU: "🇪🇨", CHL: "🇨🇱", PER: "🇵🇪", VEN: "🇻🇪", PAR: "🇵🇾",
  BOL: "🇧🇴", SUI: "🇨🇭", CRO: "🇭🇷", SRB: "🇷🇸", DEN: "🇩🇰",
  POL: "🇵🇱", TUR: "🇹🇷", UKR: "🇺🇦", WAL: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  AUS: "🇦🇺", JPN: "🇯🇵", KOR: "🇰🇷", IRN: "🇮🇷", SAU: "🇸🇦",
  QAT: "🇶🇦", MAR: "🇲🇦", SEN: "🇸🇳", GHA: "🇬🇭", CMR: "🇨🇲",
  TUN: "🇹🇳", CIV: "🇨🇮", NGA: "🇳🇬", EGY: "🇪🇬", MLI: "🇲🇱",
  MEX: "🇲🇽", CRC: "🇨🇷", PAN: "🇵🇦", JAM: "🇯🇲", HON: "🇭🇳",
  UZB: "🇺🇿", CHN: "🇨🇳", IND: "🇮🇳",
};

export function getTeamFlag(code: string): string {
  return FLAG_MAP[code] ?? "🏳️";
}
