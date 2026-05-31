"use client";
import { useState } from "react";
import ExpenseForm from "@/app/components/ExpenseForm";
import ExpenseList from "@/app/components/ExpenseList";
import MonthlySummary from "@/app/components/MonthlySummary";
import BudgetDisplay from "@/app/components/BudgetDisplay";
import ExpenseChartsDashboard from "@/app/components/charts/ExpenseChartsDashboard";
import Header, { ActiveSection } from "@/app/components/Header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useExpense } from "@/app/context/ExpenseContext";

export default function DashboardPage() {
  const { expenses } = useExpense();
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <ProtectedRoute>
      <>
        <Header activeSection={activeSection} onSectionClick={setActiveSection} />
        <main className="max-w-5xl mx-auto p-4 sm:p-6 min-h-screen">
          {activeSection === "dashboard" && <ExpenseChartsDashboard />}
          {activeSection === "add" && <ExpenseForm />}
          {activeSection === "summary" && (
            <>
              <BudgetDisplay month={currentMonth} />
              <MonthlySummary month={currentMonth} />
            </>
          )}
          {activeSection === "list" && <ExpenseList />}
        </main>
      </>
    </ProtectedRoute>
  );
}
