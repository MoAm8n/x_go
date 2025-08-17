import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import PieChartComponent from "../Components/PieChartComponent";
import StatCard from "../Components/StatCard";
import { Car, CalendarDays, ShieldCheck } from "lucide-react";
import { API_URL } from "../../context/api/Api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function DashboardStatisics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("tokenAdman");
  const { t } = useTranslation(); // Hook للترجمة

  useEffect(() => {
    if (!token) {
      setError(t("Statisics.no_token"));
      toast.error(t("Statisics.no_token"), { toastId: "no-token" });
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/dashboard/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("استجابة الـ API الكاملة:", res);
        if (res.data) {
          setData(res.data);
          toast.success(t("Statisics.data_loaded"), { toastId: "data-loaded" });
        } else {
          setError(t("Statisics.invalid_data_structure"));
          toast.error(t("Statisics.invalid_data_structure"), { toastId: "invalid-data" });
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setError(t("Statisics.error", { message: errorMessage }));
        toast.error(t("Statisics.error", { message: errorMessage }), { toastId: "api-error" });
        console.error("خطأ في جلب البيانات:", error.response || error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t]); // إضافة t كـ dependency عشان يتغير مع اللغة

  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-2 md:px-10 pt-10">
          {loading ? (
            <div className="text-center py-10">{t("Statisics.loading")}</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : data ? (
            <div className="flex flex-col items-center p-8 mb-8 m-auto">
              {/* البطاقات */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 w-full mb-10">
                <StatCard
                  icon={<CalendarDays size={28} />}
                  title={t("Statisics.total_rented_days")}
                  value={data.total_rented_days.toLocaleString()}
                />
                <StatCard
                  icon={<Car size={40} />}
                  title={t("Statisics.total_rented")}
                  value={data.total_rented.toLocaleString()}
                />
                <StatCard
                  icon={<ShieldCheck size={28} />}
                  title={t("Statisics.total_revenue")}
                  value={`${data.total_revenue.toLocaleString()} $`}
                />
              </div>
              {/* الدائرة */}
              <div className="flex flex-col justify-center items-center h-52 mt-12 w-full">
                <PieChartComponent
                  data={{
                    labels: [
                      t("Statisics.total_rented_days"),
                      t("Statisics.total_rented"),
                      t("Statisics.total_revenue"),
                    ],
                    datasets: [
                      {
                        data: [data.total_rented_days, data.total_rented, data.total_revenue],
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                      },
                    ],
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-10">{t("Statisics.no_data")}</div>
          )}
        </div>
      </div>
    </div>
  );
}