import { useState } from "react";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
// import AddCarBrand from "../Components/AddCarBrand";
// import axios from "axios";
// import { API_URL } from "../../context/api/Api";
import BrandDashboard from "./BrandDashboard";
import TypeDashboard from "./TypeDashboard";
import Model from "./Model";
export default function DashboardCars() {
  const [activeTab, setActiveTab] = useState<"brand" | "type" | "model">(
    "brand"
  );

  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-2 md:px-10 pt-10">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              className={`px-6 py-2 rounded-t-lg font-bold border-b-4 transition-all ${
                activeTab === "brand"
                  ? "border-yellow-500 bg-white"
                  : "border-transparent bg-[#FAF7F2]"
              }`}
              onClick={() => setActiveTab("brand")}
            >
              Brand
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-bold border-b-4 transition-all ${
                activeTab === "type"
                  ? "border-yellow-500 bg-white"
                  : "border-transparent bg-[#FAF7F2]"
              }`}
              onClick={() => setActiveTab("type")}
            >
              Types
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-bold border-b-4 transition-all ${
                activeTab === "model"
                  ? "border-yellow-500 bg-white"
                  : "border-transparent bg-[#FAF7F2]"
              }`}
              onClick={() => setActiveTab("model")}
            >
              Modal
            </button>
          </div>
          {/* Tab Content */}
          {activeTab === "brand" && <BrandDashboard />}
          {activeTab === "type" && <TypeDashboard />}
          {activeTab === "model" && <Model />}
        </div>
      </div>
    </div>
  );
}
