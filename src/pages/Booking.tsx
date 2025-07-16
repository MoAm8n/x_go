import React from "react";
import CarBookingSummary from "../components/uiUser/CarBookingSummary";
import BookingStepper from "../components/uiUser/BookingStepper";
import calculateTotal from '../components/uiUser/RentSidebar'
import { Link } from "react-router-dom";

const Booking: React.FC = () => {
  const user = localStorage.getItem('user');
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="container mx-auto px-2 sm:px-4 max-md:py-6">
        <BookingStepper currentStep={2} />
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <div className="w-[100%] md:w-2/4 mb-6 md:mb-0">
            <div className="bg-white flex flex-col gap-12">
              <CarBookingSummary/>
              <div className="shadow-lg rounded-xl flex flex-col pb-5 gap-3">
                <div className="flex justify-between items-center w-full mb-1 py-3 px-8 rounded-t-xl text-white bg-[#E6911E]">
                  <span className="font-bold text-base">Price</span>
                  <span className=" font-bold">${calculateTotal}</span>
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
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 flex flex-col gap-8">
              <h3 className="font-bold text-center text-lg mb-4">
                Booking requires an account — log in or 
                create one to continue
              </h3>
              {!user &&(
                <>
                <form className="flex flex-col gap-4">
                <Link to={'/signin'}>
                  <button className="bg-[#E6911E] rounded-3xl h-12 w-full text-white">
                    Sign in
                  </button>
                </Link>
                <Link to={'/signup'}>
                  <button className="bg-[#E6911E] rounded-3xl h-12 w-full text-white">
                    Sign Up
                  </button>
                </Link>
                </form>
                <div className="text-sm text-center">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="text-[#E6911E] hover:underline">
                    Sign Up
                  </a>
                </div> 
                </>
              )}
              {user && (
                <Link to={'/booking/payment/booking-success'}>
                  <button className="bg-[#E6911E] rounded-3xl h-12 w-full text-white">
                    Book Now
                  </button>
                </Link>
              )}
              
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
