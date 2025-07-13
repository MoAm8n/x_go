import React, { useState } from "react";
import { Link } from "react-router-dom";

const extrasList = [
  { label: "GPS Navigation System", price: 55 },
  { label: "Child Seat", price: 55 },
  { label: "Additional Driver", price: 55 },
  { label: "Insurance Coverage", price: 55 },
];

const RentSidebar: React.FC = () => {
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);

  const basePrice = 150;
  const tax = 50;
  const total =
    basePrice +
    tax +
    selectedExtras.reduce((sum, idx) => sum + extrasList[idx].price, 0);

  const handleCheckbox = (idx: number) => {
    setSelectedExtras((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="gap-5 border border-[#cdcac5] border-opacity-30 rounded-xl shadow mt-10 p-6 w-full  mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4 ">
        Rent This Vehicle
      </h2>
      <div className="mb-4 flex items-center justify-between ">
        <label className="block text-sm font-medium mb-1">Pick-Up</label>
        <div className="relative">
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none"
            style={{ borderColor: "#cdcac5" }}
          />
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between ">
        <label className="block text-sm font-medium mb-1">Drop-Off</label>
        <div className="relative">
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none"
            style={{ borderColor: "#cdcac5" }}
          />
        </div>
      </div>
      <div className="mb-4">
        <span className="block text-sm font-medium mb-5">Add Extra:</span>
        <div className="space-y-6 mb-5">
          {extrasList.map((extra, idx) => (
            <label
              key={extra.label}
              className="flex items-center justify-between text-sm"
            >
              <span>
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(idx)}
                  onChange={() => handleCheckbox(idx)}
                  className="w-5 h-5 mr-2 appearance-none border rounded border-[#aaa9a8] checked:border-[#aaa9a8] checked:bg-[#aaa9a8] focus:ring-0 accent-custom"
                />
                {extra.label}
              </span>
              <span className="font-medium">${extra.price.toFixed(2)}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 mb-2 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>Total Payable</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Link
        to="/booking/step2"
        className="w-full block bg-[#E6911E] hover:bg-[#E6911E] font-semibold py-2 rounded-xl mt-2 transition text-center text-white"
      >
        Book Now
      </Link>
    </div>
  );
};

export default RentSidebar;