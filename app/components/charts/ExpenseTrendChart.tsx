"use client";

import { TrendPoint } from "@/app/types/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ExpenseTrendChartProps = {
  data: TrendPoint[];
};

export default function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: "0.5rem", borderColor: "#d1d5db" }}
            formatter={(value) => [String(value ?? 0), "Amount"]}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#111827"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

