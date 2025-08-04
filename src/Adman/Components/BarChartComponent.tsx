import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const barData = [
  { name: "1", revenue: 400, comp: 240 },
  { name: "2", revenue: 300, comp: 139 },
  { name: "3", revenue: 200, comp: 980 },
  { name: "4", revenue: 278, comp: 390 },
  { name: "5", revenue: 189, comp: 480 },
  { name: "6", revenue: 239, comp: 380 },
  { name: "7", revenue: 349, comp: 430 },
  { name: "8", revenue: 200, comp: 210 },
  { name: "9", revenue: 278, comp: 390 },
  { name: "10", revenue: 189, comp: 480 },
  { name: "11", revenue: 239, comp: 380 },
  { name: "12", revenue: 349, comp: 430 },
  { name: "13", revenue: 400, comp: 240 },
  { name: "14", revenue: 300, comp: 139 },
  { name: "15", revenue: 200, comp: 980 },
  { name: "16", revenue: 278, comp: 390 },
  { name: "17", revenue: 189, comp: 480 },
  { name: "18", revenue: 239, comp: 380 },
  { name: "19", revenue: 349, comp: 430 },
  { name: "20", revenue: 200, comp: 210 },
  { name: "21", revenue: 278, comp: 390 },
  { name: "22", revenue: 189, comp: 480 },
  { name: "23", revenue: 239, comp: 380 },
  { name: "24", revenue: 349, comp: 430 },
  { name: "25", revenue: 400, comp: 240 },
  { name: "26", revenue: 300, comp: 139 },
  { name: "27", revenue: 200, comp: 980 },
  { name: "28", revenue: 278, comp: 390 },
  { name: "29", revenue: 189, comp: 480 },
  { name: "30", revenue: 239, comp: 380 },
  { name: "31", revenue: 349, comp: 430 },
];

const BarChartComponent = () => {
  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={barData}
          margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          barSize={8}
          barCategoryGap="20%"
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#E6911E" name="Total revenue" stackId="a" radius={[0,0,0,0]} />
          <Bar dataKey="comp" fill="#8B919E" name="Total comp" stackId="a" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent; 