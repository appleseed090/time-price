"use client";

import { useState, useMemo, useCallback } from "react";
import type { Inputs } from "../lib/types";
import {
  getHourlyRate,
  computeTimeCost,
  computeTimeSaving,
  PRESETS,
} from "../lib/calc";
import ResultCard from "./ResultCard";
import ExampleCards from "./ExampleCards";
import Explanation from "./Explanation";

const DEFAULT_INPUTS: Inputs = {
  incomeMode: "salary",
  hourlyWage: "",
  annualSalary: "",
  weeklyHours: "40",
  purchasePrice: "",
  savesTime: false,
  timeSaved: "",
  timeSavedUnit: "per_use",
  usesPerMonth: "4",
};

type TouchedFields = Record<string, boolean>;

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [touched, setTouched] = useState<TouchedFields>({});

  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const touch = useCallback(
    (field: string) => setTouched((prev) => ({ ...prev, [field]: true })),
    []
  );

  const hourlyRate = useMemo(
    () =>
      getHourlyRate(
        inputs.incomeMode,
        parseFloat(inputs.hourlyWage) || 0,
        parseFloat(inputs.annualSalary) || 0,
        parseFloat(inputs.weeklyHours) || 40
      ),
    [inputs.incomeMode, inputs.hourlyWage, inputs.annualSalary, inputs.weeklyHours]
  );

  const timeCost = useMemo(
    () => computeTimeCost(parseFloat(inputs.purchasePrice) || 0, hourlyRate),
    [inputs.purchasePrice, hourlyRate]
  );

  const timeSaving = useMemo(() => {
    if (!inputs.savesTime || !timeCost) return null;
    return computeTimeSaving(
      parseFloat(inputs.timeSaved) || 0,
      inputs.timeSavedUnit,
      parseFloat(inputs.usesPerMonth) || 0,
      timeCost.hours
    );
  }, [inputs.savesTime, inputs.timeSaved, inputs.timeSavedUnit, inputs.usesPerMonth, timeCost]);

  const applyPreset = (i: number) => {
    const p = PRESETS[i];
    setInputs((prev) => ({
      ...prev,
      purchasePrice: p.price.toString(),
      savesTime: p.savesTime,
      timeSaved: p.timeSaved?.toString() ?? "",
      timeSavedUnit: p.timeSavedUnit ?? "per_use",
      usesPerMonth: p.usesPerMonth?.toString() ?? "4",
    }));
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      {/* Income section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Your Income
        </h2>

        {/* Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
          {(["salary", "hourly"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => set("incomeMode", mode)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                inputs.incomeMode === mode
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {mode === "salary" ? "Annual Salary" : "Hourly Wage"}
            </button>
          ))}
        </div>

        {inputs.incomeMode === "salary" ? (
          <InputField
            label="Annual salary"
            prefix="$"
            value={inputs.annualSalary}
            onChange={(v) => set("annualSalary", v)}
            onBlur={() => touch("annualSalary")}
            placeholder="65,000"
            error={touched.annualSalary && !parseFloat(inputs.annualSalary) ? "Required" : undefined}
          />
        ) : (
          <InputField
            label="Hourly wage"
            prefix="$"
            value={inputs.hourlyWage}
            onChange={(v) => set("hourlyWage", v)}
            onBlur={() => touch("hourlyWage")}
            placeholder="25"
            error={touched.hourlyWage && !parseFloat(inputs.hourlyWage) ? "Required" : undefined}
          />
        )}

        <InputField
          label="Hours per week"
          value={inputs.weeklyHours}
          onChange={(v) => set("weeklyHours", v)}
          onBlur={() => touch("weeklyHours")}
          placeholder="40"
          error={touched.weeklyHours && !parseFloat(inputs.weeklyHours) ? "Required" : undefined}
        />

        {hourlyRate > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            ≈ ${hourlyRate.toFixed(2)}/hr
          </p>
        )}
      </section>

      {/* Purchase section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          The Purchase
        </h2>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => applyPreset(i)}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all"
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        <InputField
          label="Purchase price"
          prefix="$"
          value={inputs.purchasePrice}
          onChange={(v) => set("purchasePrice", v)}
          onBlur={() => touch("purchasePrice")}
          placeholder="120"
          error={touched.purchasePrice && !parseFloat(inputs.purchasePrice) ? "Required" : undefined}
        />

        {/* Time saving toggle */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-10 h-6 rounded-full transition-colors ${
                inputs.savesTime ? "bg-emerald-500" : "bg-gray-200"
              }`}
              onClick={() => set("savesTime", !inputs.savesTime)}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  inputs.savesTime ? "translate-x-4" : ""
                }`}
              />
            </div>
            <span className="text-sm text-gray-700">
              This purchase saves me time
            </span>
          </label>
        </div>

        {inputs.savesTime && (
          <div className="mt-4 space-y-3 pl-1">
            <InputField
              label="Time saved (minutes)"
              value={inputs.timeSaved}
              onChange={(v) => set("timeSaved", v)}
              onBlur={() => touch("timeSaved")}
              placeholder="30"
              error={touched.timeSaved && inputs.savesTime && !parseFloat(inputs.timeSaved) ? "Required" : undefined}
            />

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Time saved frequency
              </label>
              <select
                value={inputs.timeSavedUnit}
                onChange={(e) =>
                  set("timeSavedUnit", e.target.value as Inputs["timeSavedUnit"])
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
              >
                <option value="per_use">Per use</option>
                <option value="per_week">Per week</option>
                <option value="per_month">Per month</option>
              </select>
            </div>

            {inputs.timeSavedUnit === "per_use" && (
              <InputField
                label="Uses per month"
                value={inputs.usesPerMonth}
                onChange={(v) => set("usesPerMonth", v)}
                onBlur={() => touch("usesPerMonth")}
                placeholder="4"
                error={touched.usesPerMonth && inputs.savesTime && inputs.timeSavedUnit === "per_use" && !parseFloat(inputs.usesPerMonth) ? "Required" : undefined}
              />
            )}
          </div>
        )}
      </section>

      {/* Results */}
      {timeCost && <ResultCard timeCost={timeCost} timeSaving={timeSaving} />}

      {/* Examples & Explanation */}
      <ExampleCards hourlyRate={hourlyRate} />
      <Explanation />
    </div>
  );
}

function InputField({
  label,
  prefix,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}: {
  label: string;
  prefix?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9.,]/g, "");
            onChange(v);
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full rounded-lg border py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50"
              : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
          } ${prefix ? "pl-7 pr-3" : "px-3"}`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
