import React from "react";
interface CarDetailsCardProps {
    image: string;
    name: string;
    brand: string;
    seats: number;
    luggage: number;
    transmission: string;
    fuel: string;
    price: number;
    currency: string;
    perDayText?: string;
}

const CarDetailsCard: React.FC<CarDetailsCardProps> = ({
    image,
    name,
    brand,
    seats,
    luggage,
    transmission,
    price,
    currency,
    perDayText = "/Per Day",
}) => (
    <div className="bg-gray-50 rounded-xl shadow-md w-full h-fit flex flex-col">
    <img
        src={image}
        alt={name}
        className="rounded-t-xl object-cover w-full h-[180px] mb-4"
    />
    <div className="p-4">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{name}</h2>
            <span className="bg-[#f6d1cc]  px-4 py-1 rounded-full text-sm font-semibold">
            {brand}
            </span>
        </div>
    <div className="flex justify-between items-center gap-6 text-[#222] text-base  mt-5">
        <div className="flex items-center gap-1">
            {/* <img src={Group} alt="seats" className="w-4 h-4" />{" "} */}
            {seats.toString().padStart(2, "0")}
        </div>
        <div className="flex items-center gap-1">
            {/* <img src={Vector7} alt="luggage" className="w-4 h-4" />{" "} */}
            {luggage.toString().padStart(2, "0")}
        </div>
        <div className="flex items-center gap-1">
            {/* <img src={Vector6} alt="transmission" className="w-4 h-4" />{" "} */}
            {transmission}
        </div>
        <div className="flex items-center gap-1">
            {/* <img src={Frame225} alt="fuel" className="w-4 h-4" /> {fuel} */}
        </div>
    </div>
    <div className="flex items-center justify-between mt-auto">
        <div>
            <span className="text-xl font-bold">
            ${price} {currency}
            </span>
            <span className="text-base text-gray-500"> {perDayText}</span>
        </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition">
                {/* <img src={solar_arrow_up_bold} alt="luggage" className="w-8 h-8" />{" "} */}
            </button>
        </div>
    </div>
    </div>
);

export default CarDetailsCard;