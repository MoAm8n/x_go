import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationMap from './LocationMap';
import { locationService, saveBooking } from '../../context/Data/DataUser';
import { VITE_OPENCAGE_API_KEY } from '../../context/api/Api';

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
  location: 'Riyadh',
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
  const navigate = useNavigate();

  const getCityName = useCallback(async (lat: number, lng: number): Promise<string> => {
    if (
      typeof lat !== 'number' || typeof lng !== 'number' ||
      isNaN(lat) || isNaN(lng) ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) {
      console.error('Invalid coordinates:', { lat, lng });
      return 'Unknown location';
    }
    
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    const apiKey = VITE_OPENCAGE_API_KEY;
    const cacheKey = `location_${roundedLat}_${roundedLng}`;

    const cachedLocation = localStorage.getItem(cacheKey);
    if (cachedLocation) return cachedLocation;

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${roundedLat}+${roundedLng}&key=${apiKey}&language=en&no_annotations=1`
      );
      if (!response.ok) throw new Error('Failed to fetch location data');
      
      const data = await response.json();
      if (data.results?.length > 0) {
        const components = data.results[0].components;
        const placeTypes = [
          { key: 'village', label: 'Village' },
          { key: 'hamlet', label: 'Hamlet' },
          { key: 'suburb', label: 'Suburb' },
          { key: 'town', label: 'Town' },
          { key: 'city', label: 'City' },
          { key: 'neighbourhood', label: 'Neighbourhood' },
          { key: 'road', label: 'Road' },
          { key: 'street', label: 'Street' },
          { key: 'footway', label: 'Footway' },
          { key: 'county', label: 'County' },
        ];

        let locationLabel = '';
        for (let type of placeTypes) {
          if (components[type.key]) {
            locationLabel = `${type.label} ${components[type.key]}`;
            break;
          }
        }
        
        if (!locationLabel) {
          locationLabel = data.results[0]?.formatted?.split(',')[0]?.trim() || 'Unknown location';
        }

        localStorage.setItem(cacheKey, locationLabel);
        return locationLabel;
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Unknown location';
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
      console.error('Failed to load locations:', error);
    }
  }, [dropoffLocation]);

  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    try {
      setLoadingLocation(true);
      setError(null);
      setSuccess(null);
      
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
        setSuccess('Location saved successfully');
      } catch (saveError) {
        console.error('Error saving location:', saveError);
        setError('Failed to save location. Please login again.');
      }
    } catch (error) {
      console.error('Error getting location name:', error);
      setError('تعذر تحديد اسم الموقع. الرجاء المحاولة مرة أخرى');
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

    if (!formData.pickupDate || !formData.dropoffDate) {
      errors.push('Please select pickup and dropoff dates');
    }

    if (!formData.pickupTime || !formData.dropoffTime) {
      errors.push('Please select pickup and dropoff times');
    }

    if (selectedExtras.includes('driver') && !dropoffLocation) {
      errors.push('Please select a dropoff location for additional driver');
    }

    const start = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const end = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);

    if (start >= end) {
      errors.push('Dropoff time must be after pickup time');
    } else if ((end.getTime() - start.getTime()) / (1000 * 60 * 60) < 4) {
      errors.push('Minimum booking duration is 4 hours');
    }

      if (!dropoffLocation) {
      errors.push('يجب تحديد موقع الإنزال للسائق الإضافي');
    } else {
      const isValidLocation = locations.some(loc => loc.id === dropoffLocation.id);
      if (!isValidLocation) {
        errors.push('الموقع المحدد غير صالح. الرجاء اختيار موقع آخر');
      }
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
        throw new Error('You must be logged in to complete booking');
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
      
      setSuccess('Booking created successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/bookings/${res.bookingId}`);
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete booking');
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
                  {type === 'pickup' ? 'Pickup Date' : 'Dropoff Date'}
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
                  {type === 'pickup' ? 'Pickup Time' : 'Dropoff Time'}
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
          <h3 className="font-medium mb-2 text-sm">Extras:</h3>
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
              <label className="block mb-2 text-sm font-medium">Pickup Location</label>
              <div className="p-2 bg-gray-100 rounded-lg">
                <p className="font-medium">{FIXED_PICKUP_LOCATION.location}</p>
              </div>
            </div>
            <label className="block mb-2 text-sm font-medium">Dropoff Location</label>
            <div className="flex lg:flex-col gap-2">
              <div className="flex-1 p-2 bg-gray-100 rounded-lg">
                {dropoffLocation ? (
                  <p className="font-medium text-right">
                    {dropoffLocation.location || 'Dropoff location not selected'}
                  </p>
                ) : (
                  <p className="text-gray-500">Dropoff location not selected</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-4 py-2 bg-[#E6911E] text-white rounded-lg"
              >
                Select on Map
              </button>
              <button
                type="button"
                onClick={resetDropoffLocation}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        )}
        <div className="price-summary bg-gray-50 p-4 rounded-lg my-4">
          <h3 className="font-bold mb-3 text-lg">Price Summary:</h3>
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>Base Price:</span>
            <span>{typeof car.price === 'number' ? car.price.toFixed(2) : parseFloat(car.price).toFixed(2)} $</span>
          </div>
          {selectedExtras.length > 0 && (
            <div className="price-row flex justify-between mb-2 text-sm">
              <span>Extras:</span>
              <span>{selectedExtras.includes('driver') ? '55.00' : '0.00'} $</span>
            </div>
          )}
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>Tax:</span>
            <span>50.00 $</span>
          </div>
          <div className="price-row flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span className="text-[#E6911E]">{calculateTotal().toFixed(2)} $</span>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>خطأ: {error}</span>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700"
              aria-label="إغلاق"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Success!</strong>
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
              Processing...
            </>
          ) : (
            'Book Now'
          )}
        </button>
      </form>
      {showMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Select Dropoff Location</h2>
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
                  <span>Loading location...</span>
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