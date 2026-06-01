"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { useExpense } from "../context/ExpenseContext";

interface BudgetDisplayProps {
  month: string; // Format: "YYYY-MM"
}

export default function BudgetDisplay({ month }: BudgetDisplayProps) {
  const t = useTranslations();
  const { expenses, monthlyBudget, budgetLoading, fetchBudget, updateBudget } = useExpense();

  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [year, monthNum] = month.split("-").map(Number);

  // Fetch budget when month changes
  useEffect(() => {
    fetchBudget(year, monthNum);
  }, [month, fetchBudget, year, monthNum]);

  // Calculate monthly spent amount
  const spentAmount = useMemo(() => {
    return expenses
      .filter((expense) => expense.date.startsWith(month))
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses, month]);

  // Calculate remaining balance
  const remainingAmount = monthlyBudget ? monthlyBudget - spentAmount : null;

  // Calculate percentage spent
  const percentageSpent = monthlyBudget
    ? Math.min((spentAmount / monthlyBudget) * 100, 100)
    : 0;

  // Determine color based on spending
  const getStatusColor = () => {
    if (!monthlyBudget) return "bg-gray-300";
    if (percentageSpent <= 50) return "bg-green-500";
    if (percentageSpent <= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleEditBudget = () => {
    setBudgetInput(monthlyBudget?.toString() || "");
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleSaveBudget = async () => {
    if (!budgetInput || budgetInput.trim() === "") {
      setError("Budget amount is required");
      return;
    }

    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    try {
      setError("");
      await updateBudget(year, monthNum, amount);
      setSuccess(t("budget.updateSuccess") || "Budget updated successfully");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update budget";
      setError(errorMsg);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setBudgetInput("");
  };

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-base sm:text-lg font-semibold mb-3">
            {t("budget.title") || "Monthly Budget"}
          </h2>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-3 p-2 sm:p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-2 sm:p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  {t("budget.setAmount") || "Set Budget Amount"}
                </label>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter budget amount"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBudget}
                  disabled={budgetLoading}
                  className="px-3 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {budgetLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {monthlyBudget !== null ? (
                <>
                  {/* Budget Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("budget.setBudget") || "Budget"}
                      </p>
                      <p className="text-lg sm:text-xl font-semibold">
                        ₹{monthlyBudget.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("budget.spent") || "Spent"}
                      </p>
                      <p className="text-lg sm:text-xl font-semibold text-red-600">
                        ₹{spentAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-3 rounded ${remainingAmount !== null && remainingAmount >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("budget.remaining") || "Remaining"}
                      </p>
                      <p className={`text-lg sm:text-xl font-semibold ${remainingAmount !== null && remainingAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ₹{remainingAmount !== null ? Math.abs(remainingAmount).toFixed(2) : "0.00"}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStatusColor()}`}
                      style={{ width: `${percentageSpent}%` }}
                    />
                  </div>

                  {/* Percentage Text */}
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {percentageSpent.toFixed(1)}% of budget spent
                    {remainingAmount !== null && remainingAmount < 0 && (
                      <span className="text-red-600 font-semibold ml-1">
                        (₹{Math.abs(remainingAmount).toFixed(2)} over budget)
                      </span>
                    )}
                  </p>

                  {/* Edit Button */}
                  <button
                    onClick={handleEditBudget}
                    className="mt-3 w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    {t("budget.edit") || "Edit Budget"}
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    {t("budget.noBudget") || "No budget set for this month"}
                  </p>
                  <button
                    onClick={handleEditBudget}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                  >
                    {t("budget.setBudget") || "Set Budget"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
