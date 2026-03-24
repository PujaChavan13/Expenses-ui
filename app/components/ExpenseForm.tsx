"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { Expense } from "../types/expense";
import { Card } from "@/components/ui/card";

type Props = {
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
};

export default function ExpenseForm({ setExpenses }: Props) {
  const t = useTranslations();
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleAddExpense = () => {
    setError("");
    setSuccess("");

    if (amount === "") {
      setError(t("expenseForm.errors.amountRequired"));
      return;
    }

    if (!category) {
      setError(t("expenseForm.errors.categoryRequired"));
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      amount: Number(amount),
      category,
      note,
      date: new Date().toISOString().slice(0, 10),
    };
    setExpenses((prev: Expense[]) => [...prev, newExpense]);

    // Show success message
    setSuccess(t("expenseForm.success"));

    // Reset form
    setAmount("");
    setCategory("");
    setNote("");

    // Clear messages after 3 seconds
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
  };

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{t("expenseTracker.addExpense")}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <section className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-end">
        <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-initial sm:w-auto">
          <label className="text-sm font-medium">{t("expenseTracker.amount")}</label>
          <input
            type="number"
            placeholder={t("expenseForm.amountPlaceholder")}
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-initial sm:w-auto">
          <label className="text-sm font-medium">{t("expenseTracker.category")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">{t("expenseForm.selectCategory")}</option>
            <option value="food">{t("expenseForm.categories.food")}</option>
            <option value="transport">{t("expenseForm.categories.transport")}</option>
            <option value="entertainment">{t("expenseForm.categories.entertainment")}</option>
            <option value="utilities">{t("expenseForm.categories.utilities")}</option>
            <option value="shopping">{t("expenseForm.categories.shopping")}</option>
            <option value="other">{t("expenseForm.categories.other")}</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-initial sm:min-w-48">
          <label className="text-sm font-medium">{t("expenseForm.description")}</label>
          <input
            placeholder={t("expenseForm.descriptionPlaceholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <button
          onClick={handleAddExpense}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium w-full sm:w-auto"
        >
          {t("expenseTracker.save")}
        </button>
      </section>
    </Card>
  );
}