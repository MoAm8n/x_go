import React from "react";

import carImg from "../assets/image.jpg"; // غيّر الصورة حسب الحاجة

const BookingSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex flex-col items-center justify-center container m-auto px-2 pt-24 pb-10">
        {/* كارد التأكيد العلوي */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between gap-6 mb-10">
          {/* يسار: رسالة الشكر */}
          <div className="p-6 flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-lg text-gray-900">
                Payment Confirmed
              </span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M4 8.5l3 3 5-5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Thank you For Choosing
              <br />
              XGO Car Rental
            </h2>
          </div>
          {/* يمين: بيانات الاستلام والتسليم */}
          <div className="p-6 flex gap-8 justify-center flex-1">
            <div className="flex flex-col items-center h-full">
              {/* الدائرة العلوية */}
              <div className="w-4 h-4 rounded-full border flex items-center justify-center pt-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-[#000000] shadow mb-2"></span>
              </div>
              {/* الخط العمودي */}
              <div
                className="w-[2px] bg-[#7B7B7B] flex-1"
                style={{ minHeight: 50, height: 200 }}
              ></div>
              {/* الدائرة السفلية */}
              <div className="w-4 h-4 rounded-full border border-[#7B7B7B] flex items-center justify-center pt-2 mt-3">
                <span className="w-3 h-3 rounded-full bg-[#7B7B7B] shadow mb-2"></span>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-3">
                <span className="font-bold text-[#E6911E] text-lg">Pick-Up</span>
                <div className="text-sm text-gray-700 mt-1">Dec 28, 2025 11:00 PM</div>
                <div className="text-xs text-gray-500">Cairo Airport</div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <span className="font-bold text-[#E6911E] text-lg">Drop-Off</span>
                <div className="text-sm text-gray-700 mt-1">Dec 31, 2025 8:00 AM</div>
                <div className="text-xs text-gray-500">Cairo Airport</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Rental Summary</h2>
          <div className="bg-white p-4 sm:p-8 flex flex-col md:flex-row gap-8">
            {/* Booking Details */}
            <div className="flex-1 shadow p-4 sm:p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Booking Details</h3>
              <div className="flex flex-col gap-3 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-700">Reservation Number</span>
                  <span className="text-gray-500">wsedrtyj8465312</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Confirmation Code</span>
                  <span className="text-gray-500">wsedrtyj8465312</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Rental Days</span>
                  <span className="text-gray-500">4</span>
                </div>
              </div>
            </div>
            {/* Payment Summary */}
            <div className="flex-1 shadow p-4 sm:p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
              <div className="flex flex-col gap-3 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900 font-medium">$800.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="text-gray-900 font-medium">$10.00</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Rental Price</span>
                  <span className="text-[#E6911E]">$810.00</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Overall Price including rental discount
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mx-auto my-10 px-2">
          <div className="rounded-lg shadow p-4 sm:p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-1">Car Specification</h3>
            <div className="text-gray-500 mb-4">Sport</div>
            <img
              src={carImg}
              alt="Car"
              className="w-full sm:w-64 h-28 object-contain mx-auto mb-4"
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6 text-gray-700 text-lg">
              {/* استبدل هذه الأيقونات بـ img أو svg حسب الحاجة */}
              <div className="flex items-center gap-1">
                <span className="material-icons">local_gas_station</span> Petrol
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons">settings</span> Manual
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons">event_seat</span> 05
              </div>
            </div>
            <ul className="flex flex-col gap-3 mt-4">
              {[
                "Free Cancellation",
                "Price Guarantee",
                "Damage Waiver",
                "Theft Protection",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-base">
                  <span>{feature}</span>
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-500">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M4 8.5l3 3 5-5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;
