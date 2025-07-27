import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

const pieData = [
  { name: "Total Hired", value: 54, trend: "up" },
  { name: "Total Pending", value: 26, trend: "up" },
  { name: "Total Canceled", value: 20, trend: "down" },
];
const COLORS = ["#F4B400", "#4285F4", "#EA4335"];

const TrendArrow = ({ trend }: { trend: string }) => {
  if (trend === "up") {
    return (
      <svg className="w-4 h-4 text-green-500 inline ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
    );
  } else if (trend === "down") {
    return (
      <svg className="w-4 h-4 text-red-500 inline ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
    );
  } else {
    return null;
  }
};

// Custom label function
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {`${pieData[index].value}%`}
    </text>
  );
};

const PieChartComponent = () => {
  return (
    <div style={{ width: "150px", height: 250 }} className="flex flex-col items-start">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={pieData}
            cx="150px"
            cy="50%"
            labelLine={false}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Custom Legend */}
      <div className="flex flex-col gap-0.5 mt-4 items-start">
        {pieData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center text-sm">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[idx] }}
            ></span>
            <span className="font-medium text-gray-700 mr-2 min-w-[90px]">{entry.name}</span>
            <span className="flex items-center">
              <span className="text-gray-700 font-semibold">{entry.value}%</span>
              <TrendArrow trend={entry.trend} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartComponent; 