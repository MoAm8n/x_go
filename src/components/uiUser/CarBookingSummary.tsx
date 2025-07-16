import React from "react";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import SpeedIcon from '@mui/icons-material/Speed';

interface CarBookingSummaryProps {
  carImage?: string;
  carName?: string;
}

const CarBookingSummary: React.FC<CarBookingSummaryProps> = ({
  carImage = "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  carName = "Ferrari Enzo",
}) => {
  return (
    <div className="shadow-lg rounded-xl flex flex-col items-center">
      <div className="flex w-full px-6 max-md:flex-col">
        <img
          src={carImage}
          alt={carName}
          className="lg:w-40 lg:h-24 object-cover rounded-lg mb-4"
        />
        <div className="p-3">
          <h2 className="font-semibold text-lg mb-1">{carName}</h2>
          <p className="mb-2">lorem ipsum dolor sit amet consectetur.</p>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col px-6">
        <div className="flex gap-4">
          <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <EarbudsIcon className="text-[#7B7B7B]" />
            <span className="text-base font-medium text-[#7B7B7B]">Manual</span>
          </div>
          <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <AirlineSeatReclineExtraIcon className="text-[#7B7B7B]"/>
            <span className="text-base font-medium text-[#7B7B7B]">2 Seates</span>
          </div>
          <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <SpeedIcon className="text-[#7B7B7B]"/>
            <span className="text-base font-medium text-[#7B7B7B]">62.500</span>
          </div>
          <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg ">
            <LocalGasStationIcon className="text-[#7B7B7B]"/>
            <span className="text-base font-medium text-[#7B7B7B]">3.5 L</span>
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
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-[#7B7B7B]">You Selected</p>
          <h2>Ferrari Enzo, 2 Seates, Manual</h2>
          <p className="text-[#E6911E]">Change Your Selection</p>
        </div>
      </div>
    </div>
  );
};

export default CarBookingSummary; 