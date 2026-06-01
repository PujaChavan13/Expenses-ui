import { ReactNode } from "react";

type ScrollablePageProps = {
  children: ReactNode;
  className?: string;
};

export default function ScrollablePage({
  children,
  className = "",
}: ScrollablePageProps) {
  return (
    <div className={`app-scroll h-full min-h-0 overflow-y-auto overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}
