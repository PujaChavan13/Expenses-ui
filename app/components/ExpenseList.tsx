"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { Expense } from "../types/expense";
import { Card } from "@/components/ui/card";

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

type Props = {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
};

export default function ExpenseList({ expenses, setExpenses }: Props) {
  const t = useTranslations();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState<number | "">("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount);
    setEditCategory(normalizeToKnownCategory(expense.category));
    setEditNote(expense.note || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditCategory("");
    setEditNote("");
  };

  const saveEdit = () => {
    if (editingId === null || editAmount === "") return;
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === editingId
          ? {
              ...e,
              amount: Number(editAmount),
              category: normalizeToKnownCategory(editCategory),
              note: editNote,
            }
          : e
      )
    );
    cancelEdit();
  };

  const handleDelete = (id: number) => {
    if (confirm(t("expenseList.confirmDelete"))) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (expenses.length === 0) {
    return (
      <Card className="mb-4 sm:mb-6 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">{t("expenseList.title")}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t("expenseList.empty")}</p>
      </Card>
    );
  }

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6 overflow-x-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{t("expenseList.title")}</h2>
      <ul className="space-y-2 min-w-0">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="py-3 border-b border-gray-100 last:border-0"
          >
            {editingId === expense.id ? (
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end">
                <div className="flex flex-col gap-1 sm:w-24">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t("expenseList.amount")}
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) =>
                      setEditAmount(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:w-36">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t("expenseList.category")}
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {t(`expenseForm.categories.${cat}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t("expenseForm.description")}
                  </label>
                  <input
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder={t("expenseForm.descriptionPlaceholder")}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
                  >
                    {t("expenseTracker.save")}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
                  >
                    {t("expenseForm.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
                <div className="flex justify-between sm:block gap-2">
                  <span className="font-medium sm:w-20">{expense.amount}</span>
                  <span className="sm:w-32">
                    {t(
                      `expenseForm.categories.${normalizeToKnownCategory(
                        expense.category
                      )}`
                    )}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm truncate flex-1 min-w-0">
                  {expense.note || "-"}
                </span>
                <div className="flex gap-2 mt-2 sm:mt-0 shrink-0">
                  <button
                    onClick={() => startEdit(expense)}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    {t("expenseList.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                  >
                    {t("expenseList.delete")}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}