"use client";

import { useState, useMemo } from "react";
import type { TimeCostResult, TimeSavingResult, RecurringFrequency } from "../lib/types";
import { formatHours } from "../lib/calc";

type TimeUnit = "minutes" | "hours" | "workdays" | "work_weeks";
type Period = "per_day" | "per_week" | "per_month" | "per_year";

const TIME_UNIT_LABELS: Record<TimeUnit, [string, string]> = {
  minutes: ["work minute", "work minutes"],
  hours: ["work hour", "work hours"],
  workdays: ["workday", "workdays"],
  work_weeks: ["work week", "work weeks"],
};

const PERIOD_LABELS: Record<Period, string> = {
  per_day: "per day",
  per_week: "per week",
  per_month: "per month",
  per_year: "per year",
};

function convertHours(hours: number, unit: TimeUnit): number {
  switch (unit) {
    case "minutes":
      return hours * 60;
    case "hours":
      return hours;
    case "workdays":
      return hours / 8;
    case "work_weeks":
      return hours / 40;
  }
}

function recurringPeriodsPerYear(freq: RecurringFrequency): number {
  switch (freq) {
    case "weekly":
      return 52;
    case "monthly":
      return 12;
    case "yearly":
      return 1;
  }
}

function scaleForPeriod(
  hoursPerPayment: number,
  recurringFrequency: RecurringFrequency,
  period: Period
): number {
  const ppy = recurringPeriodsPerYear(recurringFrequency);
  switch (period) {
    case "per_day":
      return hoursPerPayment * (ppy / 365);
    case "per_week":
      return hoursPerPayment * (ppy / 52);
    case "per_month":
      return hoursPerPayment * (ppy / 12);
    case "per_year":
      return hoursPerPayment * ppy;
  }
}

function smartFormat(value: number): string {
  if (value === 0) return "0";
  if (value < 0.1) return value.toFixed(2);
  if (value < 10) return (Math.round(value * 10) / 10).toString();
  return Math.round(value).toLocaleString();
}

function pluralize(value: number, [singular, plural]: [string, string]): string {
  return Math.abs(value - 1) < 0.05 ? singular : plural;
}

function getHumanFriendly(hours: number, period: Period | null): string {
  const periodSuffix = period ? ` ${PERIOD_LABELS[period]}` : "";

  if (hours < 1 / 60) return `Barely a blip${periodSuffix}`;
  if (hours < 0.25) return `About a coffee break${periodSuffix}`;
  if (hours < 1) return `Less than an hour${periodSuffix}`;
  if (hours < 2) return `About an hour of work${periodSuffix}`;
  if (hours < 4) return `A few hours of work${periodSuffix}`;
  if (hours < 8) return `About half a workday${periodSuffix}`;
  if (hours < 16) return `A full day of work${periodSuffix}`;
  if (hours < 24) return `A couple of workdays${periodSuffix}`;
  if (hours < 40) return `Almost a full work week${periodSuffix}`;
  if (hours < 80) return `A week or two of work${periodSuffix}`;
  if (hours < 160) return `About a month of work${periodSuffix}`;
  const weeks = Math.round(hours / 40);
  return `That's ${weeks} weeks of full-time work${periodSuffix}`;
}

export default function ResultCard({
  timeCost,
  timeSaving,
  purchaseName,
  isRecurring,
  recurringFrequency,
}: {
  timeCost: TimeCostResult;
  timeSaving: TimeSavingResult | null;
  purchaseName?: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
}) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("hours");
  const [period, setPeriod] = useState<Period>(
    isRecurring ? "per_year" : "per_day"
  );

  const displayValue = useMemo(() => {
    let hours = timeCost.hours;
    if (isRecurring && recurringFrequency) {
      hours = scaleForPeriod(hours, recurringFrequency, period);
    }
    return convertHours(hours, timeUnit);
  }, [timeCost.hours, timeUnit, period, isRecurring, recurringFrequency]);

  const scaledHours = useMemo(() => {
    let hours = timeCost.hours;
    if (isRecurring && recurringFrequency) {
      hours = scaleForPeriod(hours, recurringFrequency, period);
    }
    return hours;
  }, [timeCost.hours, period, isRecurring, recurringFrequency]);

  const humanFriendly = useMemo(
    () => getHumanFriendly(scaledHours, isRecurring ? period : null),
    [scaledHours, isRecurring, period]
  );

  const selectClass =
    "inline-block appearance-none bg-white/70 border border-indigo-200 rounded-lg px-2 py-1 text-lg sm:text-xl font-bold text-indigo-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-3">
        Time Cost
      </h2>

      {purchaseName && (
        <p className="text-sm text-gray-500 mb-2">
          {purchaseName} costs you:
        </p>
      )}

      <div className="flex flex-wrap items-baseline gap-2 mb-1">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          {smartFormat(displayValue)}
        </span>

        <select
          value={timeUnit}
          onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
          className={selectClass}
        >
          {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
            <option key={u} value={u}>
              {pluralize(displayValue, TIME_UNIT_LABELS[u])}
            </option>
          ))}
        </select>

        {isRecurring && (
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className={selectClass}
          >
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <option key={p} value={p}>
                {PERIOD_LABELS[p]}
              </option>
            ))}
          </select>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">{humanFriendly}</p>

      {timeSaving && (
        <div className="border-t border-indigo-100 pt-4 mt-2 space-y-2">
          <p className="text-sm text-gray-600">
            You may gain back{" "}
            <span className="font-semibold text-gray-900">
              {formatHours(timeSaving.monthlySavedHours)}
            </span>{" "}
            per month
          </p>

          {timeSaving.paybackMonths !== Infinity && (
            <p className="text-sm text-gray-500">
              Payback period:{" "}
              <span className="font-medium">
                ~{timeSaving.paybackMonths} month
                {timeSaving.paybackMonths !== 1 ? "s" : ""}
              </span>
            </p>
          )}

          <p className={`text-lg font-semibold mt-2 ${timeSaving.verdictColor}`}>
            {timeSaving.verdictLabel}
          </p>
        </div>
      )}
    </section>
  );
}
