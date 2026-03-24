"use client";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Expense } from "../types/expense";
import { Card } from "@/components/ui/card";

type Props = {
  expenses: Expense[];
  month: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "utilities",
  "shopping",
  "other",
];

const normalizeCategoryKey = (category: string) =>
  category.trim().toLowerCase();

const normalizeToKnownCategory = (category: string) => {
  const key = normalizeCategoryKey(category);
  return CATEGORIES.includes(key) ? key : "other";
};

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default function MonthlySummary({ expenses, month }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const [viewMonth, setViewMonth] = useState(month);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Filter expenses for the selected month
  const monthlyExpenses = useMemo(
    () => expenses.filter((expense) => expense.date.startsWith(viewMonth)),
    [expenses, viewMonth]
  );

  // Date-wise expense totals
  const dateTotals = useMemo(
    () =>
      monthlyExpenses.reduce<Record<string, number>>((acc, expense) => {
        acc[expense.date] = (acc[expense.date] || 0) + expense.amount;
        return acc;
      }, {}),
    [monthlyExpenses]
  );

  // Expenses for selected date
  const selectedDateExpenses = useMemo(
    () =>
      selectedDate
        ? monthlyExpenses.filter((e) => e.date === selectedDate)
        : [],
    [monthlyExpenses, selectedDate]
  );

  // Total monthly expenses
  const totalMonthlyExpenses = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Category wise totals
  const categoryTotals = useMemo(
    () =>
      monthlyExpenses.reduce<Record<string, number>>((acc, expense) => {
        const key = normalizeToKnownCategory(expense.category);
        acc[key] = (acc[key] || 0) + expense.amount;
        return acc;
      }, {}),
    [monthlyExpenses]
  );

  // Calendar grid for viewMonth
  const calendarDays = useMemo(() => {
    const [year, monthNum] = viewMonth.split("-").map(Number);
    const firstDay = new Date(year, monthNum - 1, 1).getDay();
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    const days: { day: number | null; date: string | null }[] = [];

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, date: dateStr });
    }

    return days;
  }, [viewMonth]);

  const goPrevMonth = () => {
    const [y, m] = viewMonth.split("-").map(Number);
    const prevMonth = m === 1 ? 12 : m - 1;
    const prevYear = m === 1 ? y - 1 : y;
    setViewMonth(`${prevYear}-${String(prevMonth).padStart(2, "0")}`);
    setSelectedDate(null);
  };

  const goNextMonth = () => {
    const [y, m] = viewMonth.split("-").map(Number);
    const nextMonth = m === 12 ? 1 : m + 1;
    const nextYear = m === 12 ? y + 1 : y;
    setViewMonth(`${nextYear}-${String(nextMonth).padStart(2, "0")}`);
    setSelectedDate(null);
  };

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const localeString = locale === "hi" ? "hi-IN" : locale === "mr" ? "mr-IN" : "en-US";
    return d.toLocaleDateString(localeString, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6 overflow-hidden">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{t("monthlySummary.title")}</h2>
      <p className="mb-4 sm:mb-6 text-sm sm:text-base">
        <strong>{t("monthlySummary.totalExpenses")}:</strong> {totalMonthlyExpenses}
      </p>

      {/* Calendar toggle */}
      <button
        onClick={() => setCalendarOpen((prev) => !prev)}
        className="flex items-center justify-center sm:justify-start gap-2 mb-4 w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
        aria-label={
          calendarOpen
            ? t("monthlySummary.calendar.close")
            : t("monthlySummary.calendar.open")
        }
      >
        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>
          {calendarOpen
            ? t("monthlySummary.calendar.close")
            : t("monthlySummary.calendar.open")}
        </span>
      </button>

      {/* Calendar */}
      {calendarOpen && (
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4 min-w-[260px]">
            <button
              onClick={goPrevMonth}
              className="p-2 rounded hover:bg-gray-100 transition-colors shrink-0 touch-manipulation"
              aria-label={t("monthlySummary.calendar.previousMonth")}
            >
              ←
            </button>
            <h3 className="font-medium text-sm sm:text-base min-w-[140px] sm:min-w-[180px] text-center">
              {MONTHS[parseInt(viewMonth.split("-")[1], 10) - 1]} {viewMonth.split("-")[0]}
            </h3>
            <button
              onClick={goNextMonth}
              className="p-2 rounded hover:bg-gray-100 transition-colors shrink-0 touch-manipulation"
              aria-label={t("monthlySummary.calendar.nextMonth")}
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs sm:text-sm min-w-[260px]">
            {WEEKDAYS.map((w, idx) => (
              <div key={idx} className="py-1 font-medium text-muted-foreground truncate">
                <span className="sm:hidden">{w[0]}</span>
                <span className="hidden sm:inline">{w}</span>
              </div>
            ))}
            {calendarDays.map(({ day, date }, i) => (
              <button
                key={i}
                onClick={() => date && setSelectedDate(selectedDate === date ? null : date)}
                disabled={!day}
                className={`
                  min-h-8 sm:min-h-12 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors flex flex-col items-center justify-center touch-manipulation
                  ${!day ? "invisible" : ""}
                  ${date && dateTotals[date] ? "font-semibold" : "text-muted-foreground"}
                  ${selectedDate === date ? "bg-gray-900 text-white" : "hover:bg-gray-100 active:bg-gray-200"}
                  ${date && dateTotals[date] && selectedDate !== date ? "bg-amber-50" : ""}
                `}
              >
                {day ?? ""}
                {date && dateTotals[date] && (
                  <span className="text-[9px] sm:text-[10px] opacity-80 mt-0.5">{dateTotals[date]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date-wise expenses */}
      {selectedDate && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm sm:text-base font-medium mb-3">
            {t("monthlySummary.title")} {formatDisplayDate(selectedDate)}
          </h3>
          {selectedDateExpenses.length === 0 ? (
            <p className="text-muted-foreground text-sm sm:text-base">{t("monthlySummary.noData")}</p>
          ) : (
            <ul className="space-y-2">
              {selectedDateExpenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">
                      {t(
                        `expenseForm.categories.${normalizeToKnownCategory(
                          expense.category
                        )}`
                      )}
                    </span>
                    {expense.note && (
                      <span className="text-muted-foreground text-sm sm:ml-2 block sm:inline truncate">
                        — {expense.note}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 font-medium">{expense.amount}</span>
                </li>
              ))}
              <li className="flex justify-between pt-2 font-semibold text-sm sm:text-base">
                <span>{t("expenseList.total")}</span>
                <span>{dateTotals[selectedDate]}</span>
              </li>
            </ul>
          )}
        </div>
      )}

      {/* Category breakdown */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm sm:text-base font-medium mb-2">{t("monthlySummary.categoryBreakdown")}</h3>
        {Object.keys(categoryTotals).length === 0 ? (
          <p className="text-muted-foreground text-sm sm:text-base">{t("monthlySummary.noData")}</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <li
                key={category}
                className="flex justify-between gap-4 py-1 border-b border-gray-100 last:border-0 text-sm sm:text-base min-w-0"
              >
                <span className="truncate">{t(`expenseForm.categories.${category}`)}</span>
                <span className="shrink-0">{amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}