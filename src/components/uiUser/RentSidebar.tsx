import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationMap from './LocationMap';
import { locationService, saveBooking } from '../../context/Data/DataUser';
import { VITE_OPENCAGE_API_KEY } from '../../context/api/Api';

export interface Location {
  id?: number | string;
  user_id?: number;
  location: string;
  latitude: string;
  longitude: string;
  is_active: number;
  isTemporary?: boolean;
}
interface DropoffLocation {
  lat: number;
  lng: number;
  location?: string;
  id?: number | string;
}

interface CarItem {
  id: string;
  model: string;
  price: number | string;
}

interface BookingData {
  start_date: string;
  end_date: string;
  carmodel_id: string;
  user_id?: string;
  additional_driver: string;
  pickup_location: string;
  dropoff_location: string;
  location_id: string;
}

interface RentSidebarProps {
  car: CarItem;
  carId: string;
}

const FIXED_PICKUP_LOCATION = {
  lat: 24.7136,
  lng: 46.6753,
  location: 'الرياض',
  id: 0,
};

const EXTRAS_LIST = [
  { label: 'Additional Driver', price: 55, id: 'driver' },
];

const RentSidebar: React.FC<RentSidebarProps> = React.memo(({ car, carId }) => {
  const [formData, setFormData] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '10:00',
    dropoffTime: '10:00',
  });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [dropoffLocation, setDropoffLocation] = useState<DropoffLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const hasFetchedLocations = useRef(false);
  const navigate = useNavigate();

  const getCityName = useCallback(async (lat: number, lng: number): Promise<string> => {
    if (
      typeof lat !== 'number' || typeof lng !== 'number' ||
      isNaN(lat) || isNaN(lng) ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) {
      console.error('إحداثيات غير صالحة:', { lat, lng });
      return 'موقع غير معروف';
    }
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    const apiKey = VITE_OPENCAGE_API_KEY;
    const cacheKey = `location_${roundedLat}_${roundedLng}`;

    const cachedLocation = localStorage.getItem(cacheKey);
    if (cachedLocation) return cachedLocation;

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${roundedLat}+${roundedLng}&key=${apiKey}&language=ar&no_annotations=1`
      );
      if (!response.ok) throw new Error('فشل في جلب بيانات الموقع');
      const data = await response.json();
      if (data.results?.length > 0) {
        const components = data.results[0].components;
        const placeTypes = [
          { key: 'village', label: 'قرية' },
          { key: 'hamlet', label: 'نجع' },
          { key: 'suburb', label: 'حي' },
          { key: 'town', label: 'مدينة' },
          { key: 'city', label: 'مدينة' },
          { key: 'neighbourhood', label: 'حي' },
          { key: 'road', label: 'شارع' },
          { key: 'street', label: 'شارع' },
          { key: 'footway', label: 'ممشى' },
          { key: 'county', label: 'مركز' },
        ];

        let locationLabel = '';
        for (let type of placeTypes) {
          if (components[type.key]) {
            locationLabel = `${type.label} ${components[type.key]}`;
            break;
          }
        }
        if (!locationLabel) {
          locationLabel = data.results[0]?.formatted?.split(',')[0]?.trim() || 'موقع غير معروف';
        }

        localStorage.setItem(cacheKey, locationLabel);
        return locationLabel;
      }
      return 'موقع غير معروف';
    } catch (error) {
      console.error('خطأ في جلب اسم الموقع:', error);
      return 'موقع غير معروف';
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    if (hasFetchedLocations.current) return;

    try {
      const data = await locationService.getActiveLocations();
      setLocations(data);
      
      // تعيين الموقع الافتراضي إذا لم يكن هناك موقع محفوظ
      const savedLocation = localStorage.getItem('dropoffLocation');
      if (!savedLocation && data.length > 0) {
        const firstLocation = {
          lat: parseFloat(data[0].latitude),
          lng: parseFloat(data[0].longitude),
          location: data[0].location,
          id: data[0].id,
        };
        setDropoffLocation(firstLocation);
      }
      
      hasFetchedLocations.current = true;
    } catch (error) {
      console.error('فشل تحميل المواقع:', error);
      setError('فشل في تحميل المواقع المحفوظة');
    }
  }, []);

const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
  try {
    setLoadingLocation(true);
    setError(null);
    
    const locationName = await getCityName(lat, lng);
    const { location, isTemporary } = await locationService.addLocation({
      location: locationName,
      latitude: lat.toString(),
      longitude: lng.toString(),
      is_active: 1,
    });

    const formattedLocation = {
      lat,
      lng,
      location: location.location,
      id: location.id,
      isTemporary
    };

    setDropoffLocation(formattedLocation);
    localStorage.setItem('dropoffLocation', JSON.stringify(formattedLocation));
    setShowMap(false);
    
    setSuccess(isTemporary 
      ? 'تم تحديد الموقع بنجاح (سيتم حفظه عند إتمام الحجز)'
      : 'تم حفظ الموقع بنجاح');
  } catch (error) {
    console.error('Error selecting location:', error);
    setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحديد الموقع');
  } finally {
    setLoadingLocation(false);
  }
}, [getCityName]);

  const calculateTotal = useCallback((): number => {
    const basePrice = typeof car.price === 'number' ? car.price : parseFloat(car.price);
    const extrasTotal = selectedExtras.includes('driver') ? 55 : 0;
    const tax = 50;
    return basePrice + extrasTotal + tax;
  }, [car.price, selectedExtras]);

  const validateForm = useCallback((): boolean => {
    const errors: string[] = [];
    
    if (!formData.pickupDate || !formData.dropoffDate) {
      errors.push('يرجى تحديد تاريخي الاستلام والتسليم');
    }
    
    if (!formData.pickupTime || !formData.dropoffTime) {
      errors.push('يرجى تحديد وقتي الاستلام والتسليم');
    }
    
    if (selectedExtras.includes('driver') && !dropoffLocation?.location) {
      errors.push('يرجى تحديد مكان التسليم');
    }
    
    const start = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const end = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);
    
    if (start >= end) {
      errors.push('وقت التسليم يجب أن يكون بعد وقت الاستلام');
    } else if ((end.getTime() - start.getTime()) / (1000 * 60 * 60) < 4) {
      errors.push('الحد الأدنى لمدة الحجز هو 4 ساعات');
    }
    
    if (errors.length > 0) {
      setError(errors.join('. '));
      return false;
    }
    
    return true;
  }, [formData, selectedExtras, dropoffLocation]);
 
const handleBooking = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsBooking(true);
  setError(null);

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) {
      setError('يجب تسجيل الدخول لإتمام الحجز');
      return;
    }

    // Only include location_id if we have a valid dropoff location
    const bookingPayload: any = {
      start_date: `${formData.pickupDate}T${formData.pickupTime}:00`,
      end_date: `${formData.dropoffDate}T${formData.dropoffTime}:00`,
      carmodel_id: carId,
      user_id: user.id.toString(),
      additional_driver: selectedExtras.includes('driver') ? '1' : '0',
      pickup_location: FIXED_PICKUP_LOCATION.location,
    };

    // Only add location fields if additional driver is selected
    if (selectedExtras.includes('driver')) {
      if (!dropoffLocation) {
        throw new Error('يجب تحديد موقع التسليم عند اختيار سائق إضافي');
      }
      
      bookingPayload.dropoff_location = dropoffLocation.location || '';
      
      // Only include location_id if it's a permanent location (not temporary)
      if (dropoffLocation.id && !dropoffLocation.isTemporary) {
        bookingPayload.location_id = dropoffLocation.id.toString();
      }
    }

    const res = await saveBooking(carId, bookingPayload);
    
    navigate(`/bookings/${res.bookingId}`, {
      state: {
        carDetails: car,
        bookingDetails: {
          ...bookingPayload,
          extras: selectedExtras,
          totalPrice: calculateTotal(),
        },
      },
    });
  } catch (error) {
    let errorMessage = 'حدث خطأ أثناء الحجز';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('موقع التسليم')) {
        setShowMap(true);
      }
    }
    
    setError(errorMessage);
  } finally {
    setIsBooking(false);
  }
}, [validateForm, formData, selectedExtras, dropoffLocation, carId, navigate, car, calculateTotal]);

useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  const resetDropoffLocation = useCallback(() => {
    setDropoffLocation(null);
    localStorage.removeItem('dropoffLocation');
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      <form onSubmit={handleBooking} className="rental-form rounded-xl bg-[#F7F8FA] hover:shadow-lg p-6 cursor-pointer flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {['pickup', 'dropoff'].map((type) => (
            <React.Fragment key={type}>
              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">
                  {type === 'pickup' ? 'تاريخ الاستلام' : 'تاريخ التسليم'}
                </label>
                <input
                  type="date"
                  name={`${type}Date`}
                  value={formData[`${type}Date` as keyof typeof formData]}
                  onChange={handleInputChange}
                  min={type === 'dropoff' ? formData.pickupDate || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">
                  {type === 'pickup' ? 'وقت الاستلام' : 'وقت التسليم'}
                </label>
                <input
                  type="time"
                  name={`${type}Time`}
                  value={formData[`${type}Time` as keyof typeof formData]}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
                  required
                />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="extras-section my-4">
          <h3 className="font-medium mb-2 text-sm">الإضافات:</h3>
          {EXTRAS_LIST.map((extra) => (
            <label key={extra.id} className="flex items-center mb-2 text-sm">
              <input
                type="checkbox"
                checked={selectedExtras.includes(extra.id)}
                onChange={() => setSelectedExtras(prev =>
                  prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
                )}
                className="mr-2 w-4 h-4 text-[#E6911E] focus:ring-[#E6911E] border-gray-300 rounded"
              />
              {extra.label === 'Additional Driver' ? 'سائق إضافي' : extra.label} (+{extra.price} ريال)
            </label>
          ))}
        </div>
        {selectedExtras.includes('driver') && (
          <div className="my-4">
             <div className='my-4'>
                <label className="block mb-2 text-sm font-medium">مكان الاستلام</label>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <p className="font-medium">{FIXED_PICKUP_LOCATION.location}</p>
                </div>
             </div>
            <label className="block mb-2 text-sm font-medium">مكان التسليم</label>
            <div className="flex gap-2">
              <div className="flex-1 p-2 bg-gray-100 rounded-lg">
                {dropoffLocation ? (
                  <p className="font-medium text-right">
                    {dropoffLocation.location || 'لم يتم تحديد مكان التسليم'}
                  </p>
                ) : (
                  <p className="text-gray-500">لم يتم تحديد مكان التسليم</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-4 py-2 bg-[#E6911E] text-white rounded-lg"
              >
                تحديد على الخريطة
              </button>
              <button
                type="button"
                onClick={resetDropoffLocation}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                إعادة تعيين
              </button>
            </div>
          </div>
        )}
        <div className="price-summary bg-gray-50 p-4 rounded-lg my-4">
          <h3 className="font-bold mb-3 text-lg">ملخص السعر:</h3>
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>السعر الأساسي:</span>
            <span>{typeof car.price === 'number' ? car.price.toFixed(2) : parseFloat(car.price).toFixed(2)} ريال</span>
          </div>
          {selectedExtras.length > 0 && (
            <div className="price-row flex justify-between mb-2 text-sm">
              <span>الإضافات:</span>
              <span>{selectedExtras.includes('driver') ? '55.00' : '0.00'} ريال</span>
            </div>
          )}
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>الضريبة:</span>
            <span>50.00 ريال</span>
          </div>
          <div className="price-row flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>الإجمالي:</span>
            <span className="text-[#E6911E]">{calculateTotal().toFixed(2)} ريال</span>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">خطأ!</strong>
            <span className="block sm:inline"> {error}</span>
            <button onClick={() => setError(null)} className="absolute top-1 right-1 text-red-700">
              ×
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">نجاح!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isBooking}
          className={`w-full bg-[#E6911E] hover:bg-[#D6820E] text-white py-3 rounded-lg transition-colors font-medium ${
            isBooking ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isBooking ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              جارٍ المعالجة...
            </>
          ) : (
            'احجز الآن'
          )}
        </button>
      </form>
      {showMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">تحديد مكان التسليم</h2>
            <button
              onClick={() => setShowMap(false)}
              className="p-2 rounded hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1">
            <LocationMap
              pickupLocation={FIXED_PICKUP_LOCATION}
              dropoffLocation={dropoffLocation}
              onLocationSelect={handleLocationSelect}
            />

            {loadingLocation && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-[#E6911E]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>جارٍ تحميل الموقع...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default RentSidebar; 