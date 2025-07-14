import React from "react";
import car1 from '../../../public/images/car.jpg';
import { MapPin } from 'lucide-react';

const cars = [
{
    id: 1,
    name: "Ferrari",
    description: "سيارة رياضية فاخرة سوداء اللون، أداء عالي وتصميم أنيق.",
    image: car1,
    bookedDays: 7,
    rating: 4.5,
    location: " Egypt",
},
{
    id: 2,
    name: "Ferrari",
    description: "سيارة رياضية فاخرة بيضاء اللون، مثالية للقيادة في المدينة.",
    image: car1,
    bookedDays: 7,
    rating: 4.5,
    location: " Egypt",
},
{
    id: 3,
    name: "Ferrari",
    description: "أيقونة مميزة لاستخدامات متعددة في التطبيق.",
    image: car1,
    bookedDays: 7,
    rating: 4.5,
    location: " Egypt",
},
{
    id: 4,
    name: "Ferrari",
    description: "أيقونة إضافية لتمثيل ميزة أو خدمة.",
    image: car1,
    bookedDays: 7,
    rating: 4.5,
    location: " Egypt",
},
{
    id: 5,
    name: "Ferrari",
    description: "أيقونة توضح إمكانية الحجز في أي وقت.",
    image: car1,
    bookedDays: 7,
    rating: 4.5,
    location: " Egypt",
},
];
const steps = [
{
    number: "01",
    title: "Discover Your Perfect Car",
    description:
    "Lorem ipsum dolor sit amet consectetur. Au ele malesuada pretium sed porta. Augue massa ipsum odio urna vel nisl.",
},
{
    number: "02",
    title: "Secure Your Rental Booking",
    description: "",
},
{
    number: "03",
    title: "Complete Your Booking Payment",
    description: "",
},
{
    number: "04",
    title: "Your Booking is Confirmed",
    description: "",
},
];

const HowItWorks: React.FC = () => (
<section className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-10 p-4 sm:p-6 md:p-8 mt-8 mb-12 items-center">
    <div className="w-full lg:w-1/2 max-w-lg flex-1 mx-auto">
    <h4 className="text-[#E6911E] mb-2 font-semibold text-xl md:text-4xl">How It Works</h4>
    <h2 className="mb-8 font-semibold text-xl md:text-4xl">
        Step by step to rent a car on our platform
    </h2>
    <ol className="space-y-6">
        {steps.map((step, idx) => (
        <li key={step.number} className="flex items-center">
            <span
            className={`flex-shrink-0 w-10 h-10 md:w-16 md:h-16 text-lg md:text-xl rounded-full flex items-center justify-center font-bold mr-5 ${
                idx === 0
                ? "bg-[#E6911E] text-black"
                : "text-[#7B7B7B] border border-[#7B7B7B] bg-white"
            }`}
            >
            {step.number}
            </span>
            <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-1">
                {step.title}
            </h3>
            {step.description && (
                <p className="font-medium text-sm md:text-lg max-w-xs">
                {step.description}
                </p>
            )}
            </div>
        </li>
        ))}
    </ol>
    </div>
    <div className="w-full lg:w-1/2 max-w-xl flex-1 mx-auto flex flex-col">
    <div className="mb-4 mt-6 w-full">
        <h4 className="font-bold text-lg md:text-2xl mb-4">Car Type</h4>
        <div className="flex gap-4 max-md:gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar pb-2">
        {cars.map((car) => (
            <div
            key={car.id}
            className="flex-shrink-0 max-sm:w-36 w-52"
            >
            <img
                src={car.image}
                alt={car.name}
                className="rounded-lg h-3/4 w-full object-cover mb-2 mx-auto "
            />
            <h5 className="font-normal text-xs sm:text-sm md:text-base text-center">
                {car.name}
            </h5>
            </div>
        ))}
        </div>
    </div>
    <div className="flex gap-4 max-sm:gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {cars.map((car) => (
        <div
            key={car.id}
            className="flex-shrink-0 flex flex-col gap-y-3 w-64 h-[380px] selection:rounded-lg"
        >
            <h1 className="font-semibold text-base md:text-xl text-center">
            200+ Car Available
            </h1>
            <img
            src={car.image}
            alt={car.name}
            className="rounded-lg h-3/5 w-full object-cover "
            />
            <div className="px-2">
            <p className="font-medium text-sm md:text-lg">{car.name}</p>
                <p className="text-lg">{car.rating}
                    <span className="text-sm text-gray-600"> / Day</span>
                </p>
            <div className="flex justify-between items-center py-1">
                <p className="font-normal text-xs md:text-base flex items-center gap-1">
                    <MapPin size={18}/>
                    {car.location}
                </p>
                <p className="flex items-center gap-1">
                {car.rating}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 md:w-5 md:h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.18 3.63a1 1 0 00.95.69h3.813c.969 0 1.371 1.24.588 1.81l-3.084 2.24a1 1 0 00-.364 1.118l1.18 3.63c.3.921-.755 1.688-1.54 1.118l-3.084-2.24a1 1 0 00-1.176 0l-3.084 2.24c-.784.57-1.838-.197-1.539-1.118l1.18-3.63a1 1 0 00-.364-1.118L2.32 9.057c-.783-.57-.38-1.81.588-1.81h3.813a1 1 0 00.95-.69l1.18-3.63z" />
                </svg>
                </p>
            </div>
            </div>
        </div>
        ))}
    </div>
    </div>
</section>
);

export default HowItWorks;