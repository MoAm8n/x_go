import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookingList } from '../context/Data/DataUser';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import EarbudsIcon from '@mui/icons-material/Earbuds';
import BookingStepper from '../components/uiUser/BookingStepper';
import PaymentForm from '../components/uiUser/PaymentForm';

interface BookingItem {
  id: number;
  start_date: string;
  end_date: string;
  final_price: string;
  status: string;
  additional_driver: number;
  car_model: {
    id: number;
    attributes: {
      year: string;
      price: string;
      engine_type: string;
      transmission_type: string;
      seats_count: number;
      image?: string;
    };
    relationship: {
      Brand?: {
        brand_id: number;
        brand_name: string;
      };
      Types?: {
        type_id: number;
        type_name: string;
      };
    };
  };
}

const Payment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingItem | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const isValidDate = (dateString: string): boolean => {
    return !isNaN(new Date(dateString).getTime());
  };

  const formatDisplayDate = (dateString: string) => {
    if (!isValidDate(dateString)) return 'Invalid date';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!isValidDate(dateString)) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBooking = useCallback(async () => {
    try {
      setLoading(true);
      const bookings = await getBookingList();
      const foundBooking = bookings.find(item => item.id.toString() === id?.toString());
      
      if (!foundBooking) {
        throw new Error(`No booking found with ID ${id}`);
      }
      
      setBooking(foundBooking);
    } catch (err: any) {
      setError(err.message || 'Error fetching booking data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getBooking();
  }, [getBooking]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E]"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-center text-red-500">
          Error: {error || 'Booking not found'}
          <div className="mt-4">
            <Link to={`/bookings`} className="text-[#E6911E] hover:underline">
              Back to bookings list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = parseFloat(booking.final_price) || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-2 sm:px-4 max-md:py-8">
        <BookingStepper currentStep={3} />
        <div className="flex flex-col md:flex-row gap-8 py-10">
          <div className="w-full md:w-2/4">
            <PaymentForm 
              booking={booking} 
              onPaymentSuccess={handlePaymentSuccess} 
            />
          </div>
          <div className="w-full md:w-2/4">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <div className="flex flex-col">
                <img
                  src={booking.car_model?.attributes?.image || '/default-car.jpg'}
                  alt={booking.car_model.relationship.Types?.type_name || 'Car'}
                  className="w-full h-60 rounded-lg"
                  loading="lazy"
                />
                <div className="flex justify-between items-start mt-4 mb-2">
                  <div>
                    <h2 className="text-xl font-bold">
                      {booking.car_model.relationship.Brand?.brand_name}{' '}
                      {booking.car_model.relationship.Types?.type_name}
                    </h2>
                    <p className="text-gray-500">{booking.car_model.attributes.year}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'Initiated'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {booking.status === 'confirmed'
                      ? 'Confirmed'
                      : booking.status === 'initiated'
                      ? 'Initiated'
                      : 'Pending'}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <EarbudsIcon fontSize="small" />
                      <span>{booking.car_model?.attributes?.transmission_type || 'Automatic'}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <AirlineSeatReclineExtraIcon fontSize="small" />
                      <span>{booking.car_model?.attributes?.seats_count || '4'} seats</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <LocalGasStationIcon fontSize="small" />
                      <span>{booking.car_model?.attributes?.engine_type || 'Gasoline'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500">Pickup Date</p>
                      <p className="font-medium">{formatDisplayDate(booking.start_date)}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(booking.start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Return Date</p>
                      <p className="font-medium">{formatDisplayDate(booking.end_date)}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(booking.end_date)}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-amber-700 font-medium">Booking ID: {booking.id}</h3>
                  <p className="text-amber-700">Status: {booking.status}</p>
                  <div className="mt-4 p-3 text-center bg-amber-50 rounded-lg">
                    <p className="text-lg font-bold mt-2">
                      Total: $<span className='text-[]'>{finalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;