"use client";
import { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import MonthlySummary from "../components/MonthlySummary";
import BudgetDisplay from "../components/BudgetDisplay";
import ExpenseChartsDashboard from "../components/charts/ExpenseChartsDashboard";
import Header, { ActiveSection } from "../components/Header";
import AppShell from "../components/AppShell";
import { useExpense } from "../context/ExpenseContext";

export default function Page() {
  const { expenses } = useExpense();
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <AppShell
      header={
        <Header activeSection={activeSection} onSectionClick={setActiveSection} />
      }
    >
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {activeSection === "dashboard" && <ExpenseChartsDashboard />}
        {activeSection === "add" && <ExpenseForm />}
        {activeSection === "summary" && (
          <>
            <BudgetDisplay month={currentMonth} />
            <MonthlySummary month={currentMonth} />
          </>
        )}
        {activeSection === "list" && <ExpenseList />}
      </div>
    </AppShell>
  );
}
  

