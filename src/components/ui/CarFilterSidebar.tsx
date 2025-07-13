
import React from "react";

const brands = [
  { name: "Ferrari", count: 12 },
  { name: "BMW", count: 9 },
  { name: "Lamborghini", count: 7 },
  { name: "Porsche", count: 5 },
  // أضف المزيد حسب الحاجة
];

const types = [
  { name: "SUV", count: 16 },
  { name: "Sedan", count: 8 },
  { name: "Coupe", count: 6 },
];

const CarFilterSidebar: React.FC = () => {
  return (
    <aside className=" sticky top-[150px] w-full  ">
      <div className=" p-6 w-full max-w-lg min-w-[350px] top-24 flex flex-col gap-6">
        <div className=" bg-gray-50 p-5 border border-gray-200 rounded-lg w-full">
          <h3 className="font-bold text-lg mb-3">Car Brands</h3>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 appearance-none border rounded border-[#aaa9a8] checked:border-[#aaa9a8] checked:bg-[#aaa9a8] focus:ring-0 accent-custom"
                />
                <span>All</span>
              </label>
              <span className="text-xs bg-[#f6d1cc] px-2 py-0.5 rounded-full text-gray-700 font-bold">
                93
              </span>
            </li>
            {brands.map((brand) => (
              <li
                key={brand.name}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 appearance-none border rounded border-[#aaa9a8] checked:border-[#aaa9a8] checked:bg-[#aaa9a8] focus:ring-0 accent-custom"
                  />
                  <span>{brand.name}</span>
                </label>
                <span className="text-xs bg-[#f6d1cc] px-2 py-0.5 rounded-full text-gray-700 font-bold">
                  {brand.count}
                </span>
              </li>
            ))}
          </ul>
          <button className="text-[#E6911E] text-xs mt-2 underline">
            See More
          </button>
        </div>
        <div className=" bg-gray-50 p-5 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Filter Price</h3>
          <input
            type="range"
            min={0}
            max={500}
            className="w-full accent-[#E6911E]"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="bg-gray-100 px-2 py-1 rounded-lg font-bold">
              $70
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded-lg font-bold">
              $300
            </span>
          </div>
          <button className="w-full bg-[#E6911E]  text-white font-bold rounded-full px-4 py-2 mt-4 transition">
            Apply
          </button>
        </div>
        <div className=" bg-gray-50 p-5 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Car Types</h3>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 appearance-none accent-[#418596] border rounded border-[#aaa9a8] checked:border-[#aaa9a8] checked:bg-[#aaa9a8] focus:ring-0 accent-custom"
                />
                <span>All</span>
              </label>
              <span className="text-xs bg-[#f6d1cc] px-2 py-0.5 rounded-full text-gray-700 font-bold">
                93
              </span>
            </li>
            {types.map((type) => (
              <li key={type.name} className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 appearance-none border rounded border-[#aaa9a8] checked:border-[#aaa9a8] checked:bg-[#aaa9a8] focus:ring-0 accent-custom"
                  />
                  <span>{type.name}</span>
                </label>
                <span className="text-xs bg-[#f6d1cc] px-2 py-0.5 rounded-full text-gray-700 font-bold">
                  {type.count}
                </span>
              </li>
            ))}
          </ul>
          <button className="text-[#E6911E] text-xs mt-2 underline">
            See More
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CarFilterSidebar;
