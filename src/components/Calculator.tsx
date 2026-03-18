"use client";

import { useState, useMemo } from "react";
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
  salaryFrequency: "yearly",
  weeklyHours: "40",
  purchaseName: "",
  purchasePrice: "",
  isRecurring: false,
  recurringFrequency: "monthly",
  savesTime: false,
  timeSaved: "",
  timeSavedUnit: "per_use",
  usesPerMonth: "4",
};

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);

  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const hourlyRate = useMemo(
    () =>
      getHourlyRate(
        inputs.incomeMode,
        parseFloat(inputs.hourlyWage) || 0,
        parseFloat(inputs.annualSalary) || 0,
        inputs.salaryFrequency,
        parseFloat(inputs.weeklyHours) || 40
      ),
    [inputs.incomeMode, inputs.hourlyWage, inputs.annualSalary, inputs.salaryFrequency, inputs.weeklyHours]
  );

  const timeCost = useMemo(
    () =>
      computeTimeCost(
        parseFloat(inputs.purchasePrice) || 0,
        hourlyRate,
        inputs.isRecurring,
        inputs.recurringFrequency
      ),
    [inputs.purchasePrice, hourlyRate, inputs.isRecurring, inputs.recurringFrequency]
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
      purchaseName: p.name,
      purchasePrice: p.price.toString(),
      isRecurring: p.isRecurring ?? false,
      recurringFrequency: p.recurringFrequency ?? "monthly",
      savesTime: p.savesTime,
      timeSaved: p.timeSaved?.toString() ?? "",
      timeSavedUnit: p.timeSavedUnit ?? "per_use",
      usesPerMonth: p.usesPerMonth?.toString() ?? "4",
    }));
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      <p className="text-xs text-gray-400 text-right">
        <span className="text-red-500">*</span> Required field
      </p>

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
              {mode === "salary" ? "Salary" : "Hourly Wage"}
            </button>
          ))}
        </div>

        {inputs.incomeMode === "salary" ? (
          <>
            <InputField
              label="Salary"
              prefix="$"
              value={inputs.annualSalary}
              onChange={(v) => set("annualSalary", v)}
              placeholder="65,000"
              required
              error={!parseFloat(inputs.annualSalary)}
            />
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Pay frequency
              </label>
              <select
                value={inputs.salaryFrequency}
                onChange={(e) =>
                  set("salaryFrequency", e.target.value as Inputs["salaryFrequency"])
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
              >
                <option value="yearly">Per year</option>
                <option value="monthly">Per month</option>
                <option value="biweekly">Every 2 weeks</option>
                <option value="weekly">Per week</option>
              </select>
            </div>
          </>
        ) : (
          <InputField
            label="Hourly wage"
            prefix="$"
            value={inputs.hourlyWage}
            onChange={(v) => set("hourlyWage", v)}
            placeholder="25"
            required
            error={!parseFloat(inputs.hourlyWage)}
          />
        )}

        <InputField
          label="Hours per week"
          value={inputs.weeklyHours}
          onChange={(v) => set("weeklyHours", v)}
          placeholder="40"
          required
          error={!parseFloat(inputs.weeklyHours)}
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

        <TextInputField
          label="What are you buying?"
          value={inputs.purchaseName}
          onChange={(v) => set("purchaseName", v)}
          placeholder="e.g. Robot vacuum, Gym membership"
          maxLength={60}
        />

        <InputField
          label="Purchase price"
          prefix="$"
          value={inputs.purchasePrice}
          onChange={(v) => set("purchasePrice", v)}
          placeholder="120"
          required
          error={!parseFloat(inputs.purchasePrice)}
        />

        {/* Recurring toggle */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={inputs.isRecurring}
              onClick={() => set("isRecurring", !inputs.isRecurring)}
              className="relative w-10 h-6 rounded-full transition-colors"
              style={{ backgroundColor: inputs.isRecurring ? "#10b981" : "#e5e7eb" }}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  inputs.isRecurring ? "translate-x-4" : ""
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              This is a recurring payment
            </span>
          </label>
        </div>

        {inputs.isRecurring && (
          <div className="mt-3 pl-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              How often?
            </label>
            <select
              value={inputs.recurringFrequency}
              onChange={(e) =>
                set("recurringFrequency", e.target.value as Inputs["recurringFrequency"])
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        {/* Time saving toggle */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={inputs.savesTime}
              onClick={() => set("savesTime", !inputs.savesTime)}
              className="relative w-10 h-6 rounded-full transition-colors"
              style={{ backgroundColor: inputs.savesTime ? "#10b981" : "#e5e7eb" }}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  inputs.savesTime ? "translate-x-4" : ""
                }`}
              />
            </button>
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
              placeholder="30"
              required
              error={!parseFloat(inputs.timeSaved)}
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
                placeholder="4"
                required
                error={!parseFloat(inputs.usesPerMonth)}
              />
            )}
          </div>
        )}
      </section>

      {/* Results */}
      {timeCost && (
        <ResultCard
          timeCost={timeCost}
          timeSaving={timeSaving}
          purchaseName={inputs.purchaseName}
          isRecurring={inputs.isRecurring}
          recurringFrequency={inputs.recurringFrequency}
        />
      )}

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
  placeholder,
  required,
  error,
}: {
  label: string;
  prefix?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}) {
  const showError = required && error;
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
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
          placeholder={placeholder}
          className={`w-full rounded-lg border py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
            showError
              ? "border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50/50"
              : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
          } ${prefix ? "pl-7 pr-3" : "px-3"}`}
        />
      </div>
    </div>
  );
}

function TextInputField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
          onChange(v);
        }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
      />
      {maxLength && value.length > maxLength * 0.8 && (
        <p className="text-xs text-gray-400 mt-0.5 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
