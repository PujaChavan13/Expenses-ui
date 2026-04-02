"use client";

import { TimeFilter } from "@/app/types/chart";
import { useMemo } from "react";

type FilterDropdownProps = {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
  selectedYear?: number;
  onYearChange?: (year: number) => void;
};

const OPTIONS: Array<{ value: TimeFilter; label: string }> = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function FilterDropdown({
  value,
  onChange,
  selectedYear,
  onYearChange,
}: FilterDropdownProps) {
  // Generate year options (past 10 years to 5 years in future)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  }, []);

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="period-filter" className="text-sm font-medium text-gray-600">
          View
        </label>
        <select
          id="period-filter"
          value={value}
          onChange={(event) => onChange(event.target.value as TimeFilter)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {value === "yearly" && (
        <div className="flex items-center gap-2">
          <label htmlFor="year-filter" className="text-sm font-medium text-gray-600">
            Year
          </label>
          <select
            id="year-filter"
            value={selectedYear ?? new Date().getFullYear()}
            onChange={(event) => onYearChange?.(parseInt(event.target.value, 10))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

