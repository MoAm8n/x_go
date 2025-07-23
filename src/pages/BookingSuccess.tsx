// import React from "react";
// import carImg from "../assets/image.jpg"; // غيّر الصورة حسب الحاجة
// import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
// import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
// import EarbudsIcon from "@mui/icons-material/Earbuds";

// const BookingSuccess: React.FC = () => {
//   return (
//     <div className="min-h-screen">
//       <main className="container mx-auto px-8">
//         <div className="flex justify-around items-center w-full">
//           <div className="flex flex-col">
//             <div className="flex gap-4 mb-4">
//               <span className="font-semibold text-lg text-gray-900">
//                 Payment Confirmed
//               </span>
//               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
//                 <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
//                   <path
//                     d="M4 8.5l3 3 5-5"
//                     stroke="#fff"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </span>
//             </div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
//               Thank you For Choosing
//               <br />
//               XGO Car Rental
//             </h2>
//           </div>
//           <div className="py-8 flex gap-8 justify-center">
//             <div className="flex flex-col items-center h-full">
//               <div className="w-4 h-4 rounded-full border flex items-center justify-center pt-2 mb-3">
//                 <span className="w-3 h-3 rounded-full bg-[#000000] shadow mb-2"></span>
//               </div>
//               <div
//                 className="w-[2px] bg-[#7B7B7B] flex-1"
//                 style={{ minHeight: 160, height: 200 }}
//               ></div>
//               <div className="w-4 h-4 rounded-full border border-[#7B7B7B] flex items-center justify-center pt-2 mt-3">
//                 <span className="w-3 h-3 rounded-full bg-[#7B7B7B] shadow mb-2"></span>
//               </div>
//             </div>
//             <div>
//               <div className="flex flex-col gap-3">
//                 <span className="font-bold text-[#E6911E] text-lg">Pick-Up</span>
//                 <div className="text-sm text-gray-700 mt-1">Dec 28, 2025 11:00 PM</div>
//                 <div className="text-xs text-gray-500">Cairo Airport</div>
//               </div>
//               <div className="flex flex-col gap-3 mt-6">
//                 <span className="font-bold text-[#E6911E] text-lg">Drop-Off</span>
//                 <div className="text-sm text-gray-700 mt-1">Dec 31, 2025 8:00 AM</div>
//                 <div className="text-xs text-gray-500">Cairo Airport</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto mt-8">
//           <h2 className="text-2xl font-bold mb-4 text-center">Your Rental Summary</h2>
//           <div className="bg-white p-4 sm:p-8 flex flex-col md:flex-row gap-8">
//             <div className="flex-1 shadow p-4 sm:p-8 rounded-lg">
//               <h3 className="text-xl font-bold mb-4">Booking Details</h3>
//               <div className="flex flex-col gap-3 text-base">
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">Reservation Number</span>
//                   <span className="text-gray-500">wsedrtyj8465312</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">Confirmation Code</span>
//                   <span className="text-gray-500">wsedrtyj8465312</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">Rental Days</span>
//                   <span className="text-gray-500">4</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex-1 shadow p-4 sm:p-8 rounded-lg">
//               <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
//               <div className="flex flex-col gap-3 text-base">
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">Subtotal</span>
//                   <span className="text-gray-900 font-medium">$800.00</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">Tax</span>
//                   <span className="text-gray-900 font-medium">$10.00</span>
//                 </div>
//                 <div className="flex justify-between font-bold">
//                   <span>Total Rental Price</span>
//                   <span className="text-[#E6911E]">$810.00</span>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   Overall Price including rental discount
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex w-full mx-auto  px-2">
//           <div className="rounded-lg shadow p-4 sm:p-8 w-full max-w-lg">
//             <h3 className="text-2xl font-bold mb-1">Car Specification</h3>
//             <div className="text-gray-500 mb-4">Sport</div>
//             <img
//               src={carImg}
//               alt="Car"
//               className="w-full object-contain mx-auto mb-4"
//             />
//             <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6 text-gray-700 text-lg">
//               <div className="flex items-center gap-1">
//                 <span className="material-icons">
//                   <LocalGasStationIcon/>
//                 </span> Petrol
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="material-icons">
//                   <EarbudsIcon/>
//                 </span> Manual
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="material-icons">
//                   <AirlineSeatReclineExtraIcon/>
//                 </span> 05
//               </div>
//             </div>
//             <ul className="flex flex-col gap-3 mt-4">
//               {[
//                 "Free Cancellation",
//                 "Price Guarantee",
//                 "Damage Waiver",
//                 "Theft Protection",
//               ].map((feature) => (
//                 <li key={feature} className="flex items-center justify-between gap-2 text-base w-full">
//                   <span>{feature}</span>
//                   <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-500">
//                     <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
//                       <path
//                         d="M4 8.5l3 3 5-5"
//                         stroke="#fff"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BookingSuccess;
import React from "react";
import { useLocation } from "react-router-dom";
import type { CarItem } from "../context/Data/DataUser";

interface BookingDetails {
  start_date: string;
  end_date: string;
  extras: string[];
  totalPrice: number;
}

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const { carDetails, bookingDetails } = location.state as {
    carDetails: CarItem;
    bookingDetails: BookingDetails;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="booking-success">
      <div className="success-message">
        <h2>Thank you for your booking!</h2>
        <p>Your reservation has been confirmed.</p>
      </div>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="car-info">
          <img src={carDetails.image} alt={carDetails.name} loading="lazy"/>
          <h4>{carDetails.name}</h4>
          <p>{carDetails.brand} - {carDetails.type}</p>

        </div>

        <div className="timing-info">
          <div className="pickup-info">
            <h4>Pick-Up</h4>
            <p>{formatDate(bookingDetails.start_date)}</p>
            <p>{formatTime(bookingDetails.start_date)}</p>
            <p>Cairo Airport</p>
          </div>

          <div className="dropoff-info">
            <h4>Drop-Off</h4>
            <p>{formatDate(bookingDetails.end_date)}</p>
            <p>{formatTime(bookingDetails.end_date)}</p>
            <p>Cairo Airport</p>
          </div>
        </div>

        <div className="extras-info">
          <h4>Extras</h4>
          {bookingDetails.extras.length > 0 ? (
            <ul>
              {bookingDetails.extras.includes("driver") && (
                <li>Additional Driver</li>
              )}
            </ul>
          ) : (
            <p>No extras selected</p>
          )}
        </div>

        <div className="price-info">
          <h4>Total Price</h4>
          <p>${bookingDetails.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="next-steps">
        <h3>Next Steps</h3>
        <p>You will receive a confirmation email with all the details.</p>
        <button onClick={() => window.print()}>Print Confirmation</button>
      </div>
    </div>
  );
};

export default BookingSuccess;