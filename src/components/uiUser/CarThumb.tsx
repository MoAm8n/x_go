import React from "react";

interface CarThumbProps {
  image: string;
  text: string;
}

const CarThumb: React.FC<CarThumbProps> = ({ image, text }) => (
  <div className="flex justify-evenly items-center gap-2 w-[142px] h-[37px] bg-[#f8d3cc] rounded-lg ">
    <img
      src={image}
      alt={text}
      className=" w-[22px]   object-cover "
    />
    <span className="text-base font-medium">{text}</span>
  </div>
);

export default CarThumb; 