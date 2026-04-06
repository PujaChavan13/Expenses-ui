"use client";

import { useEffect, useMemo, useState } from "react";
import { Expense } from "@/app/types/expense";
import { CategoryPoint, TimeFilter, TrendPoint } from "@/app/types/chart";
import { Card } from "@/components/ui/card";
import FilterDropdown from "./FilterDropdown";
import ExpenseTrendChart from "./ExpenseTrendChart";
import CategoryExpenseChart from "./CategoryExpenseChart";
import { useExpense } from "@/app/context/ExpenseContext";

type ExpenseChartsDashboardProps = {
  expenses: Expense[];
};

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  travel: "Travel",
  bills: "Bills",
  shopping: "Shopping",
  utilities: "Utilities",
  transport: "Transport",
  entertainment: "Entertainment",
  other: "Other",
};


const normalizeCategory = (category: string) => category.trim().toLowerCase();

const isInCurrentWeek = (date: Date) => {
  const today = new Date();
  const day = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);
  return date >= weekStart && date <= today;
};

const isInCurrentMonth = (date: Date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const isInCurrentYear = (date: Date) => {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
};

export default function ExpenseChartsDashboard() {
    const { expenses } = useExpense();
  const [filter, setFilter] = useState<TimeFilter>("weekly");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sourceExpenses = expenses

  const filteredExpenses = useMemo(() => {
    return sourceExpenses.filter((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return false;
      if (filter === "weekly") return isInCurrentWeek(date);
      if (filter === "monthly") return isInCurrentMonth(date);
      if (filter === "yearly") return date.getFullYear() === selectedYear;
      return false;
    });
  }, [sourceExpenses, filter, selectedYear]);

  const getWeekNumber = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDay.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
  };

  const trendData = useMemo<TrendPoint[]>(() => {
    if (filter === "weekly") {
      // For weekly view, show Week 1-4 with expenses aggregated by week
      const weekMap = new Map<number, number>();
      
      filteredExpenses.forEach((expense) => {
        const date = new Date(expense.date);
        const weekNum = getWeekNumber(date);
        weekMap.set(weekNum, (weekMap.get(weekNum) ?? 0) + expense.amount);
      });

      return Array.from(weekMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([weekNum, total]) => ({
          label: `Week ${weekNum}`,
          total,
        }));
    } else if (filter === "monthly") {
      // For monthly view, show day and month for current month
      const dayMap = new Map<string, { total: number; sortKey: number }>();

      filteredExpenses.forEach((expense) => {
        const date = new Date(expense.date);
        const key = date.toISOString().slice(0, 10);
        const label = date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
        const sortKey = date.getTime();

        const current = dayMap.get(key);
        dayMap.set(key, {
          total: (current?.total ?? 0) + expense.amount,
          sortKey,
        });
      });

      return Array.from(dayMap.entries())
        .map(([, value]) => value)
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(({ total, sortKey }) => {
          const date = new Date(sortKey);
          return {
            label: date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
            total,
          };
        });
    } else {
      // For yearly view, show all 12 months with selected year
      const monthMap = new Map<number, number>();
      
      // Initialize all 12 months with 0
      for (let i = 0; i < 12; i++) {
        monthMap.set(i, 0);
      }

      filteredExpenses.forEach((expense) => {
        const date = new Date(expense.date);
        const monthNum = date.getMonth();
        monthMap.set(monthNum, (monthMap.get(monthNum) ?? 0) + expense.amount);
      });

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      return Array.from(monthMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([monthNum, total]) => ({
          label: monthNames[monthNum],
          total,
        }));
    }
  }, [filteredExpenses, filter]);

  const categoryData = useMemo<CategoryPoint[]>(() => {
    const totals = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
      const key = normalizeCategory(expense.category);
      acc[key] = (acc[key] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(totals)
      .map(([category, total]) => ({
        category: CATEGORY_LABELS[category] ?? category,
        total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses]);

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Expense Analytics</h2>
          <p className="text-sm text-gray-500">Track trends and category spending at a glance</p>
        </div>
        <FilterDropdown
          value={filter}
          onChange={setFilter}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm sm:text-base font-medium text-gray-800">
            {filter[0].toUpperCase() + filter.slice(1)} Trend
          </h3>
          {isMounted ? (
            <ExpenseTrendChart data={trendData} />
          ) : (
            <div className="h-72 w-full animate-pulse rounded bg-gray-100" />
          )}
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm sm:text-base font-medium text-gray-800">Category-wise Expenses</h3>
          {isMounted ? (
            <CategoryExpenseChart data={categoryData} />
          ) : (
            <div className="h-72 w-full animate-pulse rounded bg-gray-100" />
          )}
        </div>
      </div>
    </Card>
  );
}

