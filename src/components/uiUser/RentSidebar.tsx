// import React, { useState } from "react";
// import type { CarItem, BookingData } from "../../context/Data/DataUser";
// import { saveBooking } from "../../context/Data/DataUser";
// import { useNavigate } from "react-router-dom";

// interface ExtraItem {
//   label: string;
//   price: number;
//   id: string;
// }

// interface RentSidebarProps {
//   car: CarItem;
//   carId: string;
// }

// interface UserData {
//   id: string;
//   email: string;
//   name?: string;
// }

// const extrasList: ExtraItem[] = [
//   { label: "Additional Driver", price: 55, id: "driver" },
// ];

// const formatDate = (dateString: string, time: string = "00:00"): string => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day} ${time}`;
// };

// const RentSidebar: React.FC<RentSidebarProps> = ({ car, carId }) => {
//   const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
//   const [pickupDate, setPickupDate] = useState<string>("");
//   const [dropoffDate, setDropoffDate] = useState<string>("");
//   const [isBooking, setIsBooking] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);

//     if (!pickupDate || !dropoffDate) {
//       setError("Please select pickup and drop-off dates");
//       return;
//     }
    
//     if (pickupDate > dropoffDate) {
//       setError("Pickup date must be before drop-off date");
//       return;
//     }

//     const today = new Date().toISOString().split('T')[0];
//     if (pickupDate < today) {
//       setError("Pickup date cannot be in the past");
//       return;
//     }

//     try {
//       const userData = localStorage.getItem('user');
//       if (!userData) {
//         navigate('/signup', { state: { from: location.pathname } });
//         return;
//       }

//       const user: UserData = JSON.parse(userData);
    
//       const startDate = new Date(pickupDate);
//       startDate.setHours(10, 0, 0, 0);
//       const endDate = new Date(dropoffDate);
//       endDate.setHours(10, 0, 0, 0);

      
//       const bookingData: BookingData = {
//         start_date: new Date(pickupDate).toISOString(),
//         end_date: new Date(dropoffDate).toISOString(),
//         carmodel_id: carId,
//         user_id: user.id,
//         additional_driver: selectedExtras.includes("driver") ? "1" : "0",
//         pickup_location: "Egypt",
//         dropoff_location: "Egypt"
//       };
//       setIsBooking(true);
//     console.log("بيانات الحجز المرسلة:", bookingData); // <-- أضف هذا السطر

//       const res = await saveBooking(carId, bookingData);
//           console.log("الرد من الخادم:", res); // <-- أضف هذا السطر

//       navigate(`/booking/${res.bookingId}/payment`, {
//         state: {
//           carData: car, 
//           bookingData: res.bookingData,
//           total: res.bookingData.final_price
//         }
//       });
//     } catch (err) {
//       console.error("Booking error:", err);
//       setError("Failed to complete booking. Please try again.");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const handleExtraToggle = (extraId: string) => {
//     setSelectedExtras(prev =>
//       prev.includes(extraId) 
//         ? prev.filter(id => id !== extraId) 
//         : [...prev, extraId]
//     );
//   };

//   const calculateTotal = (): number => {
//     if (!car?.price) return 0;

//     const tax = 50;
//     const basePrice = typeof car.price === "number" 
//       ? car.price 
//       : parseFloat(car.price);
      
//     const extrasTotal = extrasList.reduce(
//       (sum, extra) => selectedExtras.includes(extra.id) ? sum + extra.price : sum,
//       0
//     );

//     return basePrice + tax + extrasTotal;
//   };

//   const total = calculateTotal();

//   return (
//     <form 
//       onSubmit={handleBooking} 
//       className="gap-5 border border-[#cdcac5] border-opacity-30 rounded-xl shadow mt-10 p-6 w-full mx-auto"
//       aria-labelledby="rental-form-heading"
//     >
//       <h2 id="rental-form-heading" className="text-lg font-semibold text-center mb-4">
//         Rent This Vehicle
//       </h2>

//       {error && (
//         <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
//           {error}
//         </div>
//       )}

//       <div className="space-y-4">
//         {/* Date Pickers */}
//         <div className="space-y-2">
//           <label htmlFor="pickup-date" className="block text-sm font-medium">
//             Pick-Up Date
//           </label>
//           <input
//             id="pickup-date"
//             type="date"
//             value={pickupDate}
//             onChange={(e) => setPickupDate(e.target.value)}
//             className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#E6911E] border-[#cdcac5]"
//             min={new Date().toISOString().split("T")[0]}
//             required
//             aria-required="true"
//           />
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="dropoff-date" className="block text-sm font-medium">
//             Drop-Off Date
//           </label>
//           <input
//             id="dropoff-date"
//             type="date"
//             value={dropoffDate}
//             onChange={(e) => setDropoffDate(e.target.value)}
//             className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#E6911E] border-[#cdcac5]"
//             min={pickupDate || new Date().toISOString().split("T")[0]}
//             required
//             aria-required="true"
//           />
//         </div>

//         {/* Extras */}
//         <fieldset className="space-y-3">
//           <legend className="text-sm font-bold mb-1">Add Extra:</legend>
//           {extrasList.map((extra) => (
//             <div key={extra.id} className="flex items-center justify-between">
//               <label htmlFor={`extra-${extra.id}`} className="flex items-center cursor-pointer">
//                 <input
//                   id={`extra-${extra.id}`}
//                   type="checkbox"
//                   checked={selectedExtras.includes(extra.id)}
//                   onChange={() => handleExtraToggle(extra.id)}
//                   className={`w-4 h-4 mr-2 rounded border focus:ring-0 focus:ring-offset-0 transition-colors duration-200 ${
//                     selectedExtras.includes(extra.id)
//                       ? "bg-[#E6911E] border-[#E6911E]"
//                       : "border-[#aaa9a8]"
//                   }`}
//                 />
//                 <span className="text-sm font-medium">{extra.label}</span>
//               </label>
//               <span className="text-sm">${extra.price.toFixed(2)}</span>
//             </div>
//           ))}
//         </fieldset>

//         {/* Pricing Summary */}
//         <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Sub Total</span>
//             <span className="font-medium">
//               ${typeof car.price === "number"
//                 ? car.price.toLocaleString()
//                 : parseFloat(car.price).toLocaleString()}
//             </span>
//           </div>
          
//           <div className="flex justify-between">
//             <span>Tax</span>
//             <span>$50.00</span>
//           </div>
          
//           {selectedExtras.length > 0 && (
//             <div className="flex justify-between">
//               <span>Extras</span>
//               <span>
//                 ${extrasList
//                   .filter(extra => selectedExtras.includes(extra.id))
//                   .reduce((sum, extra) => sum + extra.price, 0)
//                   .toFixed(2)}
//               </span>
//             </div>
//           )}
          
//           <div className="flex justify-between font-semibold text-base pt-2">
//             <span>Total Payable</span>
//             <span className="text-[#E6911E]">${total.toFixed(2)}</span>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-[#E6911E] hover:bg-[#E6911E]/90 font-semibold py-2 rounded-xl mt-2 transition text-center text-white disabled:opacity-70"
//           aria-busy={isBooking}
//         >
//           {isBooking ? "Processing Booking..." : "Book Now"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default RentSidebar;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveBooking } from "../../context/Data/DataUser";
import type { CarItem, BookingData } from "../../context/Data/DataUser";

interface RentSidebarProps {
  car: CarItem;
  carId: string;
}

const locations = [
  "Cairo Airport",
  "Alexandria",
  "Giza",
  "Luxor",
  "Aswan",
  "Sharm El Sheikh"
];

const extrasList = [
  { label: "Additional Driver", price: 55, id: "driver" }
];

const RentSidebar: React.FC<RentSidebarProps> = ({ car, carId }) => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState(locations[0]);
  const [dropoffLocation, setDropoffLocation] = useState(locations[0]);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pickupDate || !dropoffDate) {
      setError("الرجاء تحديد تاريخي الاستلام والتسليم");
      return;
    }

    const startDateTime = `${pickupDate}T${pickupTime}:00`;
    const endDateTime = `${dropoffDate}T${dropoffTime}:00`;

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        const tempBookingData = {
          start_date: startDateTime,
          end_date: endDateTime,
          carmodel_id: carId,
          additional_driver: selectedExtras.includes("driver") ? "1" : "0",
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          carDetails: car,
          extras: selectedExtras,
          totalPrice: calculateTotal()
        };
        
        localStorage.setItem('tempBookingData', JSON.stringify(tempBookingData));
        
        navigate('/signin', { 
          state: { 
            from: location.pathname,
            tempBookingData 
          } 
        });
        return;
      }

      const user = JSON.parse(userData);
      
      const bookingData: BookingData = {
        start_date: startDateTime,
        end_date: endDateTime,
        carmodel_id: carId,
        user_id: user.id,
        additional_driver: selectedExtras.includes("driver") ? "1" : "0",
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation
      };

      setIsBooking(true);
      const res = await saveBooking(carId, bookingData);
      
      navigate(`/bookings/${res.bookingId}`, {
        state: {
          carDetails: car,
          bookingDetails: {
            ...bookingData,
            extras: selectedExtras,
            totalPrice: calculateTotal()
          }
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحجز، الرجاء المحاولة لاحقاً");
    } finally {
      setIsBooking(false);
    }
  };

  const calculateTotal = (): number => {
    const basePrice = typeof car.price === "number" ? car.price : parseFloat(car.price);
    const extrasTotal = selectedExtras.includes("driver") ? 55 : 0;
    const tax = 50;
    return basePrice + extrasTotal + tax;
  };

  return (
    <form onSubmit={handleBooking} className="rental-form rounded-xl bg-[#F7F8FA] hover:shadow-lg p-2 cursor-pointer">
      <h2 className="text-xl font-bold py-4">Rent This Vehicle</h2>
      
      {error && <div className="error-message text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block mb-2">Pick-Up</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="form-group">
          <label className="block mb-2">Pick-Up Time</label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="form-group">
          <label className="block mb-2">Droo-Off</label>
          <input
            type="date"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            min={pickupDate || new Date().toISOString().split("T")[0]}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="form-group">
          <label className="block mb-2">Drop-Off Time</label>
          <input
            type="time"
            value={dropoffTime}
            onChange={(e) => setDropoffTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="my-4">
        <h3 className="font-medium mb-2">Pick-Up Location</h3>
        <select
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {locations.map((loc) => (
            <option key={`pickup-${loc}`} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="my-4">
        <h3 className="font-medium mb-2">Drop-Off Location</h3>
        <select
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {locations.map((loc) => (
            <option key={`dropoff-${loc}`} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="extras-section my-4">
        <h3 className="font-medium mb-2">Add Extra:</h3>
        {extrasList.map((extra) => (
          <label key={extra.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedExtras.includes(extra.id)}
              onChange={() => 
                setSelectedExtras(prev =>
                  prev.includes(extra.id)
                    ? prev.filter(id => id !== extra.id)
                    : [...prev, extra.id]
                )
              }
              className="mr-2"
            />
            {extra.label} (+${extra.price})
          </label>
        ))}
      </div>

      <div className="price-summary bg-gray-50 p-4 rounded-lg my-4">
        <h3 className="font-bold mb-3">Price Summary:</h3>
        <div className="price-row flex justify-between mb-2">
          <span>Sub Total:</span>
          <span>${typeof car.price === "number" ? car.price : parseFloat(car.price)}</span>
        </div>
        {selectedExtras.length > 0 && (
          <div className="price-row flex justify-between mb-2">
            <span>Extra:</span>
            <span>${selectedExtras.includes("driver") ? 55 : 0}</span>
          </div>
        )}
        <div className="price-row flex justify-between mb-2">
          <span>Tax:</span>
          <span>$50</span>
        </div>
        <div className="price-row flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total:</span>
          <span className="text-[#E6911E]">${calculateTotal()}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isBooking}
        className="w-full bg-[#E6911E] hover:bg-[#D6820E] text-white py-3 rounded-lg transition-colors"
      >
        {isBooking ? "Processing..." : "Book Now"}
      </button>
    </form>
  );
};

export default RentSidebar;