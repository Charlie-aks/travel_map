"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface VisitorChartProps {
  data?: { name: string; locations: number; reviews: number }[];
}

export function VisitorChart({ data }: VisitorChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { name: "Mon", locations: 0, reviews: 0 },
    { name: "Tue", locations: 0, reviews: 0 },
    { name: "Wed", locations: 0, reviews: 0 }
  ];

  return (
    <div className="w-full h-full min-h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLocs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3076cc" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3076cc" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#0c2b48' }}
          />
          <Area 
            type="monotone" 
            dataKey="locations" 
            stroke="#3076cc" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorLocs)" 
            name="Locations"
          />
          <Area 
            type="monotone" 
            dataKey="reviews" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevs)" 
            name="Reviews"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
