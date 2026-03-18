import type { TimeCostResult, TimeSavingResult } from "../lib/types";
import { formatHours } from "../lib/calc";

export default function ResultCard({
  timeCost,
  timeSaving,
  purchaseName,
}: {
  timeCost: TimeCostResult;
  timeSaving: TimeSavingResult | null;
  purchaseName?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-3">
        Time Cost
      </h2>

      {purchaseName && (
        <p className="text-sm text-gray-500 mb-1">
          {purchaseName} costs you:
        </p>
      )}

      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        {timeCost.label}
      </p>
      <p className="text-sm text-gray-500 mb-4">{timeCost.humanFriendly}</p>

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
