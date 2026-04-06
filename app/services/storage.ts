import { Expense } from "../types/expense";

const BASE_URL = "http://localhost:5000/api";

// ==================== EXPENSE APIs ====================

// Get all expenses
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const res = await fetch(`${BASE_URL}/expenses`);
    if (!res.ok) {
      console.error(`API error: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return [];
  }
};

// Add expense
export const addExpense = async (expense: Omit<Expense, "_id">) => {
  try {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    if (!res.ok) {
      console.error(`API error: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to add expense:", error);
    return null;
  }
};

// Update expense
export const updateExpense = async (
  id: string,
  expense: Partial<Expense>
) => {
  try {
    const res = await fetch(`${BASE_URL}/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    if (!res.ok) {
      console.error(`API error: ${res.status}`);
    }
  } catch (error) {
    console.error("Failed to update expense:", error);
  }
};

// Delete expense
export const deleteExpense = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/expenses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error(`API error: ${res.status}`);
    }
  } catch (error) {
    console.error("Failed to delete expense:", error);
  }
};

// Monthly summary
export const getMonthlySummary = async (
  month: number,
  year: number
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/expenses/summary?month=${month}&year=${year}`
    );

    if (!res.ok) {
      console.error(`API error: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch monthly summary:", error);
    return null;
  }
};

// ==================== BUDGET APIs ====================

// Get budget
export const getBudget = async (
  year: number,
  month: number
): Promise<{ amount: number } | null> => {
  try {
    const res = await fetch(`${BASE_URL}/budget/${year}/${month}`);

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch budget:", error);
    throw error;
  }
};

// Set budget
export const setBudget = async (
  year: number,
  month: number,
  amount: number
): Promise<{ amount: number }> => {
  try {
    const res = await fetch(`${BASE_URL}/budget/${year}/${month}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to set budget:", error);
    throw error;
  }
};