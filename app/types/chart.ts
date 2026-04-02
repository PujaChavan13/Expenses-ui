export type TimeFilter = "weekly" | "monthly" | "yearly";

export type TrendPoint = {
  label: string;
  total: number;
};

export type CategoryPoint = {
  category: string;
  total: number;
};

export type ChartState = {
  filter: TimeFilter;
  selectedYear?: number;
};

