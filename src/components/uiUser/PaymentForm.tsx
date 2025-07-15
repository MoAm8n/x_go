import React, { useState } from "react";
import { Link } from "react-router-dom";
import cashIcon from "../../assets/PaymentForm/ion_cash (1).png"; // ضع مسار الأيقونة الحقيقية هنا
import visaIcon from "../../assets/PaymentForm/Vector (7).png"; // ضع مسار أيقونة الفيزا هنا

const PaymentForm: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [saveInfo, setSaveInfo] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full mx-auto">
      <h2 className="text-xl font-bold text-[#E6911E] mb-6">Payment</h2>
      <div className="flex flex-col gap-3 mb-6">
        {/* Cash on delivery */}
        <div
          className={`flex items-center justify-between  px-4 py-3 cursor-pointer transition rounded-lg ${
            paymentMethod === "cash"
              ? "border-[#E6911E] ring-2 ring-[#E6911E] border "
              : "border-gray-200 border"
          }`}
          onClick={() => setPaymentMethod("cash")}
        >
          <div className="flex items-center gap-4">
            <img
              src={cashIcon}
              alt="Cash"
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className=" text-lg text-gray-900">
                Cash on delivery
              </div>
              <div className="text-sm text-gray-500 mt-1 w-60">
                Pay in cash when your car is delivered to your location
              </div>
            </div>
          </div>
         
              <span
            className={`inline-block w-6 h-6 rounded-full border flex items-center justify-center relative ${
              paymentMethod === "cash" ? "border-[#E6911E]" : "border-gray-300"
            }`}
          >
            {paymentMethod === "cash" && (
              <span className="w-3 h-3 bg-[#E6911E] rounded-full block absolute top-[5px] right-[5px]"></span>
            )}
          </span>
        </div>
        {/* VISA */}
        <div
          className={`flex items-center justify-between  px-4 py-3 cursor-pointer transition rounded-lg ${
            paymentMethod === "visa"
              ? "border-[#E6911E] ring-2 ring-[#E6911E] border"
              : "border-gray-200 border"
          }`}
          onClick={() => setPaymentMethod("visa")}
        >
          <div className="flex items-center gap-4">
            <img
              src={visaIcon}
              alt="Visa"
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className="text-lg text-gray-900">
                Credit Card or Debit Card
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Pay with your credit or debit card
              </div>
            </div>
          </div>
          <span
            className={`inline-block w-6 h-6 rounded-full border flex items-center justify-center relative ${
              paymentMethod === "visa" ? "border-[#E6911E]" : "border-gray-300"
            }`}
          >
            {paymentMethod === "visa" && (
              <span className="w-3 h-3 bg-[#E6911E] rounded-full block absolute top-[5px] right-[5px]"></span>
            )}
          </span>
        </div>
      </div>
      {paymentMethod === "visa" && (
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Card Number"
            className="border border-[#cdcac5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Exp Date"
              className="border border-[#cdcac5] rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            />
            <input
              type="text"
              placeholder="CVC"
              className="border border-[#cdcac5] rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            />
          </div>
        </div>
      )}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Shipping Details</h3>
        <input
          type="text"
          placeholder="Address"
          className="border border-[#cdcac5] rounded-lg px-3 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Country"
            className="border border-[#cdcac5] rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
          />
          <input
            type="text"
            placeholder="Zip Code"
            className="border border-[#cdcac5] rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
          />
        </div>
        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={() => setSaveInfo(!saveInfo)}
            className="accent-[#E6911E]"
          />
          <span className="text-sm text-gray-600">
            Securely Save my Information For 1-click Checkout
          </span>
        </label>
      </div>
      <Link
        to="/booking/payment/booking-success"
        className="w-full bg-[#E6911E] hover:bg-[#E6911E] font-semibold py-2 rounded-lg text-white text-lg transition flex items-center justify-center"
      >
        Pay $963
      </Link>
    </div>
  );
};

export default PaymentForm;
