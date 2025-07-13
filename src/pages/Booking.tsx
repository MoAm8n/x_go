import React from "react";
import { Link } from "react-router-dom";

import CarBookingSummary from "../components/ui/CarBookingSummary";
import BookingStepper from "../components/ui/BookingStepper";
import Frame225 from "../assets/Car Details Card Icon/Frame 225.png";
import Group from "../assets/Car Details Card Icon/Group.png";
import Vector6 from "../assets/Car Details Card Icon/Vector (6).png";
import Frame290 from "../assets/Car Details Card Icon/Frame 290.png";

const Booking: React.FC = () => {
  return (
    <div className="min-h-screen pb-10  flex flex-col ">
      <main className="container mx-auto px-2 sm:px-4 pt-24 flex-1 flex flex-col">
        <BookingStepper currentStep={2} />
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* القسم الأيسر: بيانات السيارة */}
          <div className="w-[100%] md:w-1/3 mb-6 md:mb-0">
            <div className="bg-white flex flex-col gap-12 ">
              <CarBookingSummary
               transmissionIcon={Frame290}
                seatsIcon={Group}
                priceIcon={Vector6}
                engineIcon={Frame225}
              />
              <div className="shadow-lg rounded-xl flex flex-col pb-5 gap-3">
                <div className="flex justify-between items-center w-full mb-1 py-3 px-8 rounded-t-xl text-white bg-[#E6911E]">
                  <span className="font-bold text-base">Price</span>
                  <span className=" font-bold">$789.15</span>
                </div>
                <div className=" flex flex-col gap-3 px-8">
                  <h3>Price Information</h3>
                  <p className="text-gray-500">Includes Texas and charges</p>
                </div>
                <div className=" text-gray-400 px-8">
                  <div className="flex justify-between ">
                    <p>14% Tax </p>
                    <p>$200.00</p>
                  </div>
                  <div className="flex justify-between ">
                    <p>14% Tax </p>
                    <p>$200.00</p>
                  </div>
                  <div className="flex justify-between ">
                    <p>14% Tax </p>
                    <p>$200.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* القسم الأيمن: فورم تسجيل الدخول والشروط */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 flex flex-col gap-8">
              <h3 className="font-bold text-center text-lg mb-4">
                Login or Sign up to book
              </h3>
              <form className="flex flex-col gap-8">
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-[#cdcac5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border border-[#cdcac5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                />
                <Link
                  to="/booking/payment"
                  className="w-full bg-[#E6911E] hover:bg-[#E6911E] font-semibold py-2 rounded-lg mt-2 transition text-white flex items-center justify-center"
                >
                  Sign in
                </Link>
              </form>
              <div className="text-sm mt-2 text-center">
                Don&apos;t have an account?{" "}
                <a href="#" className="text-[#E6911E] hover:underline">
                  Sign Up
                </a>
              </div>
              <div className="shadow rounded-md p-6 md:p-8 mt-8 mx-auto w-full">
                <h2 className="text-2xl font-bold mb-4">Terms and Condition</h2>
                <h3 className="text-lg font-semibold mb-2">Payments</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>
                    Lorem ipsum dolor sit amet consectetur. Mattis vestibulum
                    nunc mattis aliquam arcu sed. Diam in nisl maecenas sed
                    lacus sit ligula. Id nulla felis pulvinar sed eu vel proin
                    ultricies elementum. Id odio ultrices sed arcu velit
                    condimentum et purus duis. Morbi arcu sed mauris.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur. Mattis vestibulum
                    nunc mattis aliquam arcu sed. Diam in nisl maecenas sed
                    lacus sit ligula. Id nulla felis pulvinar sed eu vel proin
                    ultricies elementum. Id odio ultrices sed arcu velit
                    condimentum et purus duis. Morbi arcu sed mauris.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur. Mattis vestibulum
                    nunc mattis aliquam arcu sed. Diam in nisl maecenas sed
                    lacus sit ligula. Id nulla felis pulvinar sed eu vel proin
                    ultricies elementum. Id odio ultrices sed arcu velit
                    condimentum et purus duis. Morbi arcu sed mauris.
                  </li>
                </ul>
                <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                <p className="text-gray-700">
                  Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc
                  mattis aliquam arcu sed. Diam in nisl maecenas sed lacus sit
                  ligula. Id nulla felis pulvinar sed eu vel proin ultricies
                  elementum. Id odio ultrices sed arcu velit condimentum et
                  purus duis. Morbi arcu sed mauris
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
