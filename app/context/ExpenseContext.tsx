"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Expense } from "../types/expense";
import {getExpenses, addExpense,deleteExpense,updateExpense,getBudget,setBudget,
} from "../services/storage";

type ExpenseContextType = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  monthlyBudget: number | null;
  budgetLoading: boolean;
  fetchExpenses: () => Promise<void>;
  addNewExpense: (data: Omit<Expense, "_id">) => Promise<Expense | null>;
  deleteExpenseById: (id: string) => Promise<void>;
  updateExpenseById: (id: string, data: Partial<Expense>) => Promise<void>;
  fetchBudget: (year: number, month: number) => Promise<void>;
  updateBudget: (year: number, month: number, amount: number) => Promise<void>;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch expenses";
      setError(errorMsg);
      console.error("Fetch expenses error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch budget for a specific month
  const fetchBudget = async (year: number, month: number) => {
    try {
      setBudgetLoading(true);
      setError(null);
      const budgetData = await getBudget(year, month);
      setMonthlyBudget(budgetData?.amount ?? null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch budget";
      setError(errorMsg);
      console.error("Fetch budget error:", err);
    } finally {
      setBudgetLoading(false);
    }
  };

  // Update budget for a specific month
  const updateBudget = async (year: number, month: number, amount: number) => {
    try {
      setBudgetLoading(true);
      setError(null);
      const budgetData = await setBudget(year, month, amount);
      setMonthlyBudget(budgetData.amount);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update budget";
      setError(errorMsg);
      console.error("Update budget error:", err);
      throw err;
    } finally {
      setBudgetLoading(false);
    }
  };

  // Add new expense
  const addNewExpense = async (data: Omit<Expense, "_id">) => {
    try {
      setError(null);
      const savedExpense = await addExpense(data);
      if (savedExpense) {
        setExpenses((prev) => [...prev, savedExpense]);
      }
      return savedExpense;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add expense";
      setError(errorMsg);
      console.error("Add expense error:", err);
      return null;
    }
  };

  // Delete expense
  const deleteExpenseById = async (id: string) => {
    try {
      setError(null);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete expense";
      setError(errorMsg);
      console.error("Delete expense error:", err);
      throw err;
    }
  };

  // Update expense
  const updateExpenseById = async (id: string, data: Partial<Expense>) => {
    try {
      setError(null);
      await updateExpense(id, data);
      setExpenses((prev) =>
        prev.map((e) => (e._id === id ? { ...e, ...data } : e))
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update expense";
      setError(errorMsg);
      console.error("Update expense error:", err);
      throw err;
    }
  };

  // Fetch expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const value: ExpenseContextType = {
    expenses,
    loading,
    error,
    monthlyBudget,
    budgetLoading,
    fetchExpenses,
    addNewExpense,
    deleteExpenseById,
    updateExpenseById,
    fetchBudget,
    updateBudget,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use expense context
export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within ExpenseProvider");
  }
  return context;
};