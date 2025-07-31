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
  location: string;
  id?: number | string;
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
  additional_driver: string;
  pickup_location: string;
  dropoff_location: string | Location;
  location_id?: number | string;
  isTemporaryLocation?: boolean;
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
  const hasFetchedLocations = useRef(false);
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
    if (hasFetchedLocations.current) return;

    try {
      // Check user login status
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('tokenUser');
      const isLoggedIn = !!(user?.id && token);
      console.log('Login status:', isLoggedIn);
      
      let data = [];
      
      // Attempt to fetch locations from the service
      try {
        data = await locationService.getActiveLocations();
        console.log('Locations fetched successfully:', data);
        setLocations(data);
        
        // Check for saved location in local storage
        const savedLocation = localStorage.getItem('dropoffLocation');
        if (savedLocation) {
          try {
            const parsedLocation = JSON.parse(savedLocation);
            if (parsedLocation && typeof parsedLocation.location === 'string') {
              // Validate saved location
              if (parsedLocation.isTemporary) {
                console.log('Found saved temporary location:', parsedLocation);
                // Check if temporary location exists in temporary locations list
                const tempLocations = JSON.parse(localStorage.getItem('tempLocations') || '[]');
                const tempLocationExists = tempLocations.some((loc: any) => loc.id === parsedLocation.id);
                
                if (tempLocationExists) {
                  setDropoffLocation(parsedLocation);
                } else {
                  console.log('Temporary location not found in temporary locations list');
                  // If temporary location doesn't exist, use first available location
                  if (data.length > 0) {
                    const firstLocation = {
                      lat: parseFloat(data[0].latitude),
                      lng: parseFloat(data[0].longitude),
                      location: data[0].location,
                      id: data[0].id,
                      isTemporary: data[0].isTemporary || false
                    };
                    setDropoffLocation(firstLocation);
                  }
                }
              } else {
                // Check if permanent location exists in locations list
                const locationExists = data.some((loc: any) => loc.id === parsedLocation.id);
                
                if (locationExists) {
                  setDropoffLocation(parsedLocation);
                } else {
                  console.log('Saved location not found in locations list');
                  // If location doesn't exist, use first available location
                  if (data.length > 0) {
                    const firstLocation = {
                      lat: parseFloat(data[0].latitude),
                      lng: parseFloat(data[0].longitude),
                      location: data[0].location,
                      id: data[0].id,
                      isTemporary: data[0].isTemporary || false
                    };
                    setDropoffLocation(firstLocation);
                  }
                }
              }
            }
          } catch (e) {
            console.error('Error parsing saved location:', e);
          }
        } else if (data.length > 0) {
          // If no saved location, use first available location
          const firstLocation = {
            lat: parseFloat(data[0].latitude),
            lng: parseFloat(data[0].longitude),
            location: data[0].location,
            id: data[0].id,
            isTemporary: data[0].isTemporary || false
          };
          setDropoffLocation(firstLocation);
        }
      } catch (apiError) {
        console.error('Error fetching locations from API:', apiError);
        
        // Attempt to use locally saved temporary locations
        try {
          const tempLocationsStr = localStorage.getItem('tempLocations');
          if (tempLocationsStr) {
            const tempLocations = JSON.parse(tempLocationsStr);
            if (Array.isArray(tempLocations) && tempLocations.length > 0) {
              console.log('Using locally saved temporary locations:', tempLocations);
              setLocations(tempLocations.map((loc: any) => ({
                id: loc.id,
                location: loc.location,
                latitude: loc.latitude,
                longitude: loc.longitude,
                is_active: 1,
                isTemporary: true
              })));
              
              // Check for saved location in local storage
              const savedLocation = localStorage.getItem('dropoffLocation');
              if (savedLocation) {
                try {
                  const parsedLocation = JSON.parse(savedLocation);
                  if (parsedLocation && typeof parsedLocation.location === 'string') {
                    setDropoffLocation(parsedLocation);
                  }
                } catch (e) {
                  console.error('Error parsing saved location:', e);
                }
              } else {
                // Use first temporary location
                const firstTempLocation = tempLocations[0];
                const formattedLocation = {
                  lat: parseFloat(firstTempLocation.latitude),
                  lng: parseFloat(firstTempLocation.longitude),
                  location: firstTempLocation.location,
                  id: firstTempLocation.id,
                  isTemporary: true
                };
                setDropoffLocation(formattedLocation);
              }
            }
          }
        } catch (tempError) {
          console.error('Error using temporary locations:', tempError);
        }
      }
      
      hasFetchedLocations.current = true;
    } catch (error) {
      console.error('Failed to load locations:', error);
      setError('Failed to load saved locations');
      
    }
  }, []);

const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
  try {
    setLoadingLocation(true);
    setError(null);
    
    const locationName = await getCityName(lat, lng);
    
    try {
      // محاولة حفظ الموقع عبر API
      const savedLocation = await locationService.addLocation({
        location: locationName,
        latitude: lat.toString(),
        longitude: lng.toString(),
        is_active: 1,
      });

      // هنا يتم استخدام الـ id سواء كان من السيرفر أو مؤقتًا
      const formattedLocation = {
        lat,
        lng,
        location: savedLocation.location || locationName,
        id: savedLocation.id, // الـ id هنا إما من السيرفر أو مؤقت
        isTemporary: savedLocation.isTemporary || false
      };

      setDropoffLocation(formattedLocation);
      localStorage.setItem('dropoffLocation', JSON.stringify(formattedLocation));
        console.log('Location saved successfully:', formattedLocation);
        
        // If location is temporary, ensure it's saved in temporary locations list
        if (savedLocation.isTemporary || (typeof savedLocation.id === 'string' && savedLocation.id.startsWith('temp_'))) {
          try {
            const tempLocationsStr = localStorage.getItem('tempLocations');
            let tempLocations = [];
            
            if (tempLocationsStr) {
              try {
                tempLocations = JSON.parse(tempLocationsStr);
              } catch (parseError) {
                console.error('Error parsing temporary locations:', parseError);
                tempLocations = [];
              }
            }
            
            const existingIndex = tempLocations.findIndex((loc: any) => loc.id === savedLocation.id);
            
            if (existingIndex >= 0) {
              // Update existing location
              tempLocations[existingIndex] = {
                id: savedLocation.id,
                location: locationName,
                latitude: lat.toString(),
                longitude: lng.toString(),
                is_active: 1,
                isTemporary: true,
                timestamp: Date.now()
              };
            } else {
              // Add new location
              tempLocations.push({
                id: savedLocation.id,
                location: locationName,
                latitude: lat.toString(),
                longitude: lng.toString(),
                is_active: 1,
                isTemporary: true,
                timestamp: Date.now()
              });
            }
            
            localStorage.setItem('tempLocations', JSON.stringify(tempLocations));
            console.log('Temporary location saved in temporary locations list:', savedLocation);
          } catch (storageError) {
            console.error('Error saving temporary location to local storage:', storageError);
          }
        }
        
        setShowMap(false);
        
      } catch (apiError) {
        console.error('Error in location addition API:', apiError);
        
        // Create local temporary location
        const tempId = `temp_${Date.now()}`;
        const formattedLocation = {
          lat,
          lng,
          location: locationName,
          id: tempId,
          isTemporary: true
        };

        setDropoffLocation(formattedLocation);
        localStorage.setItem('dropoffLocation', JSON.stringify(formattedLocation));
        console.log('Created local temporary location:', formattedLocation);
        
        // Save temporary location to local storage for later use
        try {
          const tempLocations = JSON.parse(localStorage.getItem('tempLocations') || '[]');
          const tempLocation = {
            id: tempId,
            location: locationName,
            latitude: lat.toString(),
            longitude: lng.toString(),
            is_active: 1,
            isTemporary: true,
            timestamp: Date.now()
          };
          tempLocations.push(tempLocation);
          localStorage.setItem('tempLocations', JSON.stringify(tempLocations));
          console.log('Temporary location saved to local storage:', tempLocation);
        } catch (storageError) {
          console.error('Failed to save temporary location to local storage:', storageError);
        }
        
        setShowMap(false);
      }
      
    } catch (error) {
      console.error('Error saving location:', error);
      setError('Failed to save location, please try again');
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
      errors.push('Please select pickup and dropoff dates');
    }

    if (!formData.pickupTime || !formData.dropoffTime) {
      errors.push('Please select pickup and dropoff times');
    }

    if (selectedExtras.includes('driver')) {
      if (!dropoffLocation?.location) {
        errors.push('Please select a dropoff location');
      } else if (typeof dropoffLocation === 'object') {
        if (
          (!dropoffLocation.lat && !dropoffLocation.latitude) ||
          (!dropoffLocation.lng && !dropoffLocation.longitude)
        ) {
          errors.push('Dropoff location data is incomplete, please reselect the location');
        }
        if (!dropoffLocation.id) {
          errors.push('Location ID is missing, please select a valid location');
        }
      }
    }

    const start = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const end = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);

    if (start >= end) {
      errors.push('Dropoff time must be after pickup time');
    } else if ((end.getTime() - start.getTime()) / (1000 * 60 * 60) < 4) {
      errors.push('Minimum booking duration is 4 hours');
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
      setError('You must be logged in to complete booking');
      setTimeout(() => navigate('/signin'), 1500);
      return;
    }

    // 1. إذا كان هناك سائق إضافي، تأكد من وجود موقع صالح
    let validLocationId: number | string | undefined;
    if (selectedExtras.includes('driver')) {
      if (!dropoffLocation) {
        throw new Error('Please select dropoff location');
      }

      // 2. إذا كان الموقع مؤقتًا، احفظه أولاً في قاعدة البيانات
      if (dropoffLocation.isTemporary) {
        try {
          const savedLocation = await locationService.addLocation({
            location: dropoffLocation.location,
            latitude: dropoffLocation.lat.toString(),
            longitude: dropoffLocation.lng.toString(),
            is_active: 1
          });

          if (!savedLocation.id) throw new Error('Failed to save location');
          
          validLocationId = savedLocation.id;
          
          // 3. تحديث حالة الموقع المحلي
          const updatedLocation = {
            ...dropoffLocation,
            id: savedLocation.id,
            isTemporary: false
          };
          setDropoffLocation(updatedLocation);
          localStorage.setItem('dropoffLocation', JSON.stringify(updatedLocation));
        } catch (error) {
          console.error('Failed to save location:', error);
          throw new Error('Failed to save location. Please try again.');
        }
      } else {
        // 4. إذا كان الموقع دائمًا، استخدم الـ ID مباشرة
        validLocationId = dropoffLocation.id;
      }
    }

    // 5. إعداد بيانات الحجز مع الـ location_id الصحيح
    const bookingPayload: BookingData = {
      start_date: `${formData.pickupDate}T${formData.pickupTime}:00`,
      end_date: `${formData.dropoffDate}T${formData.dropoffTime}:00`,
      carmodel_id: carId,
      user_id: user.id.toString(),
      additional_driver: selectedExtras.includes('driver') ? '1' : '0',
      pickup_location: FIXED_PICKUP_LOCATION.location,
      dropoff_location: dropoffLocation?.location || FIXED_PICKUP_LOCATION.location,
      location_id: validLocationId, // استخدام الـ ID الصحيح هنا
      isTemporaryLocation: false // تأكيد أن الموقع دائم الآن
    };

    console.log('Final booking payload:', bookingPayload);
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
      console.error('Error saving booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to save booking, please try again');
    } finally {
      setIsBooking(false);
    }
  }, [validateForm, formData, selectedExtras, dropoffLocation, carId, navigate, car, calculateTotal]);

  const cleanupOldTemporaryLocations = useCallback(() => {
    try {
      const tempLocationsStr = localStorage.getItem('tempLocations');
      if (tempLocationsStr) {
        const tempLocations = JSON.parse(tempLocationsStr);
        if (Array.isArray(tempLocations) && tempLocations.length > 0) {
          // Keep temporary locations created within the last 7 days only
          const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          const filteredLocations = tempLocations.filter((loc: any) => {
            return loc.timestamp && loc.timestamp > oneWeekAgo;
          });
          
          if (filteredLocations.length !== tempLocations.length) {
            console.log(`Deleted ${tempLocations.length - filteredLocations.length} old temporary locations`);
            localStorage.setItem('tempLocations', JSON.stringify(filteredLocations));
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up old temporary locations:', error);
    }
  }, []);

  // Load locations and clean up old temporary locations on component mount
  useEffect(() => {
    cleanupOldTemporaryLocations();
    fetchLocations();
  }, [fetchLocations, cleanupOldTemporaryLocations]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetDropoffLocation = useCallback(() => {
    setDropoffLocation(null);
    localStorage.removeItem('dropoffLocation');
    
    // If there are locations in the list, use the first permanent location
    if (locations.length > 0) {
      // Find the first permanent (non-temporary) location
      const permanentLocation = locations.find(loc => !loc.isTemporary);
      
      if (permanentLocation) {
        const formattedLocation = {
          location: permanentLocation.location,
          lat: parseFloat(permanentLocation.latitude),
          lng: parseFloat(permanentLocation.longitude),
          id: permanentLocation.id,
          isTemporary: false
        };
        
        setDropoffLocation(formattedLocation);
        localStorage.setItem('dropoffLocation', JSON.stringify(formattedLocation));
        console.log('Reset location to first permanent location:', formattedLocation);
      } else {
        const tempLocation = locations[0];
        const formattedLocation = {
          location: tempLocation.location,
          lat: parseFloat(tempLocation.latitude),
          lng: parseFloat(tempLocation.longitude),
          id: tempLocation.id,
          isTemporary: true
        };
        
        setDropoffLocation(formattedLocation);
        localStorage.setItem('dropoffLocation', JSON.stringify(formattedLocation));
        console.log('Reset location to first temporary location:', formattedLocation);
      }
    }
  }, [locations]);

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      <form onSubmit={handleBooking} className="rental-form rounded-xl bg-[#F7F8FA] hover:shadow-lg p-6 cursor-pointer flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              {extra.label} (+{extra.price} SAR)
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
                    {typeof dropoffLocation.location === 'string' 
                      ? dropoffLocation.location 
                      : 'Dropoff location not selected'}
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
            <span>{typeof car.price === 'number' ? car.price.toFixed(2) : parseFloat(car.price).toFixed(2)} SAR</span>
          </div>
          {selectedExtras.length > 0 && (
            <div className="price-row flex justify-between mb-2 text-sm">
              <span>Extras:</span>
              <span>{selectedExtras.includes('driver') ? '55.00' : '0.00'} SAR</span>
            </div>
          )}
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>Tax:</span>
            <span>50.00 SAR</span>
          </div>
          <div className="price-row flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span className="text-[#E6911E]">{calculateTotal().toFixed(2)} SAR</span>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button onClick={() => setError(null)} className="absolute top-1 right-1 text-red-700">
              ×
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