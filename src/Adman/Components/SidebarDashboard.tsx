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

export default function SidebarDashboard() {
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
        // إزالة التوكن من التخزين المحلي
        localStorage.removeItem("tokenAdman");
        toast.success("تم تسجيل الخروج بنجاح ✅");
        navigate("/");
      } else {
        toast.error("فشل في تسجيل الخروج ❌");
        console.error("فشل تسجيل الخروج:", response.data);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج ❌");
      console.error(
        "حدث خطأ أثناء تسجيل الخروج:",
        error.response?.data || error.message
      );
    } finally {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* زر القائمة للموبايل */}
      <button
        className="fixed top-3.5 left-4 z-20 lg:hidden bg-white p-2 rounded-full shadow-lg sidebar-toggle-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      <div
        className={`
        sidebar-dashboard
        h-[95%] w-64 bg-[#FAF7F2] z-40 px-5 border-r border-gray-200
        fixed top-0 left-0 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:fixed md:top-0 lg:left-0 md:block
      `}
        style={{ minWidth: "16rem" }}
      >
        {/* زر إغلاق للموبايل */}
        <div className="flex justify-end lg:hidden p-2">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="p-2"
          >
            <X size={24} />
          </button>
        </div>
        <Link to="/" className="mx-auto mb-8 flex justify-center mt-5">
          <img src={logo} alt="الشعار" className="h-10" />
        </Link>
        <div className="flex flex-col h-[calc(100%-4rem)]">
          <div className="flex flex-col gap-2 flex-grow">
            <p className="text-xs text-[#8B919E] px-3.5">MENU</p>
            <NavItem
              to="/DashboardOverview"
              icon={<LayoutDashboard />}
              label="Dashboard"
              onClick={() => setSidebarOpen(false)}
            />
            <NavItem
              to="/DashboardCars"
              icon={<CarFront />}
              label="Cars"
              onClick={() => setSidebarOpen(false)}
            />
            <NavItem
              to="/Dashboardlisting"
              icon={<ClipboardList />}
              label="Listing"
              onClick={() => setSidebarOpen(false)}
            />
            <NavItem
              to="/DashboardStatisics"
              icon={<ChartLine />}
              label="Statistics"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 bg-gradient-to-r from-[#f4a825] to-[#fdc77a] text-white  w-full text-left"
            >
              <span className="text-lg">
                <LogOut />{" "}
              </span>
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay للموبايل عند فتح القائمة */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

// مكون فرعي لعنصر الرابط لتقليل التكرار
type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};
function NavItem({ to, icon, label, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-[#f4a825] to-[#fdc77a] text-white shadow-md"
            : "text-gray-700 hover:bg-gray-200"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  );
}
