import React, { useState } from 'react';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';
import CircularProgress from '@mui/material/CircularProgress';
import MdCancel from '@mui/icons-material/Cancel';

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
  [x: string]: any;
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
  location?: {
    location: string;
  }
  location_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  can_cancel?: boolean;
}

interface BookingCardProps {
  booking: BookingItem;
  onViewDetails: (booking: BookingItem) => void;
  onPayment: (id: number) => void;
  onCancel: (id: number) => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewDetails, onPayment, onCancel }) => {
  const [isCanceling, setIsCanceling] = useState(false);
  
  const handleRemoveItem = async () => {
    setIsCanceling(true);
    try {
      await onCancel(booking.id);
    } catch (err) {
      console.error('Error canceling booking:', err);
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusStyles = {
    confirmed: 'bg-green-100 text-green-800',
    initiated: 'bg-red-100 text-red-800',
    pending: 'bg-amber-100 text-amber-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusText = {
    confirmed: 'مؤكد',
    initiated: 'مبدئي',
    pending: 'قيد الانتظار',
    cancelled: 'ملغى',
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <div>
            <img
              src={booking.car_model?.attributes?.image || '/default-car.jpg'}
              alt={`${booking.car_model?.relationship?.Brand?.brand_name || 'غير معروف'} ${
                booking.car_model?.relationship?.Types?.type_name || 'غير معروف'
              }`}
              className="w-full h-56 lg:h-80 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/default-car.jpg';
              }}
              loading="lazy"
            />
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                {booking.car_model.relationship.Brand.brand_name}{' '}
                {booking.car_model.relationship.Types?.type_name}
              </h2>
              <p className="text-gray-500">{booking.car_model.attributes.year}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                statusStyles[booking.status as keyof typeof statusStyles] || statusStyles.pending
              }`}
            >
              {statusText[booking.status as keyof typeof statusText] || booking.status}
            </span>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
              <SettingsInputSvideoIcon fontSize="small" />
              <span>{booking.car_model.attributes?.transmission_type || 'تلقائي'}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
              <AirlineSeatReclineExtraIcon fontSize="small" />
              <span>{booking.car_model.attributes?.seats_count || '4'} مقاعد</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
              <LocalGasStationIcon fontSize="small" />
              <span>{booking.car_model.attributes?.engine_type || 'بنزين'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">مكان التسليم</p>
                  <p className="font-medium">
                    {booking.car_model.relationship?.Location?.location}
                  </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
            <p className="text-lg font-bold text-[#E6911E]">
              {parseFloat(booking.final_price).toFixed(2)} ر.س
            </p>
            
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => onViewDetails(booking)}
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                عرض التفاصيل
              </button>
              
              {booking.status === 'initiated' && (
                <button
                  onClick={() => onPayment(booking.id)}
                  className="bg-[#E6911E] hover:bg-[#D6820E] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  اتمام الدفع
                </button>
              )}
              
              {booking.can_cancel && (
                <button
                  onClick={handleRemoveItem}
                  disabled={isCanceling}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isCanceling ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <>
                      <MdCancel fontSize="small" />
                      إلغاء
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;