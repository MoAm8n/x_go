import React, { useState, useEffect } from "react";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import StatCard from "../Components/StatCard";
import { Briefcase, Car, CheckCircle, XCircle, Clock } from "lucide-react";
import { API_URL } from "../../context/api/Api";
import axios from "axios";

// 1. عرف نوع بيانات الحجز
interface BookingType {
  car: string;
  amount: string;
  price: string;
  status: string;
  date: string;
}

function getStatusBadge(status: string) {
  if (status === "Success")
    return (
      <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
        <CheckCircle size={16} /> Success
      </span>
    );
  if (status === "Processing")
    return (
      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
        <Clock size={16} /> Processing
      </span>
    );
  if (status === "Failed")
    return (
      <span className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
        <XCircle size={16} /> Failed
      </span>
    );
  return null;
}

const TABS = [
  { label: "Confirmed Bookings", color: "#28C76F", key: "confirmed" },
  { label: "Processing Bookings", color: "#F4A825", key: "processing" },
  { label: "Completed Bookings", color: "#00CFE8", key: "completed" },
  { label: "Canceled Bookings", color: "#6C757D", key: "canceled" },
  { label: "Booking Details", color: "#007bff", key: "details" },
];

// 2. عرف نوع باراميتر الدالة
async function fetchBookings(tabKey: string): Promise<BookingType[]> {
  let url = "";
  if (tabKey === "confirmed") url = "/api/admin/Confirmed-Booking";
  else if (tabKey === "completed") url = "/api/admin/Completed-Booking";
  else if (tabKey === "canceled") url = "/api/admin/Canceled-Booking";
  else if (tabKey === "processing") url = "/api/admin/Driver-Assigned-Booking";
  else if (tabKey === "details") url = "/api/admin/bookingDetails";
  else url = "/api/admin/Confirmed-Booking";

  const response = await axios.get(url);
  // 3. أرجع فقط data.data (حسب استجابة API)
  return response.data.data || [];
}

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState<string>("confirmed");
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchBookings(activeTab)
      .then((data) => setBookings(data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [activeTab]);
  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1  px-2 md:px-10">
          <h1 className="font-bold text-3xl mb-2 ">Welcome Back</h1>
          <p className="text-[#b0b0b0] text-sm font-Poppins">
            Get your latest update for the last 7 days
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4  gap-4 pt-10 ">
            <StatCard
              icon={<Briefcase size={40} />}
              title="Total Revenue"
              value="9.587"
            />
            <StatCard
              icon={<Car size={40} />}
              title="Total Revenue"
              value="9.587"
            />
            <StatCard
              icon={<Briefcase size={40} />}
              title="Total Revenue"
              value="9.587"
            />
            <StatCard
              icon={<Briefcase size={40} />}
              title="Total Revenue"
              value="9.587"
            />
          </div>

          {/* Tabs */}
          <div className="px-3 pt-6 pb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-sm mb-1 font-medium transition-all rounded 
                  ${
                    activeTab === tab.key
                      ? "bg-[#FAF7F2] py-2 md:py-2 shadow font-semibold"
                      : "  "
                  }
                `}
                style={{ color: tab.color }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* جدول واحد فقط */}
          <div className="rounded-xl">
            <table className="min-w-full text-left rounded-xl overflow-hidden mb-10">
              <thead>
                <tr className="text-[#8B919E] bg-[#FAF7F2] text-xs font-bold">
                  <th className="py-5 px-6 rounded-tl-xl">CAR</th>
                  <th className="py-2 px-6">PAYMENT AMOUNT</th>
                  <th className="py-2 px-6">PRICE/DAY</th>
                  <th className="py-2 px-6">STATUS</th>
                  <th className="py-2 px-6 rounded-tr-xl">DATE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        <svg
                          className="animate-spin h-12 w-12 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        <span className="font-bold text-xl">جاري التحميل...</span>
                      </div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                        <svg
                          className="h-12 w-12 text-gray-400 "
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14v2m0 4h.01"
                          />
                        </svg>
                        <span className="font-bold text-xl">لا توجد بيانات</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((b, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-3 px-6">{b.car}</td>
                      <td className="py-3 px-6">{b.amount}</td>
                      <td className="py-3 px-6">{b.price}</td>
                      <td className="py-3 px-6">{getStatusBadge(b.status)}</td>
                      <td className="py-3 px-6">{b.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
