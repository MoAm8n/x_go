import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CarFront,
  ClipboardList,
  ChartLine,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import axios from "axios";
import logo from "../../../public/images/logo.png";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function SidebarDashboard() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAdman")}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("tokenAdman");
        toast.success(t("sidebar_dashboard.logout_success"));
        navigate("/");
      } else {
        toast.error(t("sidebar_dashboard.logout_failed"));
        console.error(t("sidebar_dashboard.logout_failed_log"), response.data);
      }
    } catch (error) {
      toast.error(t("sidebar_dashboard.logout_error"));
      console.error(
        t("sidebar_dashboard.logout_error_log"),
        error.response?.data || error.message
      );
    } finally {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <button
        className="fixed top-3.5 left-4 z-20 lg:hidden bg-white p-2 rounded-full shadow-lg sidebar-toggle-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label={t("sidebar_dashboard.open_menu")}
      >
        <Menu size={24} />
      </button>

      <div
        className={`
          sidebar-dashboard
          h-screen w-full sm:w-64 bg-[#FAF7F2] z-40 px-4 sm:px-5 border-r border-gray-200
          fixed top-0 left-0 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:fixed lg:top-0 lg:left-0 lg:block
          overflow-y-auto
        `}
      >
        <div className="flex justify-end lg:hidden p-2">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label={t("sidebar_dashboard.close_menu")}
            className="p-2"
          >
            <X size={20} />
          </button>
        </div>
        <Link to="/" className="mx-auto mb-6 flex justify-center mt-4 sm:mt-5">
          <img src={logo} alt={t("sidebar_dashboard.logo_alt")} className="h-8 sm:h-10" />
        </Link>
        <div className="flex flex-col h-[82%]">
          <div className="flex flex-col gap-2 flex-grow">
            <p className="text-xs text-[#8B919E] px-3.5 mb-2">{t("sidebar_dashboard.menu")}</p>
            <NavItem
              to="/DashboardOverview"
              icon={<LayoutDashboard size={20} />}
              label={t("sidebar_dashboard.dashboard")}
              onClick={() => setSidebarOpen(false)}
            />
            <NavItem
              to="/DashboardCars"
              icon={<CarFront size={20} />}
              label={t("sidebar_dashboard.cars")}
              onClick={() => setSidebarOpen(false)}
            />
            <NavItem
              to="/Dashboardlisting"
              icon={<ClipboardList size={20} />}
              label={t("sidebar_dashboard.listing")}
              onClick={() => setSidebarOpen(false)}
            />
            <NavItem
              to="/DashboardStatisics"
              icon={<ChartLine size={20} />}
              label={t("sidebar_dashboard.statistics")}
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <div className="mt-4 mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white bg-gradient-to-r from-[#f4a825] to-[#fdc77a] w-full text-left"
            >
              <span className="text-base">
                <LogOut size={20} />
              </span>
              {t("sidebar_dashboard.logout")}
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200  ${
          isActive
            ? "bg-gradient-to-r from-[#f4a825] to-[#fdc77a] text-white shadow-md"
            : "text-gray-700 hover:bg-gray-200"
        }`
      }
    >
      <span className="text-base">{icon}</span>
      {label}
    </NavLink>
  );
}