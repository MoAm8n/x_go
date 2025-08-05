import React from 'react';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';

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
  onPayment,
}) => {
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#E6911E] hover:text-[#D6820E] mb-4"
          aria-label="Back to bookings list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to list
        </button>

        <h1 className="text-2xl font-bold mb-6">Booking Details #{booking.id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Car Information</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={booking.car_model?.attributes?.image || '/default-car.jpg'}
                    alt={`${booking.car_model?.relationship?.Brand?.brand_name || 'Unknown'} ${
                      booking.car_model?.relationship?.Types?.type_name || "Unknown"
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
                    {booking.car_model?.relationship?.Brand?.brand_name || 'Unknown'}{' '}
                    {booking.car_model?.relationship?.Types?.type_name || 'Unknown'}
                  </h2>
                  <p className="text-gray-500">{booking.car_model?.attributes?.year || 'Unknown'}</p>

                  <div className="flex flex-wrap gap-2 my-4">
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <SettingsInputSvideoIcon fontSize="small" />
                      <span>{booking.car_model?.attributes?.transmission_type || 'Automatic'}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <AirlineSeatReclineExtraIcon fontSize="small" />
                      <span>{booking.car_model.attributes?.seat_type || '4'} seats</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                      <LocalGasStationIcon fontSize="small" />
                      <span>{booking.car_model?.attributes?.engine_type || 'Gasoline'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-gray-500">Seat Type</p>
                      <p>{booking.car_model?.attributes?.seat_type || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Acceleration (0-100 km/h)</p>
                      <p>{booking.car_model?.attributes?.acceleration || 'Unknown'} seconds</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Car Type</p>
                      <p>{booking.car_model?.relationship?.Types?.type_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Daily Price</p>
                      <p>${booking.car_model?.attributes?.price || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Daily Price</span>
                  <span>${booking.car_model?.attributes?.price || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Days</span>
                  <span>{calculateDays(booking.start_date, booking.end_date)}</span>
                </div>
                {booking.additional_driver === 1 && (
                  <div className="flex justify-between">
                    <span>Additional Driver</span>
                    <span>$55.00</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>Tax (14%)</span>
                    <span>${(parseFloat(booking.final_price) * 0.14).toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#E6911E]">${parseFloat(booking.final_price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Booking Status</h3>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      booking.status === 'confirmed'
                        ? 'bg-green-500'
                        : booking.status === 'cancelled'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                  ></span>
                  <span>
                    {booking.status === 'confirmed'
                      ? 'Confirmed'
                      : booking.status === 'cancelled'
                      ? 'Cancelled'
                      : 'Pending'}
                  </span>
                </div>
              </div>
              {booking.status === 'initiated' && (
                <button
                  onClick={() => onPayment(booking.id)}
                  className="bg-[#E6911E] hover:bg-[#D6820E] text-white px-4 py-2 rounded-lg transition-colors"
                  aria-label={`Complete payment for booking ${booking.id}`}
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;