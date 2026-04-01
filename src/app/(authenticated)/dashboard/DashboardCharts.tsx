"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; weight: number }[];
}

export default function DashboardCharts({ data }: Props) {
  const chartData =
    data.length === 1
      ? [
          { date: "Start", weight: data[0].weight },
          { date: "Today", weight: data[0].weight },
        ]
      : data.map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          weight: d.weight,
        }));

  return (
    <div className="w-full flex-grow min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#d1d5db"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            stroke="#d1d5db"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
              fontSize: "13px",
            }}
            itemStyle={{ color: "#111111", fontWeight: "bold" }}
            labelStyle={{ color: "#9ca3af", marginBottom: "4px", fontSize: "11px" }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            name="Weight (kg)"
            stroke="#c1ff00"
            strokeWidth={3}
            dot={{ fill: "#c1ff00", r: 5, strokeWidth: 2, stroke: "#ffffff" }}
            activeDot={{ r: 7, strokeWidth: 0, fill: "#a9e000" }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
