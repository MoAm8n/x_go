import React, { useState, useEffect } from "react";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { saveBooking } from "../../context/Data/DataUser";
import type { CarItem, BookingData, Location } from "../../context/Data/DataUser";
import { locationService } from "../../context/Data/DataUser";
import LocationMap from "./LocationMap";

const extrasList = [
  { label: "Additional Driver", price: 55, id: "driver" }
];

interface RentSidebarProps {
  car: CarItem;
  carId: string;
}

const RentSidebar: React.FC<RentSidebarProps> = ({ car, carId }) => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // States for location management
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLocation, setNewLocation] = useState({
    location: '',
    latitude: '',
    longitude: ''
  });
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: string;
    lng: string;
  } | null>(null);

  const navigate = useNavigate();
  const routerLocation = useRouterLocation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const locationsData = await locationService.getLocations();
        const activeLocations = locationsData.filter(loc => loc.is_active === 1);
        setLocations(activeLocations);
        
        if (activeLocations.length > 0) {
          setPickupLocation(activeLocations[0]);
          setDropoffLocation(activeLocations[0]);
        } else {
          setError('No active locations available. Please add a location.');
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('Session expired')) {
            return;
          }
          setError(err.message || "Failed to load locations. Please try again.");
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching locations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError("Please allow location access to use this feature");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({
          lat: latitude.toString(),
          lng: longitude.toString()
        });
        setNewLocation(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));
        setIsLoading(false);
        setShowMap(true);
      },
      (err) => {
        setError("Unable to retrieve your location: " + err.message);
        setIsLoading(false);
      }
    );
  };

  const handleLocationSelect = (lat: string, lng: string) => {
    setSelectedLocation({ lat, lng });
    setNewLocation(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleAddLocationClick = () => {
    setShowMap(true);
    setShowAddLocationForm(true);
  };

  const closeMap = () => {
    setShowMap(false);
  };

  const handleAddLocation = async () => {
    if (!newLocation.location || !newLocation.latitude || !newLocation.longitude) {
      setError("Please fill all location fields");
      return;
    }

    try {
      setIsLoading(true);
      await locationService.addLocation(newLocation);
      const updatedLocations = await locationService.getLocations();
      const activeLocations = updatedLocations.filter(loc => loc.is_active === 1);
      setLocations(activeLocations);
      
      const newlyAdded = activeLocations.find(
        loc => loc.location === newLocation.location
      );
      if (newlyAdded) {
        setPickupLocation(newlyAdded);
        setDropoffLocation(newlyAdded);
      }
      
      setNewLocation({ location: '', latitude: '', longitude: '' });
      setShowAddLocationForm(false);
      setShowMap(false);
    } catch (err) {
      setError("Failed to add location. Please try again.");
      console.error("Error adding location:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pickupDate || !dropoffDate) {
      setError("Please select pickup and drop-off dates");
      return;
    }

    if (!pickupLocation || !dropoffLocation) {
      setError("Please select pickup and drop-off locations");
      return;
    }

    const startDateTime = `${pickupDate}T${pickupTime}:00`;
    const endDateTime = `${dropoffDate}T${dropoffTime}:00`;

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        const tempBookingData = {
          start_date: startDateTime,
          end_date: endDateTime,
          carmodel_id: carId,
          additional_driver: selectedExtras.includes("driver") ? "1" : "0",
          pickup_location: pickupLocation.id.toString(),
          dropoff_location: dropoffLocation.id.toString(),
          carDetails: car,
          extras: selectedExtras,
          totalPrice: calculateTotal()
        };
        
        localStorage.setItem('tempBookingData', JSON.stringify(tempBookingData));
        
        navigate('/signin', { 
          state: { 
            from: routerLocation.pathname,
            tempBookingData 
          } 
        });
        return;
      }

      const user = JSON.parse(userData);
      
      const bookingData: BookingData = {
        start_date: startDateTime,
        end_date: endDateTime,
        carmodel_id: carId,
        user_id: user.id,
        additional_driver: selectedExtras.includes("driver") ? "1" : "0",
        pickup_location: pickupLocation.id.toString(),
        dropoff_location: dropoffLocation.id.toString()
      };

      setIsBooking(true);
      const res = await saveBooking(carId, bookingData);
      
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed, please try again");
    } finally {
      setIsBooking(false);
    }
  };

  const calculateTotal = (): number => {
    const basePrice = typeof car.price === "number" ? car.price : parseFloat(car.price);
    const extrasTotal = selectedExtras.includes("driver") ? 55 : 0;
    const tax = 50;
    return basePrice + extrasTotal + tax;
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading locations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (locations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No available locations found. Please add a location to continue.</p>
        <button 
          onClick={handleAddLocationClick}
          className="mt-2 bg-[#E6911E] text-white px-4 py-2 rounded"
        >
          Add New Location
        </button>
        <button 
          onClick={getCurrentLocation}
          className="mt-2 ml-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Use My Current Location
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      <form onSubmit={handleBooking} className="rental-form rounded-xl bg-[#F7F8FA] hover:shadow-lg p-6 cursor-pointer flex-1">
        <h2 className="text-xl font-bold py-4">Rent This Vehicle</h2>
        
        {error && <div className="error-message text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</div>}

        {showAddLocationForm && !showMap && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-3">Add New Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Location Name</label>
                <input
                  type="text"
                  value={newLocation.location}
                  onChange={(e) => setNewLocation({...newLocation, location: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. Cairo Airport"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Latitude</label>
                <input
                  type="text"
                  value={newLocation.latitude}
                  onChange={(e) => setNewLocation({...newLocation, latitude: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. 30.1234"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Longitude</label>
                <input
                  type="text"
                  value={newLocation.longitude}
                  onChange={(e) => setNewLocation({...newLocation, longitude: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. 31.5678"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAddLocation}
                className="bg-[#E6911E] text-white px-4 py-2 rounded hover:bg-[#D6820E]"
              >
                Save Location
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddLocationForm(false);
                  setNewLocation({ location: '', latitude: '', longitude: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLocationClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Select on Map
              </button>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Use My Location
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block mb-2 text-sm font-medium">Pick-Up Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium">Pick-Up Time</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium">Drop-Off Date</label>
            <input
              type="date"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium">Drop-Off Time</label>
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
              required
            />
          </div>
        </div>

        <div className="my-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Pick-Up Location</label>
            <button 
              type="button"
              onClick={() => setShowAddLocationForm(!showAddLocationForm)}
              className="text-sm text-[#E6911E] hover:underline"
            >
              {showAddLocationForm ? 'Hide Form' : '+ Add New Location'}
            </button>
          </div>
          <select
            value={pickupLocation?.id || ''}
            onChange={(e) => {
              const selected = locations.find(loc => loc.id === Number(e.target.value));
              setPickupLocation(selected || null);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
            required
          >
            {locations.map((loc) => (
              <option key={`pickup-${loc.id}`} value={loc.id}>
                {loc.location} (Lat: {loc.latitude}, Lng: {loc.longitude})
              </option>
            ))}
          </select>
        </div>

        <div className="my-4">
          <label className="block mb-2 text-sm font-medium">Drop-Off Location</label>
          <select
            value={dropoffLocation?.id || ''}
            onChange={(e) => {
              const selected = locations.find(loc => loc.id === Number(e.target.value));
              setDropoffLocation(selected || null);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#E6911E] focus:border-[#E6911E]"
            required
          >
            {locations.map((loc) => (
              <option key={`dropoff-${loc.id}`} value={loc.id}>
                {loc.location} (Lat: {loc.latitude}, Lng: {loc.longitude})
              </option>
            ))}
          </select>
        </div>

        <div className="extras-section my-4">
          <h3 className="font-medium mb-2 text-sm">Add Extra:</h3>
          {extrasList.map((extra) => (
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

        <button
          type="submit"
          disabled={isBooking || !pickupLocation || !dropoffLocation}
          className="w-full bg-[#E6911E] hover:bg-[#D6820E] text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-70"
        >
          {isBooking ? "Processing..." : "Book Now"}
        </button>
      </form>

      {showMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <LocationMap
            locations={locations}
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            fullscreen={true}
            onLocationSelect={handleLocationSelect}
            onClose={closeMap}
          />
          {selectedLocation && (
            <div className="p-4 bg-gray-100">
              <p className="font-medium">Selected Location Coordinates:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-sm text-gray-600">Latitude:</label>
                  <input
                    type="text"
                    value={selectedLocation.lat}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Longitude:</label>
                  <input
                    type="text"
                    value={selectedLocation.lng}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    closeMap();
                    setShowAddLocationForm(true);
                  }}
                  className="bg-[#E6911E] text-white px-4 py-2 rounded hover:bg-[#D6820E]"
                >
                  Use These Coordinates
                </button>
                <button
                  onClick={closeMap}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentSidebar;