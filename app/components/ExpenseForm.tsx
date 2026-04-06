"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { useExpense } from "../context/ExpenseContext";

export default function ExpenseForm() {
  const t = useTranslations();
  const { addNewExpense, loading: contextLoading } = useExpense();

  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setNote("");
  };

  const handleAddExpense = async () => {
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

    try {
      setLoading(true);

      const result = await addNewExpense({
        amount: Number(amount),
        category,
        note,
        date: new Date().toISOString().slice(0, 10),
      });

      if (!result) {
        throw new Error("Failed to save expense");
      }

      setSuccess(t("expenseForm.success"));
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving expense"
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    }
  };

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-4">
        {t("expenseTracker.addExpense")}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <section className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-end">
        {/* Amount */}
        <div className="flex flex-col gap-2 flex-1 sm:w-auto">
          <label className="text-sm font-medium">
            {t("expenseTracker.amount")}
          </label>
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

        {/* Category */}
        <div className="flex flex-col gap-2 flex-1 sm:w-auto">
          <label className="text-sm font-medium">
            {t("expenseTracker.category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">
              {t("expenseForm.selectCategory")}
            </option>
            <option value="food">{t("expenseForm.categories.food")}</option>
            <option value="transport">{t("expenseForm.categories.transport")}</option>
            <option value="entertainment">{t("expenseForm.categories.entertainment")}</option>
            <option value="utilities">{t("expenseForm.categories.utilities")}</option>
            <option value="shopping">{t("expenseForm.categories.shopping")}</option>
            <option value="other">{t("expenseForm.categories.other")}</option>
          </select>
        </div>

        {/* Note */}
        <div className="flex flex-col gap-2 flex-1 sm:min-w-48">
          <label className="text-sm font-medium">
            {t("expenseForm.description")}
          </label>
          <input
            placeholder={t("expenseForm.descriptionPlaceholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleAddExpense}
          disabled={loading || contextLoading}
          className={`px-4 py-2 rounded-md font-medium w-full sm:w-auto transition-colors ${
            loading || contextLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {loading ? "Saving..." : t("expenseTracker.save")}
        </button>
      </section>
    </Card>
  );
}