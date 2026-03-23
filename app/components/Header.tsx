"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type ActiveSection = "add" | "summary" | "list" | null;

type HeaderProps = {
  activeSection: ActiveSection;
  onSectionClick: (section: ActiveSection) => void;
};

export default function Header({ activeSection, onSectionClick }: HeaderProps) {
  const navClass = (section: ActiveSection) =>
    `cursor-pointer transition-colors ${
      activeSection === section ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <Card className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 sm:px-6">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Expense Tracker</h1>

        <nav className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
          <span
            onClick={() => onSectionClick(activeSection === "add" ? null : "add")}
            className={navClass("add")}
          >
            Add Expenses
          </span>
          <span
            onClick={() => onSectionClick(activeSection === "summary" ? null : "summary")}
            className={navClass("summary")}
          >
            Monthly Summary
          </span>
          <span
            onClick={() => onSectionClick(activeSection === "list" ? null : "list")}
            className={navClass("list")}
          >
            Expense List
          </span>
        </nav>
      </div>
      <Separator />
    </Card>
  );
}