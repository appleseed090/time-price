import type {
  IncomeMode,
  TimeSavedUnit,
  TimeCostResult,
  TimeSavingResult,
  Preset,
} from "./types";

export function getHourlyRate(
  mode: IncomeMode,
  hourlyWage: number,
  annualSalary: number,
  weeklyHours: number
): number {
  if (mode === "hourly") return hourlyWage;
  if (weeklyHours <= 0) return 0;
  return annualSalary / (weeklyHours * 52);
}

export function computeTimeCost(
  price: number,
  hourlyRate: number
): TimeCostResult | null {
  if (hourlyRate <= 0 || price < 0) return null;
  const hours = price / hourlyRate;

  let label: string;
  let humanFriendly: string;

  if (hours < 1) {
    const mins = Math.round(hours * 60);
    label = `${mins} minute${mins !== 1 ? "s" : ""}`;
    humanFriendly = mins < 15 ? "About a coffee break" : "Less than an hour";
  } else if (hours < 8) {
    const rounded = Math.round(hours * 10) / 10;
    label = `${rounded} hour${rounded !== 1 ? "s" : ""}`;
    if (hours < 2) humanFriendly = "About an hour of work";
    else if (hours < 4) humanFriendly = "A few hours of work";
    else humanFriendly = "About half a workday";
  } else if (hours < 40) {
    const days = Math.round((hours / 8) * 10) / 10;
    label = `${days} workday${days !== 1 ? "s" : ""}`;
    if (days <= 1) humanFriendly = "A full day of work";
    else if (days <= 3) humanFriendly = "A couple of workdays";
    else humanFriendly = "Almost a full work week";
  } else {
    const weeks = Math.round((hours / 40) * 10) / 10;
    label = `${weeks} work week${weeks !== 1 ? "s" : ""}`;
    if (weeks <= 2) humanFriendly = "A week or two of work";
    else if (weeks <= 4) humanFriendly = "About a month of work";
    else humanFriendly = `That's ${weeks} weeks of full-time work`;
  }

  return { hours, label, humanFriendly };
}

export function computeTimeSaving(
  timeSaved: number,
  unit: TimeSavedUnit,
  usesPerMonth: number,
  timeCostHours: number
): TimeSavingResult | null {
  if (timeSaved <= 0 || timeCostHours <= 0) return null;

  let monthlySavedHours: number;
  switch (unit) {
    case "per_use":
      monthlySavedHours = (timeSaved / 60) * usesPerMonth;
      break;
    case "per_week":
      monthlySavedHours = (timeSaved / 60) * 4.33;
      break;
    case "per_month":
      monthlySavedHours = timeSaved / 60;
      break;
  }

  const paybackMonths =
    monthlySavedHours > 0 ? timeCostHours / monthlySavedHours : Infinity;

  let verdict: TimeSavingResult["verdict"];
  let verdictLabel: string;
  let verdictColor: string;

  if (monthlySavedHours >= timeCostHours) {
    verdict = "worth_it";
    verdictLabel = "Probably worth it ✨";
    verdictColor = "text-emerald-600";
  } else if (monthlySavedHours >= timeCostHours * 0.7) {
    verdict = "borderline";
    verdictLabel = "Borderline — think it over 🤔";
    verdictColor = "text-amber-600";
  } else {
    verdict = "not_worth_it";
    verdictLabel = "Probably not worth the time cost 💸";
    verdictColor = "text-red-500";
  }

  return {
    monthlySavedHours: Math.round(monthlySavedHours * 10) / 10,
    paybackMonths: Math.round(paybackMonths * 10) / 10,
    verdict,
    verdictLabel,
    verdictColor,
  };
}

export function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`;
  return `${Math.round(h * 10) / 10} hr${h >= 1.05 ? "s" : ""}`;
}

export const PRESETS: Preset[] = [
  {
    name: "House cleaner",
    emoji: "🧹",
    price: 120,
    savesTime: true,
    timeSaved: 180,
    timeSavedUnit: "per_use",
    usesPerMonth: 2,
  },
  {
    name: "Meal kit",
    emoji: "🥘",
    price: 80,
    savesTime: true,
    timeSaved: 45,
    timeSavedUnit: "per_use",
    usesPerMonth: 8,
  },
  {
    name: "Software subscription",
    emoji: "💻",
    price: 15,
    savesTime: true,
    timeSaved: 120,
    timeSavedUnit: "per_month",
  },
  {
    name: "Robot vacuum",
    emoji: "🤖",
    price: 400,
    savesTime: true,
    timeSaved: 30,
    timeSavedUnit: "per_week",
  },
];
