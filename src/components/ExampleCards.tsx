import { computeTimeCost } from "../lib/calc";
import type { RecurringFrequency } from "../lib/types";

const EXAMPLES: {
  emoji: string;
  name: string;
  price: number;
  desc: string;
  recurring?: boolean;
  frequency?: RecurringFrequency;
}[] = [
  { emoji: "🧹", name: "Cleaning service", price: 120, desc: "Biweekly deep clean", recurring: true, frequency: "monthly" },
  { emoji: "📺", name: "Streaming subscription", price: 15, desc: "Monthly subscription", recurring: true, frequency: "monthly" },
  { emoji: "🤖", name: "Robot vacuum", price: 400, desc: "One-time purchase" },
  { emoji: "🥘", name: "Weekly meal prep", price: 80, desc: "Pre-made meals", recurring: true, frequency: "weekly" },
];

function periodsPerYear(freq: RecurringFrequency): number {
  switch (freq) {
    case "weekly": return 52;
    case "monthly": return 12;
    case "yearly": return 1;
  }
}

function frequencyLabel(freq: RecurringFrequency): string {
  switch (freq) {
    case "weekly": return "/wk";
    case "monthly": return "/mo";
    case "yearly": return "/yr";
  }
}

export default function ExampleCards({ hourlyRate }: { hourlyRate: number }) {
  if (hourlyRate <= 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Examples at your rate
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {EXAMPLES.map((ex) => {
          const cost = computeTimeCost(ex.price, hourlyRate);
          if (!cost) return null;

          let label: string;
          if (ex.recurring && ex.frequency) {
            const yearlyHours = cost.hours * periodsPerYear(ex.frequency);
            const yearCost = computeTimeCost(ex.price * periodsPerYear(ex.frequency), hourlyRate);
            label = `${yearCost?.label ?? cost.label} per year`;
          } else {
            label = cost.label;
          }

          return (
            <div
              key={ex.name}
              className="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4"
            >
              <div className="text-xl mb-1">{ex.emoji}</div>
              <p className="text-sm font-medium text-gray-900">{ex.name}</p>
              <p className="text-xs text-gray-400 mb-2">
                ${ex.price}{ex.recurring && ex.frequency ? frequencyLabel(ex.frequency) : ""}
              </p>
              <p className="text-sm font-semibold text-indigo-600">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
