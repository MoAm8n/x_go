import React from "react";

interface CarBookingSummaryProps {
  carImage?: string;
  carName?: string;
  transmissionIcon?: string;
  seatsIcon?: string;
  priceIcon?: string;
  engineIcon?: string;
}

const CarBookingSummary: React.FC<CarBookingSummaryProps> = ({
  carImage = "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  carName = "Ferrari Enzo",
  transmissionIcon,
  seatsIcon,
  priceIcon,
  engineIcon,
}) => {
  return (
    <div className="shadow-lg rounded-xl p-3 flex flex-col items-center w-full">
      <div className="flex justify-around  ">
        <img
          src={carImage}
          alt={carName}
          className="w-32 h-20 object-cover rounded-lg mb-4"
        />
        <div className="p-3">
          <h2 className="font-semibold text-lg mb-1">{carName}</h2>
          <p className="mb-2">lorem ipsum dolor sit amet consectetur.</p>
        </div>
      </div>
      <div className="w-full gap-2 mb-2 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="flex justify-between px-6 items-center gap-2 border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <img
              src={transmissionIcon}
              alt="Manual"
              className="w-[16px] object-cover"
            />
            <span className="text-base font-medium">Manual</span>
          </div>
          <div className="flex justify-between px-4 items-center gap-2 border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <img
              src={seatsIcon}
              alt="2 Seates"
              className="w-[16px] object-cover"
            />
            <span className="text-base font-medium">2 Seates</span>
          </div>
          <div className="flex justify-between px-6 items-center gap-2 border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <img
              src={priceIcon}
              alt="62.500"
              className="w-[16px] object-cover"
            />
            <span className="text-base font-medium">62.500</span>
          </div>
          <div className="flex justify-between px-6 items-center gap-2 border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <img
              src={engineIcon}
              alt="3.5 L"
              className="w-[16px] object-cover"
            />
            <span className="text-base font-medium">3.5 L</span>
          </div>
        </div>
        <h3 className="text-[#E6911E] font-medium text-[16px]">Your Booking Details</h3>
        <div className="flex justify-between">
          <div className="mb-2 flex flex-col gap-2">
            <p className="text-[#7B7B7B]">Check out</p>
            <h3>Sat 31 May 2025</h3>
            <p className="text-[#7B7B7B]">15:00 - 0:00</p>
          </div>
          <div className="mb-2 flex flex-col gap-2">
            <p className="text-[#7B7B7B]">Check out</p>
            <h3>Sat 31 May 2025</h3>
            <p className="text-[#7B7B7B]">15:00 - 0:00</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-1">
          <p className="text-[#7B7B7B]">You Selected</p>
          <h2>Ferrari Enzo, 2 Seates, Manual</h2>
          <p className="text-[#E6911E]">Change Your Selection</p>
        </div>
      </div>
    </div>
  );
};

export default CarBookingSummary; 