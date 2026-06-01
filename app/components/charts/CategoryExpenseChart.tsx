"use client";

import { CategoryPoint } from "@/app/types/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CategoryExpenseChartProps = {
  data: CategoryPoint[];
};

export default function CategoryExpenseChart({ data }: CategoryExpenseChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: "0.5rem", borderColor: "#d1d5db" }}
            formatter={(value) => [String(value ?? 0), "Amount"]}
          />
          <Bar dataKey="total" fill="#374151" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

