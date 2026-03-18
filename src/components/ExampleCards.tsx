import { computeTimeCost } from "../lib/calc";

const EXAMPLES = [
  { emoji: "🧹", name: "Cleaning service", price: 120, desc: "Biweekly deep clean" },
  { emoji: "📺", name: "Streaming subscription", price: 15, desc: "Monthly subscription" },
  { emoji: "🤖", name: "Robot vacuum", price: 400, desc: "One-time purchase" },
  { emoji: "🥘", name: "Weekly meal prep", price: 80, desc: "Pre-made meals" },
];

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
          return (
            <div
              key={ex.name}
              className="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4"
            >
              <div className="text-xl mb-1">{ex.emoji}</div>
              <p className="text-sm font-medium text-gray-900">{ex.name}</p>
              <p className="text-xs text-gray-400 mb-2">${ex.price}</p>
              {cost && (
                <p className="text-sm font-semibold text-indigo-600">
                  {cost.label}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
