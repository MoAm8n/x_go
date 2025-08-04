import React from "react";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";

// بيانات وهمية للسيارات
const cars = [
  {
    id: 1,
    name: "Ferrari",
    brand_name: "Ferrari",
    price: 72,
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    city: "Cairo, Egypt",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Ferrari",
    brand_name: "Ferrari",
    price: 72,
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    city: "Cairo, Egypt",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Ferrari",
    brand_name: "Ferrari",
    price: 72,
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    city: "Cairo, Egypt",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Ferrari",
    brand_name: "Ferrari",
    price: 72,
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    city: "Cairo, Egypt",
    rating: 4.5,
  },
  {
    id: 5,
    name: "Ferrari",
    brand_name: "Ferrari",
    price: 72,
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    city: "Cairo, Egypt",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Ferrari",
    brand_name: "Ferrari",
    price: 72,
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    city: "Cairo, Egypt",
    rating: 4.5,
  },
];

export default function Dashboardlisting() {
  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-2 md:px-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-10 ">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div
                key={car.id}
                className=" rounded-xl shadow-sm  transition-shadow cursor-pointer  h-[290px] transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={car.image || "/placeholder-car.jpg"}
                  alt={car.name}
                  className="w-full h-44 md:h-48 object-cover  rounded-t-lg"
                />
                <div className="p-4  border border-[#000000] rounded-b-xl">
                  <div className="flex justify-between  mb-2 max-md:flex-col">
                    <h3 className="font-bold text-lg">
                      {car.brand_name} {car.name}
                    </h3>
                    <p className="text-lg">
                      ${car.price}/<span className="text-sm text-gray-600">Day</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-sm">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {car.city}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                      {car.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              لا توجد سيارات متاحة للعرض
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
