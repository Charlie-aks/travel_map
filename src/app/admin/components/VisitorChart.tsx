"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "MAY", visitors: 4000 },
  { name: "JUN", visitors: 3000 },
  { name: "JUL", visitors: 5000 },
  { name: "AUG", visitors: 4500 },
  { name: "SEP", visitors: 6000 },
  { name: "OCT", visitors: 8000 },
];

export function VisitorChart() {
  return (
    <div className="w-full h-full min-h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#0c2b48' }}
          />
          <Area 
            type="monotone" 
            dataKey="visitors" 
            stroke="var(--primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorVisitors)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
