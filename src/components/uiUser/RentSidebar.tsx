import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import LocationMap from './LocationMap';
import { locationService, saveBooking } from '../../context/Data/DataUser';
import { VITE_OPENCAGE_API_KEY } from '../../context/api/Api';
import { toast, ToastContainer } from "react-toastify";

export interface Location {
  id: number;
  user_id?: number;
  location: string;
  latitude: string;
  longitude: string;
  is_active: number;
}

interface DropoffLocation {
  lat: number;
  lng: number;
  location: string;
  id: number;
}

interface CarItem {
  id: string;
  model: string;
  price: number | string;
}

export interface BookingData {
  start_date: string;
  end_date: string;
  carmodel_id: string;
  user_id?: string;
  additional_driver: number; 
  pickup_location: string;
  dropoff_location: string | Location;
  location_id?: number; 
}

interface RentSidebarProps {
  car: CarItem;
  carId: string;
}

const FIXED_PICKUP_LOCATION = {
  lat: 24.7136,
  lng: 46.6753,
  location: t('rent_sidebar.Riyadh'),
  id: 0,
};

const EXTRAS_LIST = [
  { label: t('booking_details.additional_driver'), price: 55, id: 'driver' },
];

const RentSidebar: React.FC<RentSidebarProps> = React.memo(({ car, carId }) => {
  const [formData, setFormData] = useState({
    pickupDate: 'dd/mm/yyyy',
    dropoffDate: 'dd/mm/yyyy',
    pickupTime: '10:00',
    dropoffTime: '10:00',
  });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [dropoffLocation, setDropoffLocation] = useState<DropoffLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  const getCityName = useCallback(async (lat: number, lng: number): Promise<string> => {
    if (
      typeof lat !== 'number' || typeof lng !== 'number' ||
      isNaN(lat) || isNaN(lng) ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) {
      console.error(t('rent_sidebar.invalid_coordinates'), { lat, lng });
      return t('rent_sidebar.unknown_location');
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
      if (!response.ok) throw new Error(t('rent_sidebar.failed_fetch_location'));
      
      const data = await response.json();
      if (data.results?.length > 0) {
        const components = data.results[0].components;
        const placeTypes = [
          { key: 'village', label: t('location_types.village') },
          { key: 'hamlet', label: t('location_types.hamlet') },
          { key: 'suburb', label: t('location_types.suburb') },
          { key: 'town', label: t('location_types.town') },
          { key: 'city', label: t('location_types.city') },
          { key: 'neighbourhood', label: t('location_types.neighbourhood') },
          { key: 'road', label: t('location_types.road') },
          { key: 'street', label: t('location_types.street') },
          { key: 'footway', label: t('location_types.footway') },
          { key: 'county', label: t('location_types.county') },
        ];

        let locationLabel = '';
        for (let type of placeTypes) {
          if (components[type.key]) {
            locationLabel = `${type.label} ${components[type.key]}`;
            break;
          }
        }
        
        if (!locationLabel) {
          locationLabel = data.results[0]?.formatted?.split(',')[0]?.trim() || t('rent_sidebar.unknown_location');
        }

        localStorage.setItem(cacheKey, locationLabel);
        return locationLabel;
      }
      return t('rent_sidebar.unknown_location');
    } catch (error) {
      console.error(t('rent_sidebar.error_fetch_location_name'), error);
      return t('rent_sidebar.unknown_location');
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const apiLocations = await locationService.getActiveLocations();
      setLocations(apiLocations);
      if (!dropoffLocation && apiLocations.length > 0) {
        const defaultLocation = {
          lat: parseFloat(apiLocations[0].latitude),
          lng: parseFloat(apiLocations[0].longitude),
          location: apiLocations[0].location,
          id: apiLocations[0].id,
        };
        setDropoffLocation(defaultLocation);
      }
    } catch (error) {
      console.error(t('rent_sidebar.failed_load_locations'), error);
    }
  }, [dropoffLocation]);

  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    try {
      setLoadingLocation(true);
      const locationName = await getCityName(lat, lng);
      try {
        const savedLocation = await locationService.addLocation({
          location: locationName,
          latitude: lat.toString(),
          longitude: lng.toString(),
        });

        const formattedLocation = {
          lat,
          lng,
          location: savedLocation.location,
          id: savedLocation.id || 0
        };

        setDropoffLocation(formattedLocation);
        setLocations(prev => [...prev, savedLocation]);
        toast.success(t('rent_sidebar.location_saved_success'));
      } catch (saveError) {
        console.error(t('rent_sidebar.error_saving_location'), saveError);
        toast.error(t('rent_sidebar.failed_save_location'));
      }
    } catch (error) {
      console.error(t('rent_sidebar.error_getting_location_name'), error);
    } finally {
      setLoadingLocation(false);
      setShowMap(false);
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
    
    if (!localStorage.getItem('tokenUser')) {
      errors.push(t('rent_sidebar.must_login_to_book'));
      navigate('/signin');
    }
    if (!formData.pickupDate || !formData.dropoffDate) {
      errors.push(t('rent_sidebar.select_dates'));
    }

    if (!formData.pickupTime || !formData.dropoffTime) {
      errors.push(t('rent_sidebar.select_times'));
    }

    if (selectedExtras.includes('driver') && !dropoffLocation) {
      errors.push(t('rent_sidebar.select_dropoff_for_driver'));
    }

    const start = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const end = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);

    if (start >= end) {
      errors.push(t('rent_sidebar.dropoff_after_pickup'));
    } else if ((end.getTime() - start.getTime()) / (1000 * 60 * 60) < 4) {
      errors.push(t('rent_sidebar.min_duration'));
    }

    if (!dropoffLocation) {
      errors.push(t('rent_sidebar.select_dropoff_for_driver'));
    } else {
      const isValidLocation = locations.some(loc => loc.id === dropoffLocation.id);
      if (!isValidLocation) {
        errors.push(t('toast.invalid_status'));
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }

    return true;
  }, [formData, selectedExtras, dropoffLocation, navigate]);

  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsBooking(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id) {
        throw new Error(t('rent_sidebar.must_login_to_book'));
      }

      const bookingPayload: BookingData = {
        start_date: `${formData.pickupDate}T${formData.pickupTime}:00`,
        end_date: `${formData.dropoffDate}T${formData.dropoffTime}:00`,
        carmodel_id: carId,
        user_id: user.id.toString(),
        additional_driver: selectedExtras.includes('driver') ? 1 : 0,
        pickup_location: FIXED_PICKUP_LOCATION.location,
        dropoff_location: dropoffLocation?.location || FIXED_PICKUP_LOCATION.location,
        location_id: selectedExtras.includes('driver') ? dropoffLocation?.id : undefined,
      };

      const res = await saveBooking(carId, bookingPayload);
      
      toast.success(t('rent_sidebar.booking_created_success'));
      setTimeout(() => {
        navigate(`/bookings/${res.bookingId}`);
      }, 1500);
    } catch (error) {
      console.error(t('rent_sidebar.booking_error'), error);
      toast.error(error instanceof Error ? error.message : t('rent_sidebar.failed_complete_booking'));
    } finally {
      setIsBooking(false);
    }
  }, [validateForm, formData, selectedExtras, dropoffLocation, carId, navigate]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetDropoffLocation = useCallback(() => {
    if (locations.length > 0) {
      const defaultLocation = locations[0];
      const newLocation = {
        lat: parseFloat(defaultLocation.latitude),
        lng: parseFloat(defaultLocation.longitude),
        location: defaultLocation.location,
        id: defaultLocation.id,
      };
      setDropoffLocation(newLocation);
      localStorage.setItem('dropoffLocation', JSON.stringify(newLocation));
    } else {
      setDropoffLocation(null);
      localStorage.removeItem('dropoffLocation');
    }
  }, [locations]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      <form onSubmit={handleBooking} className="rental-form rounded-xl bg-[#F7F8FA] hover:shadow-lg p-6 cursor-pointer flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {['pickup', 'dropoff'].map((type) => (
            <React.Fragment key={type}>
              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">
                  {t(`rent_sidebar.${type}_date`)}
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
                  {t(`rent_sidebar.${type}_time`)}
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
          <h3 className="font-medium mb-2 text-sm">{t('rent_sidebar.extras')}:</h3>
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
              {extra.label} (+{extra.price} $)
            </label>
          ))}
        </div>
        {selectedExtras.includes('driver') && (
          <div className="my-4">
            <div className='my-4'>
              <label className="block mb-2 text-sm font-medium">{t('rent_sidebar.pickup_location')}</label>
              <div className="p-2 bg-gray-100 rounded-lg">
                <p className="font-medium">{FIXED_PICKUP_LOCATION.location}</p>
              </div>
            </div>
            <label className="block mb-2 text-sm font-medium">{t('rent_sidebar.dropoff_location')}</label>
            <div className="flex lg:flex-col gap-2">
              <div className="flex-1 p-2 bg-gray-100 rounded-lg">
                {dropoffLocation ? (
                  <p className="font-medium text-right">
                    {dropoffLocation.location || t('rent_sidebar.dropoff_location_not_selected')}
                  </p>
                ) : (
                  <p className="text-gray-500">{t('rent_sidebar.dropoff_location_not_selected')}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-4 py-2 bg-[#E6911E] text-white rounded-lg"
              >
                {t('rent_sidebar.select_on_map')}
              </button>
              <button
                type="button"
                onClick={resetDropoffLocation}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                {t('rent_sidebar.reset')}
              </button>
            </div>
          </div>
        )}
        <div className="price-summary bg-gray-50 p-4 rounded-lg my-4">
          <h3 className="font-bold mb-3 text-lg">{t('rent_sidebar.price_summary')}:</h3>
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>{t('rent_sidebar.base_price')}:</span>
            <span>{typeof car.price === 'number' ? car.price.toFixed(2) : parseFloat(car.price).toFixed(2)} $</span>
          </div>
          {selectedExtras.length > 0 && (
            <div className="price-row flex justify-between mb-2 text-sm">
              <span>{t('rent_sidebar.extras')}:</span>
              <span>{selectedExtras.includes('driver') ? '55.00' : '0.00'} $</span>
            </div>
          )}
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>{t('rent_sidebar.tax')}:</span>
            <span>50.00 $</span>
          </div>
          <div className="price-row flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>{t('rent_sidebar.total')}:</span>
            <span className="text-[#E6911E]">{calculateTotal().toFixed(2)} $</span>
          </div>
        </div>
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
              {t('rent_sidebar.processing')}...
            </>
          ) : (
            t('rent_sidebar.book_now')
          )}
        </button>
      </form>
      {showMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{t('rent_sidebar.select_dropoff_location')}</h2>
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
                  <span>{t('rent_sidebar.loading_location')}...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
});

export default RentSidebar;