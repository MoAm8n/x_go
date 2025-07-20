// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getBookingList } from '../context/Data/DataUser';
// import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
// import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
// import EarbudsIcon from '@mui/icons-material/Earbuds';
// import BookingStepper from '../components/uiUser/BookingStepper';

// const BookingList: React.FC = () => {
//   const navigate = useNavigate();
//   const user = localStorage.getItem('user');
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!user) {
//       navigate('/signin');
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
//         uniqueBookings.forEach((booking) =>
//           console.log(
//             `Booking ID: ${booking.id}, Car Model: ${booking.car_model?.model_name?.name}, Image: ${
//               booking.car_model?.image ? `https://xgo.ibrahimbashaa.com/${booking.car_model.image}` : 'No image'
//             }`
//           )
//         );
//         setBookings(uniqueBookings);
//       } catch (err) {
//         console.error('Fetch bookings error:', err);
//         setError('لا توجد حجوزات متاحة لك حاليًا');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [navigate, user]);

//   const formatDisplayDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ar-SA', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     });
//   };

//   const calculateTotal = () => {
//     return bookings
//       .reduce((total, booking) => total + parseFloat(booking.final_price || '0'), 0)
//       .toFixed(2);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E]"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="p-4 text-center text-red-500">
//           خطأ: {error}
//           <div className="mt-4">
//             <Link to="/cartCollection" className="text-[#E6911E] hover:underline">
//               تصفح السيارات
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="container mx-auto px-2 sm:px-4 max-md:py-6">
//         <BookingStepper currentStep={2} />
//         <div className="flex flex-col md:flex-row gap-8 mt-8">
//           <div className="w-full md:w-3/5 mb-6 md:mb-0">
//             <div className="bg-white flex flex-col gap-12">
//               {bookings.map((booking) => (
//                 <div key={booking.id} className="shadow-lg rounded-xl p-6">
//                   <div className="flex flex-col gap-6">
//                     <div className="flex gap-20">
//                       <img
//                         src={booking.car_model?.image ? `https://xgo.ibrahimbashaa.com/${booking.car_model.image}` : '/default-car-image.jpg'}
//                         alt={booking.car_model?.model_name?.name || 'Car'}
//                         className="w-9/12 h-60 object-cover rounded-lg"
//                         loading="lazy"
//                         onError={(e) => {
//                           e.currentTarget.src = '/default-car-image.jpg';
//                           console.error(`Failed to load image for Booking ID: ${booking.id}, Car Model: ${booking.car_model?.model_name?.name}`);
//                         }}
//                       />
//                       <div className='flex flex-col justify-around items-center'>
//                         <h2 className="text-xl font-bold mb-2">
//                           {booking.car_model?.model_name?.type?.brand?.name || 'غير معروف'}
//                         </h2>
//                         <p className="text-gray-500">
//                           {booking.car_model?.model_name?.name || 'غير معروف'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex-grow">
//                       <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <p className="text-gray-500">تاريخ الاستلام</p>
//                           <p className="font-medium">{formatDisplayDate(booking.start_date)}</p>
//                           <p className="text-sm text-gray-500">
//                             {new Date(booking.start_date).toLocaleTimeString('ar-SA', {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">تاريخ التسليم</p>
//                           <p className="font-medium">{formatDisplayDate(booking.end_date)}</p>
//                           <p className="text-sm text-gray-500">
//                             {new Date(booking.end_date).toLocaleTimeString('ar-SA', {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//                           <EarbudsIcon fontSize="small" />
//                           <span>{booking.car_model?.transmission_type || 'تلقائي'}</span>
//                         </div>
//                         <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//                           <AirlineSeatReclineExtraIcon fontSize="small" />
//                           <span>{booking.car_model?.seats_count || '4'} مقاعد</span>
//                         </div>
//                         <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
//                           <LocalGasStationIcon fontSize="small" />
//                           <span>{booking.car_model?.engine_type || 'بنزين'}</span>
//                         </div>
//                       </div>
//                       <div className="mt-4 p-3 bg-amber-50 rounded-lg">
//                         <h3 className="text-amber-700 font-medium">رقم الحجز: {booking.id}</h3>
//                         <p className="text-amber-700">الحالة: {booking.status}</p>
//                         <p className="text-lg font-bold mt-2">الإجمالي: ${parseFloat(booking.final_price).toFixed(2)}</p>
//                       </div>
//                       {booking.status === 'initiated' && (
//                         <Link
//                           to={`/booking/${booking.id}/payment`}
//                           className="mt-4 inline-block bg-[#E6911E] rounded-3xl h-12 w-full text-white text-center leading-[3rem]"
//                         >
//                           الانتقال إلى الدفع
//                         </Link>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div className="shadow-lg rounded-xl flex flex-col pb-5 gap-3">
//                 <div className="flex justify-between items-center w-full mb-1 py-3 px-8 rounded-t-xl text-white bg-[#E6911E]">
//                   <span className="font-bold text-base">الإجمالي</span>
//                   <span className="font-bold">${calculateTotal()}</span>
//                 </div>
//                 <div className="flex flex-col gap-3 px-8">
//                   <h3>معلومات السعر</h3>
//                   <p className="text-gray-500">شامل الضرائب والرسوم</p>
//                 </div>
//                 <div className="text-gray-400 px-8">
//                   <div className="flex justify-between">
//                     <p>الضريبة</p>
//                     <p>${(parseFloat(calculateTotal()) * 0.14).toFixed(2)}</p>
//                   </div>
//                   <div className="flex justify-between">
//                     <p>المبلغ الفرعي</p>
//                     <p>${(parseFloat(calculateTotal()) * 0.86).toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="w-full md:w-2/5 flex flex-col gap-6">
//             <div className="bg-white rounded-xl p-6 flex flex-col gap-8">
//               <h3 className="font-bold text-center text-lg mb-4">
//                 {user ? 'أكمل حجوزاتك' : 'الحجز يتطلب حسابًا — سجل الدخول أو أنشئ حسابًا للمتابعة'}
//               </h3>
//               {!user ? (
//                 <div className="flex flex-col gap-4">
//                   <Link to="/signin">
//                     <button className="bg-[#E6911E] rounded-3xl h-12 w-full text-white">
//                       تسجيل الدخول
//                     </button>
//                   </Link>
//                   <Link to="/signup">
//                     <button className="bg-[#E6911E] rounded-3xl h-12 w-full text-white">
//                       إنشاء حساب
//                     </button>
//                   </Link>
//                   <div className="text-sm text-center">
//                     ليس لديك حساب؟{' '}
//                     <Link to="/signup" className="text-[#E6911E] hover:underline">
//                       إنشاء حساب
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-center text-gray-500">
//                   يمكنك إكمال الدفع لكل حجز من خلال النقر على "الانتقال إلى الدفع" في الحجز المطلوب.
//                 </p>
//               )}
//               <div className="shadow rounded-md p-6 md:p-8 mt-8 mx-auto w-full">
//                 <h2 className="text-2xl font-bold mb-4">Terms and Condition</h2>
//                 <div>
//                   <h3>Payments</h3>
//                   <div className="tit">
//                     <ol className="list-disc mt-2">
//                       <li className="text-gray-500 text-base">
//                         Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc mattis aliquam arcu sed. Diam in nisl maecenas sed lacus sit ligula. Id nulla felis pulvinar sed eu vel proin ultricies elementum. Id odio ultrices sed arcu velit condimentum at purus duis. Morbi arcu sed mauris
//                       </li>
//                       <li className="text-gray-500 text-base">
//                         Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc mattis aliquam arcu sed. Diam in nisl maecenas sed lacus sit ligula. Id nulla felis pulvinar sed eu vel proin ultricies elementum. Id odio ultrices sed arcu velit condimentum at purus duis. Morbi arcu sed mauris
//                       </li>
//                       <li className="text-gray-500 text-base">
//                         Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc mattis aliquam arcu sed. Diam in nisl maecenas sed lacus sit ligula. Id nulla felis pulvinar sed eu vel proin ultricies elementum. Id odio ultrices sed arcu velit condimentum at purus duis. Morbi arcu sed mauris
//                       </li>
//                     </ol>
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <h3>Contact Us</h3>
//                   <p className="text-gray-500 text-base">
//                     Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc mattis aliquam arcu sed. Diam in nisl maecenas sed lacus sit ligula. Id nulla felis pulvinar sed eu vel proin ultricies elementum. Id odio ultrices sed arcu velit condimentum at purus duis. Morbi arcu sed mauris
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BookingList;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookingList } from '../context/Data/DataUser';
import BookingStepper from '../components/uiUser/BookingStepper';

interface BookingItem {
  id: number;
  user_id: number;
  carmodel_id: number;
  start_date: string;
  end_date: string;
  final_price: string;
  status: string;
  pickup_location?: string;
  dropoff_location?: string;
  car_model: {
    id: number;
    year: string;
    price: string;
    engine_type: string;
    transmission_type: string;
    seats_count: number;
    image?: string;
    model_name: {
      id: number;
      name: string;
      type: {
        id: number;
        name: string;
        brand: {
          id: number;
          name: string;
        };
      };
    };
  };
}

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>(id ? 'details' : 'list');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      if (!user) {
        navigate('/signin');
        return;
      }

      setLoading(true);
      setError(null);

      const bookingData = await getBookingList();
      
      setBookings(bookingData);

      if (id) {
        const foundBooking = bookingData.find(
          (b: BookingItem) => b.id === parseInt(id)
        );
        
        if (foundBooking) {
          setSelectedBooking(foundBooking);
        } else {
          setError('الحجز المطلوب غير موجود');
          setViewMode('list');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ أثناء جلب بيانات الحجوزات');
    } finally {
      setLoading(false);
    }
  }, [user, id, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [fetchData, user?.id]);

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleDateString('ar-SA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'تاريخ غير محدد';
    }
  };

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const handleViewDetails = useCallback((booking: BookingItem) => {
    setSelectedBooking(booking);
    setViewMode('details');
    navigate(`/bookings/${booking.id}`);
  }, [navigate]);

  const handleBackToList = useCallback(() => {
    setViewMode('list');
    navigate('/bookings');
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E] mb-4"></div>
        <p className="text-gray-600">جاري تحميل بيانات الحجوزات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-center text-red-500">
          خطأ: {error}
          <div className="mt-4 flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#E6911E] text-white px-4 py-2 rounded-lg"
            >
              إعادة المحاولة
            </button>
            <button 
              onClick={handleBackToList}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              العودة إلى القائمة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <BookingStepper currentStep={2} />
        <h1 className="text-2xl font-bold mb-6">حجوزاتي</h1>

        {viewMode === 'list' ? (
          <>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">لا توجد حجوزات متاحة</p>
                <button 
                  onClick={() => navigate('/car-collection')}
                  className="bg-[#E6911E] text-white px-6 py-2 rounded-lg"
                >
                  تصفح السيارات
                </button>
              </div> 
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <BookingCard 
                    key={booking.id}
                    booking={booking}
                    formatDisplayDate={formatDisplayDate}
                    formatTime={formatTime}
                    handleViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </>
        ) : selectedBooking ? (
          <BookingDetails 
            selectedBooking={selectedBooking}
            handleBackToList={handleBackToList}
            formatDisplayDate={formatDisplayDate}
            formatTime={formatTime}
          />
        ) : null}
      </main>
    </div>
  );
};

const BookingCard: React.FC<{
  booking: BookingItem;
  formatDisplayDate: (date: string) => string;
  formatTime: (date: string) => string;
  handleViewDetails: (booking: BookingItem) => void;
}> = ({ booking, formatDisplayDate, formatTime, handleViewDetails }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img
            src={booking.car_model?.image 
              ? `https://xgo.ibrahimbashaa.com/${booking.car_model.image}`
              : '/default-car.jpg'
            }
            alt={booking.car_model?.model_name?.name || 'Car'}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-car.jpg';
            }}
          />
        </div>
        <div className="md:w-2/3">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">
              {booking.car_model?.model_name?.type?.brand?.name || 'غير معروف'} 
              {booking.car_model?.model_name?.name || 'غير معروف'}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {booking.status === 'confirmed' ? 'مؤكد' :
               booking.status === 'cancelled' ? 'ملغى' :
               'قيد الانتظار'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">تاريخ الاستلام</p>
              <p className="font-medium">{formatDisplayDate(booking.start_date)}</p>
              <p className="text-xs text-gray-500">{formatTime(booking.start_date)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">تاريخ التسليم</p>
              <p className="font-medium">{formatDisplayDate(booking.end_date)}</p>
              <p className="text-xs text-gray-500">{formatTime(booking.end_date)}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-lg font-bold text-[#E6911E]">
              ${parseFloat(booking.final_price).toFixed(2)}
            </p>
            <button
              onClick={() => handleViewDetails(booking)}
              className="bg-[#E6911E] hover:bg-[#D6820E] text-white px-4 py-2 rounded-lg transition-colors"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BookingDetails: React.FC<{
  selectedBooking: BookingItem;
  handleBackToList: () => void;
  formatDisplayDate: (date: string) => string;
  formatTime: (date: string) => string;
}> = ({ selectedBooking, handleBackToList, formatDisplayDate, formatTime }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <button 
        onClick={handleBackToList}
        className="flex items-center text-[#E6911E] hover:text-[#D6820E] mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        العودة إلى القائمة
      </button>
      
      <h1 className="text-2xl font-bold mb-6">تفاصيل الحجز</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">معلومات السيارة</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={selectedBooking.car_model?.image 
                    ? `https://xgo.ibrahimbashaa.com/${selectedBooking.car_model.image}`
                    : '/default-car.jpg'
                  }
                  alt={selectedBooking.car_model?.model_name?.name || 'Car'}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-car.jpg';
                  }}
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-lg font-semibold">
                  {selectedBooking.car_model?.model_name?.type?.brand?.name || 'غير معروف'} 
                  {selectedBooking.car_model?.model_name?.name || 'غير معروف'}
                </h3>
                <p className="text-gray-500">{selectedBooking.car_model?.year}</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500">نوع الناقل</p>
                    <p>{selectedBooking.car_model?.transmission_type || 'غير معروف'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">عدد المقاعد</p>
                    <p>{selectedBooking.car_model?.seats_count || 'غير معروف'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">نوع الوقود</p>
                    <p>{selectedBooking.car_model?.engine_type || 'غير معروف'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">السعر اليومي</p>
                    <p>${selectedBooking.car_model?.price || 'غير معروف'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">تفاصيل الحجز</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">معلومات الاستلام</h3>
                <p className="text-gray-500">التاريخ والوقت</p>
                <p className="font-medium">{formatDisplayDate(selectedBooking.start_date)}</p>
                <p className="text-xs text-gray-500">{formatTime(selectedBooking.start_date)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">معلومات التسليم</h3>
                <p className="text-gray-500">التاريخ والوقت</p>
                <p className="font-medium">{formatDisplayDate(selectedBooking.end_date)}</p>
                <p className="text-xs text-gray-500">{formatTime(selectedBooking.end_date)}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-bold mb-4">ملخص الدفع</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>السعر اليومي</span>
                <span>${selectedBooking.car_model?.price || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>عدد الأيام</span>
                <span>{
                  Math.ceil(
                    (new Date(selectedBooking.end_date).getTime() - 
                    new Date(selectedBooking.start_date).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  )
                }</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>المجموع</span>
                  <span className="text-[#E6911E]">${parseFloat(selectedBooking.final_price).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">حالة الحجز</h3>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  selectedBooking.status === 'confirmed' ? 'bg-green-500' :
                  selectedBooking.status === 'cancelled' ? 'bg-red-500' :
                  'bg-amber-500'
                }`}></span>
                <span>
                  {selectedBooking.status === 'confirmed' ? 'تم التأكيد' :
                  selectedBooking.status === 'cancelled' ? 'ملغى' :
                  'في انتظار الدفع'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BookingsPage;