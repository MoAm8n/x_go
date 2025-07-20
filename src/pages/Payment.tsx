// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { getBookingList } from '../context/Data/DataUser';
// import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
// import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
// import EarbudsIcon from '@mui/icons-material/Earbuds';
// import BookingStepper from '../components/uiUser/BookingStepper';
// import PaymentForm from '../components/uiUser/PaymentForm';
// import { useLocation } from 'react-router-dom';

// const Payment: React.FC = () => {
//   const navigate = useNavigate();
//   const { bookingId } = useParams<{ bookingId: string }>(); // Get bookingId from URL
//   const user = localStorage.getItem('user');
//   const [booking, setBooking] = useState<any | null>(null); // Store single booking
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const location = useLocation();
//   const { carData, bookingData, total } = location.state || {};

//   if (!carData || !bookingData) {
//       return <div>Invalid booking data</div>;
//     }
    
//   useEffect(() => {
//     if (!user) {
//       navigate('/signin', { state: { from: window.location.pathname } });
//       return;
//     }

//     const userData = JSON.parse(user);
//     const userId = userData?.id;

//     if (!userId) {
//       setError('معلومات المستخدم غير متاحة');
//       setLoading(false);
//       return;
//     }

//     const fetchBookings = async () => {
//       try {
//         const bookingData = await getBookingList();
//         const userBookings = bookingData.filter((booking) => booking.user_id === userId);
//         const uniqueBookings = userBookings.filter(
//           (booking, index, self) =>
//             index ===
//             self.findIndex(
//               (b) =>
//                 b.start_date === booking.start_date &&
//                 b.end_date === booking.end_date &&
//                 b.car_model?.id === booking.car_model?.id &&
//                 b.final_price === booking.final_price
//             )
//         );

//         // Find the specific booking by bookingId
//         const selectedBooking = uniqueBookings.find((b) => b.id === Number(bookingId));
//         if (!selectedBooking) {
//           setError('الحجز المطلوب غير موجود');
//           setLoading(false);
//           return;
//         }

//         console.log(
//           `Booking ID: ${selectedBooking.id}, Car Model: ${selectedBooking.car_model?.model_name?.name}, Image: ${
//             selectedBooking.car_model?.image
//               ? `https://xgo.ibrahimbashaa.com/${selectedBooking.car_model.image}`
//               : 'No image'
//           }`
//         );
//         setBooking(selectedBooking);
//       } catch (err) {
//         console.error('Fetch bookings error:', err);
//         setError('لا توجد حجوزات متاحة لك حاليًا');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [navigate, user, bookingId]);

//   const formatDisplayDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ar-SA', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E]"></div>
//       </div>
//     );
//   }

//   if (error || !booking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="p-4 text-center text-red-500">
//           خطأ: {error || 'الحجز غير موجود'}
//           <div className="mt-4">
//             <Link to="/booking-list" className="text-[#E6911E] hover:underline">
//               العودة إلى قائمة الحجوزات
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="container mx-auto px-2 sm:px-4 max-md:py-8">
//         <BookingStepper currentStep={3} />
//         <div className="flex flex-col md:flex-row gap-8 py-10">
//           <div className="w-full md:w-2/4">
//             <PaymentForm bookingId={booking.id} />
//           </div>
//           <div className="w-full md:w-2/4">
//             <div className="bg-white shadow-lg rounded-xl p-6">
//               <div className="flex flex-col gap-6">
//                 <div className="flex gap-6">
//                   <img
//                     src={
//                       booking.car_model?.image
//                         ? `https://xgo.ibrahimbashaa.com/${booking.car_model.image}`
//                         : '/default-car-image.jpg'
//                     }
//                     alt={booking.car_model?.model_name?.name || 'Car'}
//                     className="w-9/12 h-60 object-cover rounded-lg"
//                     loading="lazy"
//                     onError={(e) => {
//                       e.currentTarget.src = '/default-car-image.jpg';
//                       console.error(
//                         `Failed to load image for Booking ID: ${booking.id}, Car Model: ${booking.car_model?.model_name?.name}`
//                       );
//                     }}
//                   />
//                   <div className="flex flex-col justify-around items-center">
//                     <h2 className="text-xl font-bold mb-2">
//                       {booking.car_model?.model_name?.type?.brand?.name || 'غير معروف'}
//                     </h2>
//                     <p className="text-gray-500">
//                       {booking.car_model?.model_name?.name || 'غير معروف'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex-grow">
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <p className="text-gray-500">تاريخ الاستلام</p>
//                       <p className="font-medium">{formatDisplayDate(booking.start_date)}</p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(booking.start_date).toLocaleTimeString('ar-SA', {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">تاريخ التسليم</p>
//                       <p className="font-medium">{formatDisplayDate(booking.end_date)}</p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(booking.end_date).toLocaleTimeString('ar-SA', {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//                       <EarbudsIcon fontSize="small" />
//                       <span>{booking.car_model?.transmission_type || 'تلقائي'}</span>
//                     </div>
//                     <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//                       <AirlineSeatReclineExtraIcon fontSize="small" />
//                       <span>{booking.car_model?.seats_count || '4'} مقاعد</span>
//                     </div>
//                     <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//                       <LocalGasStationIcon fontSize="small" />
//                       <span>{booking.car_model?.engine_type || 'بنزين'}</span>
//                     </div>
//                   </div>
//                   <div className="mt-4 p-3 bg-amber-50 rounded-lg">
//                     <h3 className="text-amber-700 font-medium">رقم الحجز: {booking.id}</h3>
//                     <p className="text-amber-700">الحالة: {booking.status}</p>
//                     <p className="text-lg font-bold mt-2">
//                       الإجمالي: ${parseFloat(booking.final_price).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Payment;





import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingDetails from "../components/uiUser/BookingDetails";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carDetails, bookingDetails } = location.state || {};

  if (!carDetails || !bookingDetails) {
    return (
      <div className="error-message">
        <p>No booking details found. Please start your booking again.</p>
        <button onClick={() => navigate("/car-collection")}>
          Back to Cars
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    // هنا ستضيف منطق معالجة الدفع
    navigate("/booking-success", {
      state: { carDetails, bookingDetails }
    });
  };

  return (
    <div className="payment-container">
      <BookingDetails />
      
      <div className="payment-methods">
        <h2>Payment Methods</h2>
        {/* أضف خيارات الدفع هنا */}
        <button onClick={handlePayment}>Confirm Payment</button>
      </div>
    </div>
  );
};

export default Payment;