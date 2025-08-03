import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { API_URL } from "../../context/api/Api";
import axios from "axios";

const COLORS = ["#F4B400", "#4285F4", "#EA4335", "#00C4B4"];

const TrendArrow = ({ trend }) => {
  if (trend === "up") {
    return (
      <svg
        className="w-4 h-4 text-green-500 inline ml-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    );
  } else if (trend === "down") {
    return (
      <svg
        className="w-4 h-4 text-red-500 inline ml-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComponent = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("tokenAdman");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => {
        console.error("خطأ في جلب الإحصائيات:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>جاري التحميل...</p>;
  if (!stats) return <p>لا توجد بيانات متاحة</p>;

  // تحويل البيانات لنسب مئوية
  const total = stats.initiated + stats.assigned + stats.canceled + stats.completed;
  const pieData = [
    { name: "مبدأ", value: (stats.initiated / total) * 100, trend: "up" },
    { name: "معين", value: (stats.assigned / total) * 100, trend: "up" },
    { name: "ملغي", value: (stats.canceled / total) * 100, trend: "down" },
    { name: "مكتمل", value: (stats.completed / total) * 100, trend: "up" },
  ];

  return (
    <div style={{ width: "300px", height: 350 }} className="flex flex-col justify-center  items-center">
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
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
      <div className="flex flex-col gap-0.5 mt-4 items-start">
        {pieData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center text-sm">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[idx] }}
            ></span>
            <span className="font-medium text-gray-700 mr-2 min-w-[90px]">
              {entry.name}
            </span>
            <span className="flex items-center">
              <span className="text-gray-700 font-semibold">
                {entry.value.toFixed(1)}%
              </span>
              <TrendArrow trend={entry.trend} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartComponent;