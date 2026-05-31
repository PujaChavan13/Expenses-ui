"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import{useExpense} from "@/app/context/ExpenseContext";
import {
  Wallet,
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  ListTodo,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/app/context/AuthContext";

export type ActiveSection = "add" | "summary" | "list" | "dashboard" | null;

type HeaderProps = {
  activeSection: ActiveSection;
  onSectionClick: (section: ActiveSection) => void;
};

const NavItem = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
      transition-all duration-200 ease-out
      ${
        isActive
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-gray-700 hover:bg-gray-100"
      }
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    `}
    aria-current={isActive ? "page" : undefined}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

export default function Header({ activeSection, onSectionClick }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { clearExpenses } = useExpense();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearExpenses();
    router.push(`/${locale}/login`);
  };

  const navItems = [
    {
      id: "dashboard" as const,
      label: t("dashboard.title"),
      icon: LayoutDashboard,
    },
    {
      id: "add" as const,
      label: t("expenseTracker.addExpense"),
      icon: PlusCircle,
    },
    {
      id: "summary" as const,
      label: t("monthlySummary.title"),
      icon: BarChart3,
    },
    {
      id: "list" as const,
      label: t("expenseList.title"),
      icon: ListTodo,
    },
  ];

  return (
    <header className="sticky top-0 z-50 shrink-0 w-full overflow-x-clip backdrop-blur-md bg-white/95 border-b border-gray-200 supports-[backdrop-filter]:bg-white/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:flex flex-col min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">
                {t("expenseTracker.title")}
              </h1>
              <p className="text-xs text-gray-500 truncate">
                {t("expenseTracker.title")}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeSection === item.id}
                onClick={() => onSectionClick(item.id)}
              />
            ))}
          </nav>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center gap-4 min-w-0">
            {user && (
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 min-w-0 max-w-[260px]">
                  <div className="flex flex-col gap-0 min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {user.name || user.email}
                    </span>
                    <span className="text-xs text-gray-500 truncate">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    bg-red-600 text-white font-medium text-sm
                    hover:bg-red-700 transition-all duration-200
                    shadow-md hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  "
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3 shrink-0">
            {user && <LanguageSwitcher />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                p-2 rounded-lg hover:bg-gray-100
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              "
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className="
              lg:hidden px-4 pb-4 space-y-2 overflow-x-hidden
              border-t border-gray-200
              animate-in slide-in-from-top-2 duration-200
            "
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionClick(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                  transition-all duration-200 ease-out
                  ${
                    activeSection === item.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            {user && (
              <>
                <div className="my-3 border-t border-gray-200" />
                <div className="px-4 py-3 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="
                    w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                    bg-red-600 text-white font-medium
                    hover:bg-red-700 transition-all duration-200
                    shadow-md hover:shadow-lg
                  "
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}