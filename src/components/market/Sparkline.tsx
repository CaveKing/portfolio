"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  positive: boolean;
}

export function Sparkline({ data, positive }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div className="h-10 w-full" />;
  }

  const chartData = data.map((value, index) => ({ index, value }));
  const color = positive ? "#1fb35a" : "#e0352b";
  const gradientId = positive ? "spark-up" : "spark-down";

  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
