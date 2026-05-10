"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/app/context/AuthContext";

export type ActiveSection = "add" | "summary" | "list" | "dashboard" | null;

type HeaderProps = {
  activeSection: ActiveSection;
  onSectionClick: (section: ActiveSection) => void;
};

export default function Header({ activeSection, onSectionClick }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navClass = (section: ActiveSection) =>
    `cursor-pointer transition-colors ${
      activeSection === section ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
    }`;

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 sm:px-6">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight">{t("expenseTracker.title")}</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <nav className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
            <span 
            onClick={() => onSectionClick(activeSection === "dashboard" ? null : "dashboard")}
             className={navClass("dashboard")}
             >
              {t("dashboard.title")}
            </span>
            <span
              onClick={() => onSectionClick(activeSection === "add" ? null : "add")}
              className={navClass("add")}
            >
              {t("expenseTracker.addExpense")}
            </span>
            <span
              onClick={() => onSectionClick(activeSection === "summary" ? null : "summary")}
              className={navClass("summary")}
            >
              {t("monthlySummary.title")}
            </span>
            <span
              onClick={() => onSectionClick(activeSection === "list" ? null : "list")}
              className={navClass("list")}
            >
              {t("expenseList.title")}
            </span>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      <Separator />
    </Card>
  );
}