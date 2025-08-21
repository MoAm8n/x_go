import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookingList } from '../context/Data/DataUser';
import { t } from 'i18next';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import EarbudsIcon from '@mui/icons-material/Earbuds';
import BookingStepper from '../components/uiUser/BookingStepper';
import PaymentForm from '../components/uiUser/PaymentForm';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export interface ModelName {
  model_name_id: string;
  model_name: string;
}

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
      Model_Names?: ModelName;
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
    return new Date(dateString).toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!isValidDate(dateString)) return '';
    return new Date(dateString).toLocaleTimeString('en', {
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
        throw new Error(t('payment.no_booking_found', { id }));
      }
      
      setBooking(foundBooking);
    } catch (err: any) {
      setError(err.message || t('payment.error_fetching_booking'));
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
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E]"></div>
        <p className="mr-4">{t('payment.loading')}</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="p-4 text-center text-red-500">
          {t('payment.error')}: {error || t('payment.booking_not_found')}
          <div className="mt-4">
            <Link to={`/bookings`} className="text-[#E6911E] hover:underline">
              {t('payment.back_to_bookings')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = parseFloat(booking.final_price) || 0;
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
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
                  alt={`${t(`brand.${booking.car_model.relationship.Brand?.brand_name}`) || t('payment.unknown')} ${
                    t(`name.${booking.car_model.relationship.Model_Names?.model_name}`) || t('payment.unknown')
                  }`}
                  className="w-full h-60 rounded-lg"
                  loading="lazy"
                />
                <div className="flex justify-between items-start mt-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold">
                        {t(`brand.${booking.car_model.relationship.Brand?.brand_name}`) || t('payment.unknown')}{' '}
                      </h2>
                      ({t(`name.${booking.car_model.relationship.Model_Names?.model_name}`) || t('payment.unknown')})
                    </div>
                    <p className="text-gray-500">{booking.car_model.attributes.year || t('payment.unknown')}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'initiated'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t(`status.${booking.status.toLowerCase()}`) || t('payment.pending')}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <DirectionsCarIcon fontSize="small" />
                      <span>{t(`name.${booking.car_model.relationship.Types?.type_name}`) || t('payment.automatic')}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <EarbudsIcon fontSize="small" />
                      <span>{t(`type.${booking.car_model?.attributes?.transmission_type}`) || t('payment.automatic')}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <AirlineSeatReclineExtraIcon fontSize="small" />
                      <span>{booking.car_model?.attributes?.seats_count || '4'} {t('payment.seats')}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <LocalGasStationIcon fontSize="small" />
                      <span>{t(`Gasoline.${booking.car_model?.attributes?.engine_type}`) || t('payment.petrol')}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500">{t('payment.pickup_date')}</p>
                      <p className="font-medium">{formatDisplayDate(booking.start_date)}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(booking.start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('payment.return_date')}</p>
                      <p className="font-medium">{formatDisplayDate(booking.end_date)}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(booking.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <h3 className="text-amber-700 font-medium">{t('payment.booking_id', { id: booking.id })}</h3>
                    <p className="text-amber-700">{t('payment.status')}: {t(`status.${booking.status.toLowerCase()}`) || t('payment.pending')}</p>
                  </div>
                  <div className="mt-4 p-3 text-center bg-amber-50 rounded-lg">
                    <p className="text-lg font-bold mt-2">
                      {t('payment.total')}:<span className='text-[#e6911e]'> ${finalPrice.toFixed(2)}</span>
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