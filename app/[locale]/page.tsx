"use client";
import { useEffect, useState } from "react";
import { Expense } from "../types/expense";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import MonthlySummary from "../components/MonthlySummary";
import { getExpenses } from "../utils/storage";
import Header, { ActiveSection } from "../components/Header";

export default function Page() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  // Load expenses from backend
  useEffect(() => {
    const loadExpenses = async () => {
      const data = await getExpenses();
      setExpenses(data);
    };
    loadExpenses();
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 min-h-screen">
      <Header activeSection={activeSection} onSectionClick={setActiveSection} />
      {activeSection === "add" && (
        <ExpenseForm setExpenses={setExpenses} />
      )}
      {activeSection === "summary" && (
        <MonthlySummary expenses={expenses} month={currentMonth} />
      )}
      {activeSection === "list" && (
        <ExpenseList expenses={expenses} setExpenses={setExpenses} />
      )}
    </main>
  );
}
