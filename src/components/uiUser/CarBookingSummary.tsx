// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { getBooking } from "../../context/Data/DataUser";
// import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
// import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
// import EarbudsIcon from "@mui/icons-material/Earbuds";
// // import SpeedIcon from '@mui/icons-material/Speed';
// const CarBookingSummary: React.FC = () => {
//   const { bookingId } = useParams<{ bookingId: string }>();
//   const [booking, setBooking] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         if (!bookingId) {
//           throw new Error("Booking ID is missing");
//         }

//         const response = await getBooking(bookingId);
//         console.log("API Response:", response); // للتتبع
        
//         if (response?.bookingData) {
//           setBooking(response.bookingData);
//         } else {
//           throw new Error("Invalid booking data structure");
//         }
//       } catch (err) {
//         console.error("Fetch booking error:", err);
//         setError(err.message || "Failed to load booking data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooking();
//   }, [bookingId]);

//   if (loading) {
//     return <div className="p-4 text-center">Loading booking details...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-center text-red-500">Error: {error}</div>;
//   }

//   if (!booking) {
//     return <div className="p-4 text-center">No booking data found</div>;
//   }

//   // دالة مساعدة لتنسيق التاريخ
//   const formatDisplayDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div className="shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="flex-shrink-0">
//           <img
//             src={booking.carmodel?.image || '/default-car-image.jpg'}
//             alt={booking.carmodel?.model_name?.name || 'Car'}
//             className="w-64 h-36 object-cover rounded-lg"
//           />
//         </div>

//         <div className="flex-grow">
//           <h2 className="text-xl font-bold mb-2">
//             {booking.carmodel?.model_name?.name || 'Unknown Model'}
//           </h2>
          
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div>
//               <p className="text-gray-500">Pick-Up</p>
//               <p className="font-medium">{formatDisplayDate(booking.start_date)}</p>
//               <p className="text-sm text-gray-500">
//                 {new Date(booking.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-500">Drop-Off</p>
//               <p className="font-medium">{formatDisplayDate(booking.end_date)}</p>
//               <p className="text-sm text-gray-500">
//                 {new Date(booking.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 mb-4">
//             <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//               <EarbudsIcon fontSize="small" />
//               <span>{booking.carmodel?.transmission_type || 'Automatic'}</span>
//             </div>
//             <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//               <AirlineSeatReclineExtraIcon fontSize="small" />
//               <span>{booking.carmodel?.seats_count || '4'} Seats</span>
//             </div>
//             <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//               <LocalGasStationIcon fontSize="small" />
//               <span>{booking.carmodel?.engine_type || 'Gasoline'}</span>
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-amber-50 rounded-lg">
//             <h3 className="text-amber-700 font-medium">Booking Reference: {booking.id}</h3>
//             <p className="text-amber-700">Status: {booking.status}</p>
//             <p className="text-lg font-bold mt-2">Total: ${booking.final_price?.toLocaleString()}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarBookingSummary;




// import React, { useState, useEffect } from "react";
// import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
// import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
// import EarbudsIcon from "@mui/icons-material/Earbuds";
// import SpeedIcon from '@mui/icons-material/Speed';
// import { useParams } from "react-router-dom";
// import { getBooking } from "../../context/Data/DataUser";

// interface CarBookingSummaryProps {
//   carImage?: string;
//   carName?: string;
// }

// const CarBookingSummary: React.FC<CarBookingSummaryProps> = () => {
//   const { bookingId } = useParams();
//   const [bookingData, setBookingData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   useEffect(() => {
//     const fetchBookingData = async () => {
//       try {
//         if (!bookingId) return;
        
//         setLoading(true);
//         const response = await getBooking(bookingId);
//         setBookingData(response.bookingData);
//       } catch (err) {
//         console.error("Error fetching booking:", err);
//         setError("Failed to load booking data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookingData();
//   }, [bookingId]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!bookingData) return <div>No booking data found</div>;

//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = { 
//       weekday: 'short', 
//       day: 'numeric', 
//       month: 'short', 
//       year: 'numeric' 
//     };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   return (
//     <div className="shadow-lg rounded-xl flex flex-col items-center">
//       <div className="flex w-full px-6 max-md:flex-col">
//         <img
//           src={bookingData.carmodel.image}
//           alt={bookingData.carmodel.model_name.name}
//           className="lg:w-40 lg:h-24 object-cover rounded-lg mb-4"
//         />
//         <div className="p-3">
//           <h2 className="font-semibold text-lg mb-1">
//             {bookingData.carmodel.model_name.name}
//           </h2>
//           <p className="mb-2">{bookingData.carmodel.model_name.type.name}</p>
//         </div>
//       </div>
//       <div className="w-full gap-4 flex flex-col px-6">
//         <div className="flex gap-4">
//           <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg">
//             <EarbudsIcon className="text-[#7B7B7B]" />
//             <span className="text-base font-medium text-[#7B7B7B]">
//               {bookingData.carmodel.transmission_type}
//             </span>
//           </div>
//           <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg">
//             <AirlineSeatReclineExtraIcon className="text-[#7B7B7B]"/>
//             <span className="text-base font-medium text-[#7B7B7B]">
//               {bookingData.carmodel.seats_count} Seats
//             </span>
//           </div>
//           <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg">
//             <SpeedIcon className="text-[#7B7B7B]"/>
//             <span className="text-base font-medium text-[#7B7B7B]">
//               {bookingData.carmodel.acceleration}
//             </span>
//           </div>
//           <div className="flex justify-center gap-2 items-center border border-[#cdcac5] w-[140px] h-[37px] rounded-lg">
//             <LocalGasStationIcon className="text-[#7B7B7B]"/>
//             <span className="text-base font-medium text-[#7B7B7B]">
//               {bookingData.carmodel.engine_type}
//             </span>
//           </div>
//         </div>
        
//         <h3 className="text-[#E6911E] font-medium text-[16px]">Your Booking Details</h3>
        
//         <div className="flex justify-between">
//           <div className="mb-2 flex flex-col gap-2">
//             <p className="text-[#7B7B7B]">Pick-Up</p>
//             <h3>{formatDate(bookingData.start_date)}</h3>
//             <p className="text-[#7B7B7B]">
//               {new Date(bookingData.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//             </p>
//           </div>
//           <div className="mb-2 flex flex-col gap-2">
//             <p className="text-[#7B7B7B]">Drop-Off</p>
//             <h3>{formatDate(bookingData.end_date)}</h3>
//             <p className="text-[#7B7B7B]">
//               {new Date(bookingData.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex flex-col gap-2 mb-4">
//           <p className="text-[#7B7B7B]">You Selected</p>
//           <h2>
//             {bookingData.carmodel.model_name.name}, 
//             {bookingData.carmodel.seats_count} Seats, 
//             {bookingData.carmodel.transmission_type}
//           </h2>
//           <p className="text-[#E6911E]">Change Your Selection</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarBookingSummary;