import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import PieChartComponent from "../Components/PieChartComponent";
import BarChartComponent from "../Components/BarChartComponent";

export default function DashboardStatisics() {
  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-2 md:px-10 pt-10 ">
          {/* البطاقات والدائرة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch  p-8 mb-8">
            {/* البطاقة الأولى */}
            <div className="flex flex-col justify-between p-6 h-52">
              <div className="text-gray-500">Expenses</div>
              <div className="text-2xl font-bold">$5284.29</div>
              <div className="text-gray-400">Compared to $8921 yesterday</div>
              <div className="text-gray-400">Last week $78965.00</div>
            </div>
            {/* البطاقة الثانية */}
            <div className="flex flex-col justify-between p-6 h-52">
              <div className="text-gray-500 mb-2">Expenses</div>
              <div className="text-2xl font-bold mb-1">$5284.29</div>
              <div className="text-gray-400">Compared to $8921 yesterday</div>
              <div className="text-gray-400">Last week $78965.00</div>
            </div>
            {/* الدائرة */}
            <div className="flex flex-col justify-center items-start p-6 h-52">
              <div className="text-gray-500 mb-2">Hire vs Cancel</div>
              <PieChartComponent />
            </div>
          </div>

          {/* earning statistics */}
          <div className="  p-8 mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-500"> Earning statistics</div>
              <div className="text-xs text-gray-400">Date</div>
            </div>
            <BarChartComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
