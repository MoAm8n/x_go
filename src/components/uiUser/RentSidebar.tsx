import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveBooking, locationService } from '../../context/Data/DataUser';
import LocationMap from './LocationMap';
import 'leaflet/dist/leaflet.css';
import { VITE_OPENCAGE_API_KEY } from '../../context/api/Api';

// دالة لجلب اسم المدينة من الإحداثيات
export async function getCityName(lat: number, lng: number): Promise<string> {
  const apiKey = VITE_OPENCAGE_API_KEY || '9b3d92d856bb4f64bc6d08b3831d3e41';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en&pretty=1&no_annotations=1&limit=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const cityName =
        result.components.city ||
        result.components.town ||
        result.components.village ||
        result.components.county ||
        result.components.state ||
        `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      console.log(`OpenCage response for (${lat}, ${lng}):`, cityName);
      return cityName;
    }
    throw new Error('No results found');
  } catch (error) {
    console.error('Error fetching city name:', error);
    return `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
}

const EXTRAS_LIST = [
  { label: "Additional Driver", price: 55, id: "driver" }
];

const FIXED_PICKUP_LOCATION = {
  lat: 24.7136,
  lng: 46.6753,
  location: "Main Location",
  id: 0
};

interface Location {
  id?: number;
  user_id?: number;
  location: string;
  latitude: string;
  longitude: string;
  is_active?: number;
}

interface DropoffLocation {
  lat: number;
  lng: number;
  location?: string;
  id?: number;
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

const RentSidebar: React.FC<RentSidebarProps> = React.memo(({ car, carId }) => {
  const [formData, setFormData] = useState({
    pickupDate: "",
    dropoffDate: "",
    pickupTime: "10:00",
    dropoffTime: "10:00",
  });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(FIXED_PICKUP_LOCATION);
  const [dropoffLocation, setDropoffLocation] = useState<DropoffLocation | null>(null);
  const [selectingType, setSelectingType] = useState<"pickup" | "dropoff" | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isDropoffUserSelected, setIsDropoffUserSelected] = useState(false);
  const navigate = useNavigate();

  // تسجيل تغييرات dropoffLocation
  useEffect(() => {
    console.log("Current dropoffLocation:", dropoffLocation);
  }, [dropoffLocation]);

  // استعادة dropoffLocation من localStorage عند تحميل المكون
  useEffect(() => {
    const savedDropoff = localStorage.getItem('dropoffLocation');
    if (savedDropoff && !dropoffLocation) {
      const parsed = JSON.parse(savedDropoff);
      setDropoffLocation(parsed);
      setIsDropoffUserSelected(true);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('tokenUser');
      if (!user?.id || !token) {
        console.warn("المستخدم غير مسجل دخوله، لن يتم جلب المواقع");
        setError("يرجى تسجيل الدخول لتحميل المواقع");
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }
      console.log("جارٍ جلب المواقع النشطة للمستخدم:", user.id);
      const data = await locationService.getActiveLocations();
      setLocations(data);
      // فقط إذا لم يكن هناك dropoffLocation محدد من المستخدم
      if (data.length > 0 && !isDropoffUserSelected && !dropoffLocation) {
        setDropoffLocation({
          lat: parseFloat(data[0].latitude),
          lng: parseFloat(data[0].longitude),
          location: data[0].location,
          id: data[0].id
        });
        localStorage.setItem('dropoffLocation', JSON.stringify({
          lat: parseFloat(data[0].latitude),
          lng: parseFloat(data[0].longitude),
          location: data[0].location,
          id: data[0].id
        }));
      }
    } catch (err: any) {
      console.error("فشل تحميل المواقع:", err);
      if (err.message === 'يجب تسجيل الدخول لجلب المواقع النشطة' || 
          err.message === 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى') {
        setError('يرجى تسجيل الدخول لتحميل المواقع');
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }
      setError(err.message || "فشل تحميل المواقع");
    }
  }, [isDropoffUserSelected, dropoffLocation, navigate]);

  const calculateTotal = useCallback((): number => {
    const basePrice = typeof car.price === "number" ? car.price : parseFloat(car.price);
    const extrasTotal = selectedExtras.includes("driver") ? 55 : 0;
    const tax = 50;
    return basePrice + extrasTotal + tax;
  }, [car.price, selectedExtras]);

  const validateForm = useCallback((): boolean => {
    const errors: string[] = [];

    if (!formData.pickupDate || !formData.dropoffDate) {
      errors.push("يرجى تحديد تاريخي الاستلام والتسليم");
    }

    if (!formData.pickupTime || !formData.dropoffTime) {
      errors.push("يرجى تحديد وقتي الاستلام والتسليم");
    }

    if (selectedExtras.includes("driver")) {
      if (!pickupLocation || !pickupLocation.location) {
        errors.push("يرجى تحديد مكان استلام صالح");
      }
      if (!dropoffLocation || (!dropoffLocation.location)) {
        errors.push("يرجى تحديد مكان تسليم صالح");
      }
    }

    const start = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const end = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (start >= end) {
      errors.push("وقت التسليم يجب أن يكون بعد وقت الاستلام");
    } else if (durationHours < 4) {
      errors.push("الحد الأدنى لمدة الحجز هو 4 ساعات");
    }

    if (errors.length > 0) {
      setError(errors.join(". "));
      return false;
    }

    return true;
  }, [formData, pickupLocation, dropoffLocation, selectedExtras]);

  const handleDropoffSelect = async (lat: number, lng: number) => {
    try {
      setLoadingLocation(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('tokenUser');
      if (!user?.id || !token) {
        console.warn("المستخدم غير مسجل دخوله، سيتم توجيهه إلى صفحة تسجيل الدخول");
        setError("يرجى تسجيل الدخول لإضافة موقع");
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }

      const locationName = await getCityName(lat, lng);
      console.log("اسم الموقع من OpenCage:", locationName);

      // حفظ الموقع مؤقتًا
      const tempLocation = { lat, lng, location: locationName };
      setDropoffLocation(tempLocation);
      localStorage.setItem('dropoffLocation', JSON.stringify(tempLocation));
      setIsDropoffUserSelected(true);

      // محاولة إضافة الموقع إلى قاعدة البيانات
      try {
        const newLocation = await locationService.addLocation({
          location: locationName,
          latitude: lat.toString(),
          longitude: lng.toString(),
          is_active: 1
        });
        console.log("تمت إضافة الموقع بنجاح:", newLocation);
        const dropoff = { lat, lng, location: locationName, id: newLocation.id };
        setDropoffLocation(dropoff);
        localStorage.setItem('dropoffLocation', JSON.stringify(dropoff));
      } catch (error: any) {
        console.warn("فشل إضافة الموقع إلى قاعدة البيانات:", error.message);
        setError("تم حفظ الموقع مؤقتًا، لكن فشل في إضافته إلى قاعدة البيانات. يمكنك متابعة الحجز.");
      }

      setShowMap(false);
      setSelectingType(null);
    } catch (err: any) {
      console.error("خطأ أثناء معالجة اختيار الموقع:", err);
      setError(err.message || "حدث خطأ أثناء تحديد الموقع");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsBooking(true);
    setError(null);
    setSuccess(null);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('tokenUser');
      if (!user?.id || !token) {
        setError('يجب تسجيل الدخول لإتمام الحجز. سيتم توجيهك إلى صفحة تسجيل الدخول.');
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }

      const bookingData: BookingData = {
        start_date: `${formData.pickupDate}T${formData.pickupTime}:00`,
        end_date: `${formData.dropoffDate}T${formData.dropoffTime}:00`,
        carmodel_id: carId,
        user_id: user.id.toString(),
        additional_driver: selectedExtras.includes("driver") ? "1" : "0",
        pickup_location: selectedExtras.includes("driver") && pickupLocation?.location
          ? pickupLocation.location
          : FIXED_PICKUP_LOCATION.location,
        dropoff_location: selectedExtras.includes("driver") && dropoffLocation
          ? dropoffLocation.id?.toString() || dropoffLocation.location || ""
          : "",
        location_id: selectedExtras.includes("driver") && pickupLocation?.id
          ? pickupLocation.id.toString()
          : "0",
      };

      console.log("بيانات الحجز المرسلة:", bookingData);

      const res = await saveBooking(carId, bookingData);
      setSuccess("تم تأكيد الحجز بنجاح!");

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
      console.error("تفاصيل خطأ الحجز:", err);
      if (err.message === 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى') {
        setError('انتهت صلاحية الجلسة. سيتم توجيهك إلى صفحة تسجيل الدخول.');
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }
      setError(err.message || "فشل الحجز. يرجى التحقق من البيانات والمحاولة مرة أخرى.");
    } finally {
      setIsBooking(false);
    }
  }, [validateForm, formData, pickupLocation, dropoffLocation, carId, selectedExtras, navigate, car, calculateTotal]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('tokenUser');
    if (user?.id && token && !isDropoffUserSelected && !dropoffLocation) {
      fetchLocations();
    }
  }, [fetchLocations, isDropoffUserSelected, dropoffLocation]);

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
                  min={type === 'dropoff' ? formData.pickupDate || new Date().toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
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
                onChange={() => 
                  setSelectedExtras(prev =>
                    prev.includes(extra.id)
                      ? prev.filter(id => id !== extra.id)
                      : [...prev, extra.id]
                  )
                }
                className="mr-2 w-4 h-4 text-[#E6911E] focus:ring-[#E6911E] border-gray-300 rounded"
              />
              {extra.label === "Additional Driver" ? "سائق إضافي" : extra.label} (+{extra.price} ريال)
            </label>
          ))}
        </div>

        <div className="my-4">
          <label className="block mb-2 text-sm font-medium">مكان الاستلام</label>
          <div className="p-2 bg-gray-100 rounded-lg">
            <p className="font-medium">{pickupLocation?.location || FIXED_PICKUP_LOCATION.location}</p>
          </div>
        </div>

        {selectedExtras.includes("driver") && (
          <div className="my-4">
            <label className="block mb-2 text-sm font-medium">مكان التسليم</label>
            <div className="flex gap-2">
              <div className="flex-1 p-2 bg-gray-100 rounded-lg">
                {dropoffLocation ? (
                  <p className="font-medium">{dropoffLocation.location}</p>
                ) : (
                  <p className="text-gray-500">لم يتم تحديد مكان التسليم</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectingType("dropoff");
                  setShowMap(true);
                }}
                className="px-4 py-2 bg-[#E6911E] text-white rounded-lg"
              >
                تحديد على الخريطة
              </button>
            </div>
          </div>
        )}

        <div className="price-summary bg-gray-50 p-4 rounded-lg my-4">
          <h3 className="font-bold mb-3 text-lg">ملخص السعر:</h3>
          <div className="price-row flex justify-between mb-2 text-sm">
            <span>السعر الأساسي:</span>
            <span>{typeof car.price === "number" ? car.price.toFixed(2) : parseFloat(car.price).toFixed(2)} ريال</span>
          </div>
          {selectedExtras.length > 0 && (
            <div className="price-row flex justify-between mb-2 text-sm">
              <span>الإضافات:</span>
              <span>{selectedExtras.includes("driver") ? "55.00" : "0.00"} ريال</span>
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
            <button 
              onClick={() => setError(null)}
              className="absolute top-1 right-1 text-red-500"
            >
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
          className={`w-full bg-[#E6911E] hover:bg-[#D6820E] text-white py-3 rounded-lg transition-colors font-medium ${isBooking ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isBooking ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جارٍ المعالجة...
            </>
          ) : (
            "احجز الآن"
          )}
        </button>
      </form>

      {showMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {selectingType === "pickup" ? "تحديد مكان الاستلام" : "تحديد مكان التسليم"}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log("Closing map, dropoffLocation:", dropoffLocation);
                  setShowMap(false);
                  setSelectingType(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                حفظ وإغلاق
              </button>
              <button
                onClick={() => {
                  console.log("Cancelling map, dropoffLocation:", dropoffLocation);
                  setShowMap(false);
                  setSelectingType(null);
                }}
                className="p-2 rounded hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            <LocationMap 
              pickupLocation={FIXED_PICKUP_LOCATION}
              dropoffLocation={dropoffLocation}
              onDropoffSelect={handleDropoffSelect}
              className="h-full w-full"
            />
            
            {loadingLocation && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-[#E6911E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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