import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveBooking, locationService } from '../../context/Data/DataUser';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import  LocationMap  from './LocationMap';

const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const selectedLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  id?: number;
  user_id?: number;
  location: string;
  latitude: string;
  longitude: string;
  is_active?: number;
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

const EXTRAS_LIST = [
  { label: "Additional Driver", price: 55, id: "driver" }
];

const FitBounds = ({ pickupLocation, dropoffLocation }: {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      const bounds = L.latLngBounds(
        [parseFloat(pickupLocation.latitude), parseFloat(pickupLocation.longitude)],
        [parseFloat(dropoffLocation.latitude), parseFloat(dropoffLocation.longitude)]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickupLocation, dropoffLocation, map]);

  return null;
};

export const RentSidebar: React.FC<RentSidebarProps> = ({ car, carId }) => {
  const [formData, setFormData] = useState({
    pickupDate: "",
    dropoffDate: "",
    pickupTime: "10:00",
    dropoffTime: "10:00",
  });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectingType, setSelectingType] = useState<"pickup" | "dropoff" | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const detectCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Browser doesn't support geolocation");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    } catch (err) {
      setError("Failed to get current location");
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const data = await locationService.getActiveLocations();
      setLocations(data);
      if (data.length > 0) {
        setPickupLocation(data[0]);
        setDropoffLocation(data[0]);
      }
    } catch (err) {
      setError("Failed to load locations");
    }
  }, []);

  const calculateTotal = useCallback((): number => {
    const basePrice = typeof car.price === "number" ? car.price : parseFloat(car.price);
    const extrasTotal = selectedExtras.includes("driver") ? 55 : 0;
    const tax = 50;
    return basePrice + extrasTotal + tax;
  }, [car.price, selectedExtras]);

  const validateForm = useCallback((): boolean => {
    const errors: string[] = [];

    if (!formData.pickupDate || !formData.dropoffDate) {
      errors.push("Please select both pickup and drop-off dates");
    }

    if (!formData.pickupTime || !formData.dropoffTime) {
      errors.push("Please select both pickup and drop-off times");
    }

    if (!pickupLocation || !dropoffLocation) {
      errors.push("Please select both pickup and drop-off locations");
    }

    const start = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const end = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    if (start >= end) {
      errors.push("Drop-off must be after pick-up");
    } else if (durationHours < 4) {
      errors.push("Minimum booking duration is 4 hours");
    }

    if (errors.length > 0) {
      setError(errors.join(". "));
      return false;
    }

    return true;
  }, [formData, pickupLocation, dropoffLocation]);

  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsBooking(true);
    setError(null);
    setSuccess(null);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const locationId = pickupLocation?.id || dropoffLocation?.id;

      if (!locationId) {
        throw new Error("Please select a valid location");
      }

      const bookingData: BookingData = {
        start_date: `${formData.pickupDate}T${formData.pickupTime}:00`,
        end_date: `${formData.dropoffDate}T${formData.dropoffTime}:00`,
        carmodel_id: carId,
        additional_driver: selectedExtras.includes("driver") ? "1" : "0",
        pickup_location: pickupLocation?.id?.toString() || "",
        dropoff_location: dropoffLocation?.id?.toString() || "",
        location_id: locationId.toString(),
        user_id: user.id?.toString()
      };

      const res = await saveBooking(carId, bookingData);
      setSuccess("Booking confirmed!");
      navigate(`/bookings/${res.bookingId}`, {
        state: {
          carDetails: car,
          bookingDetails: {
            ...bookingData,
            extras: selectedExtras,
            totalPrice: calculateTotal()
          }
        }
      });
    } catch (err: any) {
      setError(err.message || "Booking failed. Please check your details and try again.");
    } finally {
      setIsBooking(false);
    }
  }, [validateForm, formData, pickupLocation, dropoffLocation, carId, selectedExtras, navigate, car, calculateTotal]);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    const newLocation = {
      location: "Custom Location",
      latitude: lat.toString(),
      longitude: lng.toString(),
      is_active: 1
    };

    if (selectingType === "pickup") {
      setPickupLocation(newLocation);
    } else if (selectingType === "dropoff") {
      setDropoffLocation(newLocation);
    }
    setSelectedLocation({ lat, lng });
    setShowMap(false);
  }, [selectingType]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    detectCurrentLocation();
    fetchLocations();
  }, [detectCurrentLocation, fetchLocations]);

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      {/* Booking Form */}
      <form onSubmit={handleBooking} className="rental-form rounded-xl bg-[#F7F8FA] hover:shadow-lg p-6 cursor-pointer flex-1">
        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {['pickup', 'dropoff'].map((type) => (
            <React.Fragment key={type}>
              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">{type === 'pickup' ? 'Pick-Up' : 'Drop-Off'} Date</label>
                <input
                  type="date"
                  name={`${type}Date`}
                  value={formData[`${type}Date` as keyof typeof formData]}
                  onChange={handleInputChange}
                  min={type === 'dropoff' ? formData.pickupDate || new Date().toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">{type === 'pickup' ? 'Pick-Up' : 'Drop-Off'} Time</label>
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

        {/* Location Selection */}
        {['pickup', 'dropoff'].map((type) => (
          <div className="my-4" key={type}>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{type === 'pickup' ? 'Pick-Up' : 'Drop-Off'} Location</label>
              <button 
                type="button"
                onClick={() => {
                  setSelectingType(type as "pickup" | "dropoff");
                  setShowMap(true);
                }}
                className="text-sm text-[#E6911E] hover:underline"
              >
                Select on Map
              </button>
            </div>
            <select
              name={`${type}Location`}
              value={type === 'pickup' ? pickupLocation?.id || '' : dropoffLocation?.id || ''}
              onChange={(e) => {
                const selected = locations.find(loc => loc.id === Number(e.target.value));
                type === 'pickup' ? setPickupLocation(selected || null) : setDropoffLocation(selected || null);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
              required
            >
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={`${type}-${loc.id}`} value={loc.id}>
                  {loc.location} (Lat: {loc.latitude}, Lng: {loc.longitude})
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Extras */}
        <div className="extras-section my-4">
          <h3 className="font-medium mb-2 text-sm">Add Extra:</h3>
          {EXTRAS_LIST.map((extra) => (
            <label key={extra.id} className="flex items-center mb-2 text-sm">
              <input
                type="checkbox"
                checked={selectedExtras.includes(extra.id)}
                onChange={() => 
                  setSelectedExtras(prev =>
                    prev.includes(extra.id)
                      ? prev.filter(id => id !== extra.id)
                      : [...prev, extra.id]
                  )
                }
                className="mr-2 w-4 h-4 text-[#E6911E] focus:ring-[#E6911E] border-gray-300 rounded"
              />
              {extra.label} (+${extra.price})
            </label>
          ))}
        </div>

        {/* Price Summary */}
        <div className="price-summary bg-gray-50 p-4 rounded-lg my-4">
          <h3 className="font-bold mb-3 text-lg">Price Summary:</h3>
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>Sub Total:</span>
            <span>${typeof car.price === "number" ? car.price.toFixed(2) : parseFloat(car.price).toFixed(2)}</span>
          </div>
          {selectedExtras.length > 0 && (
            <div className="price-row flex justify-between mb-2 text-sm">
              <span>Extras:</span>
              <span>${selectedExtras.includes("driver") ? "55.00" : "0.00"}</span>
            </div>
          )}
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>Tax:</span>
            <span>$50.00</span>
          </div>
          <div className="price-row flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span className="text-[#E6911E]">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isBooking}
          className={`w-full bg-[#E6911E] hover:bg-[#D6820E] text-white py-3 rounded-lg transition-colors font-medium ${isBooking ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isBooking ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Book Now"
          )}
        </button>
      </form>

      {/* Map Modal */}
      {showMap && currentPosition && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <LocationMap 
            currentPos={currentPosition} 
            onLocationSelect={handleLocationSelect} 
            selectedLocation={selectedLocation}
            className="h-full w-full"
          />
          <button
            onClick={() => setShowMap(false)}
            className="absolute top-4 right-4 bg-white p-2 rounded shadow-md hover:bg-gray-100 z-[1000]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Map Preview */}
      <div className="h-96 w-full md:w-1/2">
        {currentPosition && (
          <MapContainer
            center={[currentPosition.lat, currentPosition.lng]}
            zoom={13}
            scrollWheelZoom
            className="h-full w-full rounded-xl"
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {pickupLocation && (
              <Marker
                position={[parseFloat(pickupLocation.latitude), parseFloat(pickupLocation.longitude)]}
                icon={pickupIcon}
              >
                <Popup>Pickup Location</Popup>
              </Marker>
            )}

            {dropoffLocation && (
              <Marker
                position={[parseFloat(dropoffLocation.latitude), parseFloat(dropoffLocation.longitude)]}
                icon={dropoffIcon}
              >
                <Popup>Dropoff Location</Popup>
              </Marker>
            )}

            {pickupLocation && dropoffLocation && (
              <>
                <Polyline
                  positions={[
                    [parseFloat(pickupLocation.latitude), parseFloat(pickupLocation.longitude)],
                    [parseFloat(dropoffLocation.latitude), parseFloat(dropoffLocation.longitude)]
                  ]}
                  color="purple"
                  weight={4}
                  opacity={0.8}
                />
                <FitBounds
                  pickupLocation={pickupLocation}
                  dropoffLocation={dropoffLocation}
                />
              </>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
};
export default RentSidebar;