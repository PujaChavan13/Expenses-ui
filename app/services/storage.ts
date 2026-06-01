import { Expense } from "../types/expense";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Only add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Merge with options headers if they exist
  if (options.headers && typeof options.headers === "object") {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if(res.status === 401) {
    localStorage.removeItem("authToken");
    // Redirect to login with locale prefix (default to 'en')
    const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "en" : "en";
    window.location.href = `/${locale}/login`;
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
   return res.json();
}
// ==================== EXPENSE APIs ====================

// Get all expenses
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const data = await fetchWithAuth(`${BASE_URL}/expenses`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return [];
  }
};

// Add expense
export const addExpense = async (expense: Omit<Expense, "_id">) => {
  try {
     return await fetchWithAuth(`${BASE_URL}/expenses`, {
      method: "POST",
      body: JSON.stringify(expense),
    });
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
    const res = await fetchWithAuth(`${BASE_URL}/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    });
  } catch (error) {
    console.error("Failed to update expense:", error);
  }
};

// Delete expense
export const deleteExpense = async (id: string) => {
  try {
   await fetchWithAuth(`${BASE_URL}/expenses/${id}`, {
      method: "DELETE",
    });
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
    return await fetchWithAuth(
      `${BASE_URL}/expenses/summary?month=${month}&year=${year}`
    );

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
    return await fetchWithAuth(`${BASE_URL}/budget/${year}/${month}`)
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
    return  await fetchWithAuth(`${BASE_URL}/budget/${year}/${month}`, {
      method: "PUT",
      body: JSON.stringify({ amount }),
    });
  } catch (error) {
    console.error("Failed to set budget:", error);
    throw error;
  }
};