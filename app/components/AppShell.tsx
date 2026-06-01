import { ReactNode } from "react";

type AppShellProps = {
  header: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AppShell({ header, children, className = "" }: AppShellProps) {
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden bg-gray-50 ${className}`}
    >
      {header}
      <main className="app-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
        {children}
      </main>
    </div>
  );
}
