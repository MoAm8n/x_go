import { useState } from "react";
import ProfilePicture from "../assets/Ellipse 17.png";
import {
  LayoutDashboard,
  CarFront,
  ClipboardList,
  ChartLine,
  Search,
  Bell,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  { to: "/cars", label: "My Cars", icon: <CarFront /> },
  { to: "/listing", label: "Listing", icon: <ClipboardList /> },
  { to: "/statistics", label: "Statistics", icon: <ChartLine /> },
];

export default function HeaderDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // فلترة العناصر حسب البحث
  // const filteredItems = menuItems.filter((item) =>
  //   item.label.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="flex  flex-col md:flex-row md:items-center md:justify-between w-full md:w-5/5 bg-[#fdf9f2] px-4 md:px-12 py-4 gap-4">
      {/* Search Input */}
      <div className="relative w-full md:w-[50%] flex flex-row-reverse">
        <Search
          className="absolute left-[23%] md:left-[6%] lg:left-[3%] top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search menu..."
          className="w-[80%] md:w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#fdf9f2]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Icons */}
      {/* <div className="flex flex-row justify-evenly items-center gap-4 w-full md:w-auto ">
        <div className="w-[40px] h-[40px] bg-[#f7f3ec] rounded-full flex justify-center items-center">
          <Bell />
        </div>
        <div className="w-[100px] h-[40px] bg-[#f7f3ec] rounded-full flex items-center overflow-hidden p-[5px]">
          <img
            src={ProfilePicture}
            alt="Profile Picture"
            className=" object-cover rounded-full  "
          />
        </div>
        <div className="w-[40px] h-[40px] bg-[#f7f3ec] rounded-full flex justify-center items-center">
          <Menu />
        </div>
      </div> */}
    </div>
  );
}
