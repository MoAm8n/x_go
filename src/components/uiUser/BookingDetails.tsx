import React from 'react';
import { t } from 'i18next';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Rating {
  average_rating: string;
  ratings_count: number;
}

export interface Brand {
  brand_id: number;
  brand_name: string;
}

export interface ModelName {
  model_name_id: string;
  model_name: string;
}

export interface Type {
  type_id: string;
  type_name: string;
}

export interface CarAttributes {
  year: string;
  price: string;
  engine_type: string;
  transmission_type: string;
  seat_type: string;
  seats_count: number;
  acceleration: string;
  image?: string;
}

export interface CarRelationships {
  "Model Names": ModelName;
  Types: Type;
  Brand: Brand;
  Ratings: Rating;
}

export interface CarModel {
  id: string;
  attributes: CarAttributes;
  relationship: CarRelationships;
}

export interface BookingItem {
  id: number;
  start_date: string;
  end_date: string;
  final_price: string;
  status: string;
  additional_driver: number;
  car_model: CarModel;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

interface BookingDetailsProps {
  booking: BookingItem;
  onBack: () => void;
  formatDisplayDate: (date: string) => string;
  formatTime: (date: string) => string;
  onPayment: (id: number) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  booking, 
  onBack,
  formatDisplayDate,
  formatTime,
}) => {
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden" dir="rtl">
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#E6911E] hover:text-[#D6820E] mb-4"
          aria-label={t('booking_details.back_aria')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t('booking_details.back')}
        </button>
          <h1 className="text-2xl font-bold mb-6">{t('booking_details.title', { id: booking.id })}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">{t('booking_details.car_information')}</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={booking.car_model?.attributes?.image || '/default-car.jpg'}
                    alt={`${t(`brand.${booking.car_model?.relationship?.Brand?.brand_name}`) || t('booking_details.unknown')} ${
                      t(`name.${booking.car_model?.relationship?.Model_Names?.model_name}`) || t('booking_details.unknown')
                    }`}
                    className="w-full h-48 object-cover rounded-lg"
                    loading='lazy'
                    onError={(e) => {
                      e.currentTarget.src = '/default-car.jpg';
                    }}
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-xl font-bold">
                    {t(`brand.${booking.car_model?.relationship?.Brand?.brand_name}`) || t('booking_details.unknown')}{' '}
                    {t(`name.${booking.car_model?.relationship?.Model_Names?.model_name}`) || t('booking_details.unknown')}
                  </h2>
                  <p className="text-gray-500">{booking.car_model?.attributes?.year || t('booking_details.unknown')}</p>

                  <div className="flex flex-wrap gap-2 my-4">
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <DirectionsCarIcon fontSize="small" />
                      <span>{t(`name.${booking.car_model.relationship.Types?.type_name}`) || t('booking_card.automatic')}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <SettingsInputSvideoIcon fontSize="small" />
                      <span>{t(`type.${booking.car_model?.attributes?.transmission_type}`) || t('booking_details.automatic')}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <AirlineSeatReclineExtraIcon fontSize="small" />
                      <span>{booking.car_model.attributes?.seats_count || '4'} {t('booking_details.seats')}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <LocalGasStationIcon fontSize="small" />
                      <span>{t(`Gasoline.${booking.car_model?.attributes?.engine_type}`) || t('booking_details.petrol')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-gray-500">{t('booking_details.seat_type')}</p>
                      <p>{t(`name.${booking.car_model?.attributes?.seat_type}`) || t('booking_details.unknown')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('booking_details.acceleration')}</p>
                      <p>{booking.car_model?.attributes?.acceleration || t('booking_details.unknown')} {t('booking_details.seconds')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('booking_details.car_type')}</p>
                      <p>{t(`brand.${booking.car_model?.relationship?.Brand?.brand_name}`) || t('booking_details.unknown')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('booking_details.daily_price')}</p>
                      <p>${booking.car_model?.attributes?.price || t('booking_details.unknown')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-4">{t('booking_details.payment_summary')}</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{t('booking_details.daily_price')}</span>
                  <span>${booking.car_model?.attributes?.price || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking_details.number_of_days')}</span>
                  <span>{calculateDays(booking.start_date, booking.end_date)}</span>
                </div>
                {booking.additional_driver === 1 && (
                  <div className="flex justify-between">
                    <span>{t('booking_details.additional_driver')}</span>
                    <span>$55.00</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>{t('booking_details.tax')}</span>
                    <span>${(parseFloat(booking.final_price) * 0.14).toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>{t('booking_details.total')}</span>
                    <span className="text-[#E6911E]">${parseFloat(booking.final_price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">{t('booking_details.booking_status')}</h3>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ml-2 ${
                      booking.status === 'confirmed'
                        ? 'bg-green-500'
                        : booking.status === 'cancelled'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                  ></span>
                  <span>
                    {t(`status.${booking.status}`) || t('booking_details.pending')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;