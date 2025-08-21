import { useState } from "react";
import { useTranslation } from "react-i18next";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import BrandDashboard from "./BrandDashboard";
import TypeDashboard from "./TypeDashboard";
import Model from "./Model";

export default function DashboardCars() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"brand" | "type" | "model">(
    "brand"
  );

  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-2 md:px-10 pt-10">
          <div className="flex  mb-8 justify-center ">
            <div className="border-2 border-[#f4a825] rounded-xl flex flex-col sm:flex-row mb-6 sm:mb-8 justify-center overflow-hidden w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-[#145869]">
              <div className="w-full sm:w-1/3 ">
                <button
                  className={`px-4 py-2 sm:px-6 sm:py-2 font-bold transition-all h-full w-full text-xs sm:text-sm ${
                    activeTab === "brand"
                      ? "bg-[#f4a825] text-white"
                      : "bg-[#FAF7F2] text-[#145869]"
                  }`}
                  onClick={() => setActiveTab("brand")}
                >
                  {t("dashboard.brand")}
                </button>
              </div> 

              <div className="w-full sm:w-1/3 border-b-2 sm:border-b-0 sm:border-l-2 sm:border-r-2 border-[#f4a825]">
                <button
                  className={`px-4 py-2 sm:px-6 sm:py-2 font-bold transition-all h-full w-full text-xs sm:text-sm ${
                    activeTab === "type"
                      ? "bg-[#f4a825] text-white"
                      : "bg-[#FAF7F2] text-[#145869]"
                  }`}
                  onClick={() => setActiveTab("type")}
                >
                  {t("dashboard.types")}
                </button>
              </div>

              <div className="w-full sm:w-1/3">
                <button
                  className={`px-4 py-2 sm:px-6 sm:py-2 font-bold transition-all h-full w-full text-xs sm:text-sm ${
                    activeTab === "model"
                      ? "bg-[#f4a825] text-white"
                      : "bg-[#FAF7F2] text-[#145869]"
                  }`}
                  onClick={() => setActiveTab("model")}
                >
                  {t("dashboard.model")}
                </button>
              </div>
            </div>
          </div>
          {activeTab === "brand" && <BrandDashboard />}
          {activeTab === "type" && <TypeDashboard />}
          {activeTab === "model" && <Model />}
        </div>
      </div>
    </div>
  );
}
