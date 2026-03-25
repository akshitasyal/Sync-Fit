"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; weight: number }[];
}

export default function DashboardCharts({ data }: Props) {
  // Format for Recharts
  const chartData = data.length === 1 
    ? [ { date: "Start", weight: data[0].weight }, { date: "Today", weight: data[0].weight } ] 
    : data.map(d => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        weight: d.weight
      }));

  return (
    <div className="w-full flex-grow min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            domain={['dataMin - 2', 'dataMax + 2']} 
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            name="Weight (kg)"
            stroke="#10b981" 
            strokeWidth={4}
            dot={{ fill: '#10b981', r: 6, strokeWidth: 3, stroke: '#020617' }} 
            activeDot={{ r: 8, strokeWidth: 0, fill: '#34d399' }} 
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
