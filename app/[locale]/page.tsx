"use client";
import { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import MonthlySummary from "../components/MonthlySummary";
import BudgetDisplay from "../components/BudgetDisplay";
import ExpenseChartsDashboard from "../components/charts/ExpenseChartsDashboard";
import Header, { ActiveSection } from "../components/Header";
import { useExpense } from "../context/ExpenseContext";

export default function Page() {
  const { expenses } = useExpense();
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 min-h-screen">
      <Header activeSection={activeSection} onSectionClick={setActiveSection} />
     { activeSection=== null && <ExpenseChartsDashboard  />}
      {activeSection === "add" && <ExpenseForm />}
      {activeSection === "summary" && (
        <>
          <BudgetDisplay month={currentMonth} />
          <MonthlySummary month={currentMonth} />
        </>
      )}
      {activeSection === "list" && <ExpenseList />}
    </main>
  );
}
