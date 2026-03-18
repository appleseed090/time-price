export type IncomeMode = "hourly" | "salary";

export type TimeSavedUnit = "per_use" | "per_week" | "per_month";

export type RecurringFrequency = "weekly" | "monthly" | "yearly";

export interface Inputs {
  incomeMode: IncomeMode;
  hourlyWage: string;
  annualSalary: string;
  weeklyHours: string;
  purchaseName: string;
  purchasePrice: string;
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency;
  savesTime: boolean;
  timeSaved: string;
  timeSavedUnit: TimeSavedUnit;
  usesPerMonth: string;
}

export interface TimeCostResult {
  hours: number;
  label: string;
  humanFriendly: string;
  /** For recurring purchases */
  yearlyHours?: number;
  yearlyLabel?: string;
  perPeriodLabel?: string;
}

export interface TimeSavingResult {
  monthlySavedHours: number;
  paybackMonths: number;
  verdict: "worth_it" | "borderline" | "not_worth_it";
  verdictLabel: string;
  verdictColor: string;
}

export interface Preset {
  name: string;
  emoji: string;
  price: number;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  savesTime: boolean;
  timeSaved?: number;
  timeSavedUnit?: TimeSavedUnit;
  usesPerMonth?: number;
}
