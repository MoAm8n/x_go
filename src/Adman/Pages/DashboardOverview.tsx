import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import {
  Briefcase,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { API_URL } from "../../context/api/Api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interfaces (كما هي، بدون تغيير)
interface BookingType {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  final_price: string;
  model_name: string;
  brand_name: string;
  car_model_image?: string;
  payment_method?: string;
  user_name?: string;
  user_email?: string;
}

interface DetailedBooking {
  id: number;
  start_date: string;
  end_date: string;
  final_price: string;
  status: string;
  additional_driver: number;
  payment_method: string;
  payment_status: string | null;
  transaction_id: string | null;
  car_model: {
    id: string;
    attributes: {
      year: string;
      price: string;
      engine_type: string;
      transmission_type: string;
      seat_type: string;
      seats_count: number;
      acceleration: string;
      image: string;
    };
    relationship: {
      "Model Names": {
        model_name_id: string;
        model_name: string;
      };
      Types: {
        type_id: string;
        type_name: string;
      };
      Brand: {
        brand_id: number;
        brand_name: string;
      };
      Ratings: {
        average_rating: string;
        ratings_count: number;
      };
    };
  };
  location: string | null;
  user: {
    id: number;
    name: string;
    last_name: string;
    image: string | null;
    email: string;
    phone: string;
  };
  car: {
    id: number;
    carmodel_id: number;
    plate_number: string;
    status: string;
    image: string | null;
    color: string;
    description: string;
    capacity: string;
  } | null;
}

interface DriverType {
  id: number;
  attributes: {
    name: string;
    email: string;
    phone: string;
  };
}

// Utility Functions (محدثة لدعم الترجمة)
function getStatusBadge(status: string, t: (key: string) => string) {
  const statusMap: { [key: string]: { color: string; icon: React.ReactNode; text: string } } = {
    Success: { color: "green", icon: <CheckCircle size={16} />, text: t("status.success") },
    confirmed: { color: "green", icon: <CheckCircle size={16} />, text: t("status.confirmed") },
    completed: { color: "green", icon: <CheckCircle size={16} />, text: t("status.completed") },
    car_assigned: { color: "green", icon: <CheckCircle size={16} />, text: t("status.car_assigned") },
    Processing: { color: "yellow", icon: <Clock size={16} />, text: t("status.processing") },
    Failed: { color: "red", icon: <XCircle size={16} />, text: t("status.failed") },
    canceled: { color: "red", icon: <XCircle size={16} />, text: t("status.canceled") },
  };
  const badge = statusMap[status] || { color: "gray", icon: null, text: t("status.pending") };
  return (
    <span className={`flex items-center gap-1 bg-${badge.color}-100 text-${badge.color}-600 px-2 py-1 rounded-full text-xs font-medium`}>
      {badge.icon} {badge.text}
    </span>
  );
}

const TABS = [
  { label: "tabs.confirmed", color: "#28C76F", key: "confirmed" },
  { label: "tabs.processing", color: "#F4A825", key: "processing" },
  { label: "tabs.completed", color: "#00CFE8", key: "completed" },
  { label: "tabs.canceled", color: "#6C757D", key: "canceled" },
  { label: "tabs.new_bookings", color: "#3F51B5", key: "new-bookings" },
  { label: "tabs.car_assigned", color: "#FF5733", key: "car_assigned" },
];

// API Functions (محدثة لدعم الترجمة)
async function fetchBookings(tabKey: string, t: (key: string) => string): Promise<BookingType[]> {
  let url = "";
  switch (tabKey) {
    case "confirmed": url = `${API_URL}/api/admin/Confirmed-Booking`; break;
    case "completed": url = `${API_URL}/api/admin/Completed-Booking`; break;
    case "canceled": url = `${API_URL}/api/admin/Canceled-Booking`; break;
    case "processing": url = `${API_URL}/api/admin/Driver-Assigned-Booking`; break;
    case "new-bookings": url = `${API_URL}/api/admin/new-bookings`; break;
    case "car_assigned": url = `${API_URL}/api/admin/AssignCar`; break;
    default: url = `${API_URL}/api/admin/Confirmed-Booking`;
  }

  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return [];
  }

  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    const bookings = response.data.data || [];
    return bookings.map((booking: any) => ({
      id: booking.id,
      start_date: booking.start_date || "",
      end_date: booking.end_date || "",
      status: booking.status || "Pending",
      final_price: booking.final_price || "0",
      model_name: booking.model_name || booking.car_model?.relationship?.["Model Names"]?.model_name || t("not_available"),
      brand_name: booking.brand_name || booking.car_model?.relationship?.Brand?.brand_name || t("not_available"),
      car_model_image: booking.car_model_image || booking.car_model?.attributes?.image || "",
      payment_method: booking.payment_method || t("not_available"),
      user_name: booking.user_name || booking.user?.name || t("not_available"),
      user_email: booking.user_email || booking.user?.email || t("not_available"),
    }));
  } catch (err) {
    toast.error(t("toast.error_fetching_bookings"));
    console.error("Error fetching bookings:", err);
    return [];
  }
}

async function fetchBookingDetails(id: number, t: (key: string) => string): Promise<DetailedBooking | null> {
  const url = `${API_URL}/api/admin/Booking/${id}`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return null;
  }

  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.data || null;
  } catch (err) {
    toast.error(t("toast.error_fetching_details"));
    console.error("Error fetching booking details:", err);
    return null;
  }
}

async function deleteBooking(id: number, t: (key: string) => string): Promise<boolean> {
  const url = `${API_URL}/api/admin/Booking/${id}`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return false;
  }

  try {
    const response = await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 200) {
      toast.success(response.data?.message || t("toast.booking_deleted"));
      return true;
    }
    toast.error(response.data?.message || t("toast.error_delete_booking"));
    return false;
  } catch (err: any) {
    console.error("Error deleting booking:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || t("toast.error_delete_booking", { message: err.message }));
    return false;
  }
}

async function updateBookingStatus(id: number, status: string, t: (key: string) => string): Promise<boolean> {
  const url = `${API_URL}/api/admin/booking/${id}/status`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return false;
  }

  const validStatuses = ["confirmed", "processing", "completed", "canceled", "car_assigned"];
  if (!validStatuses.includes(status)) {
    toast.error(t("toast.invalid_status", { status, allowed: validStatuses.join(", ") }));
    return false;
  }

  try {
    const response = await axios.post(url, { id, status }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
      return true;
    }
    toast.error(response.data?.message || t("toast.error_update_status"));
    return false;
  } catch (err: any) {
    console.error("Error updating booking status:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || t("toast.error_update_status", { message: err.message }));
    return false;
  }
}

async function assignCar(bookingId: number, carId: number, t: (key: string) => string): Promise<boolean> {
  const url = `${API_URL}/api/admin/Booking/${bookingId}/Assign-Car`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return false;
  }

  try {
    const response = await axios.post(url, { car_id: carId }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
      return true;
    }
    toast.error(response.data?.message || t("toast.error_assign_car"));
    return false;
  } catch (err: any) {
    console.error("Error assigning car:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || t("toast.error_assign_car", { message: err.message }));
    return false;
  }
}

async function assignDriver(bookingId: number, driverId: number, t: (key: string) => string): Promise<boolean> {
  const url = `${API_URL}/api/admin/Booking/${bookingId}/assign-driver`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return false;
  }

  try {
    const response = await axios.post(url, { driver_id: driverId }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
      return true;
    }
    toast.error(response.data?.message || t("toast.error_assign_driver"));
    return false;
  } catch (err: any) {
    console.error("Error assigning driver:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || t("toast.error_assign_driver", { message: err.message }));
    return false;
  }
}

async function changeCarStatus(carId: number, t: (key: string) => string): Promise<boolean> {
  const url = `${API_URL}/api/admin/car/${carId}/changeStat`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return false;
  }

  try {
    const response = await axios.post(url, { status: "available" }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
      return true;
    }
    toast.error(response.data?.message || t("toast.error_change_car_status"));
    return false;
  } catch (err: any) {
    console.error("Error changing car status:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || t("toast.error_change_car_status", { message: err.message }));
    return false;
  }
}

async function fetchDrivers(t: (key: string) => string): Promise<DriverType[]> {
  const url = `${API_URL}/api/admin/Drivers`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error(t("toast.token_not_found"));
    return [];
  }

  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.data || [];
  } catch (err) {
    toast.error(t("toast.error_fetching_drivers"));
    console.error("Error fetching drivers:", err);
    return [];
  }
}

// Component
const DashboardOverview = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("confirmed");
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<DetailedBooking | null>(null);
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [showDriversModal, setShowDriversModal] = useState(false);
  const [driverIdInput, setDriverIdInput] = useState<{ [key: number]: string }>({});

  // قراءة اللغة من localStorage عند تحميل المكون
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage && ["ar", "en", "ru"].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    } else {
      i18n.changeLanguage("en");
      document.documentElement.dir = "ltr";
    }
  }, [i18n]);

  useEffect(() => {
    setLoading(true);
    fetchBookings(activeTab, t)
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error loading bookings:", err))
      .finally(() => setLoading(false));
  }, [activeTab, t]);

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      fetchDrivers(t)
        .then((data) => setDrivers(data))
        .catch((err) => console.error("Error loading drivers:", err))
        .finally(() => setLoading(false));
    }
  }, [showModal, t]);

  const handleViewDetails = async (id: number) => {
    setLoading(true);
    const details = await fetchBookingDetails(id, t);
    setSelectedBooking(details);
    setShowModal(true);
    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDriversModal(false);
    setSelectedBooking(null);
  };

  const handleDeleteBooking = async (id: number) => {
    setLoading(true);
    const success = await deleteBooking(id, t);
    if (success) {
      await fetchBookings(activeTab, t).then((data) => setBookings(data)).catch((err) => {
        console.error("Error refreshing bookings:", err);
        toast.error(t("toast.error_fetching_bookings"));
      });
      closeModal();
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    setLoading(true);
    const success = await updateBookingStatus(id, status, t);
    if (success) {
      const updatedDetails = await fetchBookingDetails(id, t);
      setSelectedBooking(updatedDetails);
      await fetchBookings(activeTab, t).then((data) => setBookings(data));
    }
    setLoading(false);
  };

  const handleAssignCar = async (bookingId: number) => {
    setLoading(true);
    const carId = selectedBooking?.car?.id || selectedBooking?.car_model?.id;
    if (!carId) {
      toast.error(t("toast.car_id_not_found"));
      setLoading(false);
      return;
    }
    const success = await assignCar(bookingId, parseInt(carId), t);
    if (success) {
      const updatedDetails = await fetchBookingDetails(bookingId, t);
      setSelectedBooking(updatedDetails);
      await fetchBookings(activeTab, t).then((data) => setBookings(data));
    }
    setLoading(false);
  };

  const handleAllAssignCar = () => {
    setLoading(true);
    setActiveTab("car_assigned");
    setLoading(false);
  };

  const handleAssignDriver = async (bookingId: number) => {
    const driverId = driverIdInput[bookingId];
    if (!driverId || isNaN(parseInt(driverId))) {
      toast.error(t("toast.invalid_driver_id"));
      return;
    }
    setLoading(true);
    const success = await assignDriver(bookingId, parseInt(driverId), t);
    if (success) {
      await fetchBookings(activeTab, t).then((data) => setBookings(data));
      setDriverIdInput((prev) => ({ ...prev, [bookingId]: "" }));
    }
    setLoading(false);
  };

  const handleChangeCarStatus = async (carId: number) => {
    setLoading(true);
    const success = await changeCarStatus(carId, t);
    if (success) {
      const updatedDetails = await fetchBookingDetails(selectedBooking!.id, t);
      setSelectedBooking(updatedDetails);
      await fetchBookings(activeTab, t).then((data) => setBookings(data));
    }
    setLoading(false);
  };

  const handleDriverIdChange = (bookingId: number, value: string) => {
    setDriverIdInput((prev) => ({ ...prev, [bookingId]: value }));
  };

  const getValueOrNA = (value: any) => (value || value === 0 ? value : t("not_available"));

  return (
    <div className="flex min-h-screen bg-[#fdf9f2] flex-col lg:flex-row">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
          <h1 className="font-bold text-2xl sm:text-3xl mb-2">{t("welcome_back")}</h1>
          <p className="text-[#b0b0b0] text-sm font-Poppins">{t("latest_update")}</p>
          <button
            onClick={handleAllAssignCar}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              t("all_assign_car")
            )}
          </button>

          <div className="px-3 pt-6 pb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-xs sm:text-sm font-medium transition-all rounded py-2 px-3 ${activeTab === tab.key ? "bg-[#FAF7F2] shadow font-semibold" : ""}`}
                style={{ color: tab.color }}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>

          <div className="rounded-xl overflow-x-auto">
            <table className="min-w-full text-left rounded-xl bg-[#FAF7F2] shadow">
              <thead>
                <tr className="text-[#8B919E] bg-[#FAF7F2] text-xs font-bold hidden md:table-row">
                  <th className="py-4 px-4 sm:px-6 rounded-tl-xl">{t("table_headers.car")}</th>
                  <th className="py-4 px-4 sm:px-6">{t("table_headers.payment_amount")}</th>
                  <th className="py-4 px-4 sm:px-6">{t("table_headers.price_per_day")}</th>
                  <th className="py-4 px-4 sm:px-6">{t("table_headers.status")}</th>
                  <th className="py-4 px-4 sm:px-6 rounded-tr-xl text-center">{t("table_headers.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="font-bold text-lg">{t("loading")}</span>
                      </div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v2m0 4h.01" />
                        </svg>
                        <span className="font-bold text-lg">{t("no_data")}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((b, i) => (
                    <tr key={i} className="border-b last:border-b-0 flex flex-col md:table-row">
                      <td className="py-3 px-4 sm:px-6 md:table-cell">
                        <div className="md:hidden font-semibold">{t("table_headers.car")}:</div>
                        {`${b.brand_name} ${b.model_name}`}
                      </td>
                      <td className="py-3 px-4 sm:px-6 md:table-cell">
                        <div className="md:hidden font-semibold">{t("table_headers.payment_amount")}:</div>
                        {b.final_price}
                      </td>
                      <td className="py-3 px-4 sm:px-6 md:table-cell">
                        <div className="md:hidden font-semibold">{t("table_headers.price_per_day")}:</div>
                        {b.final_price && b.start_date && b.end_date ? (parseFloat(b.final_price) / ((new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / (1000 * 3600 * 24))).toFixed(2) : t("not_available")}
                      </td>
                      <td className="py-3 px-4 sm:px-6 md:table-cell">
                        <div className="md:hidden font-semibold">{t("table_headers.status")}:</div>
                        {getStatusBadge(b.status, t)}
                      </td>
                      <td className="py-3 px-4 sm:px-6 md:table-cell flex flex-col md:flex-row gap-2 justify-center items-center">
                        <div className="md:hidden font-semibold">{t("table_headers.actions")}:</div>
                        <button onClick={() => handleViewDetails(b.id)} className="bg-blue-500 text-white p-2 rounded text-xs sm:text-sm w-full md:w-auto">{t("buttons.details")}</button>
                        {activeTab === "new-bookings" && (
                          <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => handleUpdateStatus(b.id, "completed")} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" disabled={loading} title={t("buttons.confirm")}><CheckCircle size={20} /></button>
                            <button onClick={() => handleUpdateStatus(b.id, "canceled")} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" disabled={loading} title={t("buttons.cancel")}><XCircle size={20} /></button>
                            <button onClick={() => handleDeleteBooking(b.id)} className="bg-red-500 text-white p-2 rounded" disabled={loading}><Trash2 size={20} /></button>
                          </div>
                        )}
                        {activeTab === "car_assigned" && (
                          <div className="flex gap-2 items-center w-full md:w-auto">
                            <input
                              type="number"
                              value={driverIdInput[b.id] || ""}
                              onChange={(e) => handleDriverIdChange(b.id, e.target.value)}
                              placeholder={t("driver_id_placeholder")}
                              className="p-2 border rounded text-xs sm:text-sm w-full md:w-24"
                              disabled={loading}
                            />
                            <button onClick={() => handleAssignDriver(b.id)} className="bg-purple-500 text-white p-2 rounded text-xs sm:text-sm" disabled={loading}>{t("buttons.assign")}</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {showModal && selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={loading ? undefined : closeModal}>
              <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">{t("booking_details.title", { id: selectedBooking.id })}</h2>
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl sm:text-2xl" disabled={loading}>X</button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{t("booking_details.booking_info")}</h3>
                    <p><strong>{t("booking_details.start_date")}:</strong> {getValueOrNA(selectedBooking.start_date)}</p>
                    <p><strong>{t("booking_details.end_date")}:</strong> {getValueOrNA(selectedBooking.end_date)}</p>
                    <p><strong>{t("booking_details.final_price")}:</strong> {getValueOrNA(selectedBooking.final_price)}</p>
                    <p><strong>{t("booking_details.status")}:</strong> {getStatusBadge(selectedBooking.status, t)}</p>
                    <p><strong>{t("booking_details.payment_method")}:</strong> {getValueOrNA(selectedBooking.payment_method)}</p>
                    <p><strong>{t("booking_details.additional_driver")}:</strong> {getValueOrNA(selectedBooking.additional_driver) ? t("yes") : t("no")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{t("booking_details.car_info")}</h3>
                    <p><strong>{t("booking_details.model")}:</strong> {getValueOrNA(selectedBooking.car_model?.relationship?.["Model Names"]?.model_name)}</p>
                    <p><strong>{t("booking_details.brand")}:</strong> {getValueOrNA(selectedBooking.car_model?.relationship?.Brand?.brand_name)}</p>
                    <p><strong>{t("booking_details.year")}:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.year)}</p>
                    <p><strong>{t("booking_details.plate_number")}:</strong> {getValueOrNA(selectedBooking.car?.plate_number)}</p>
                    <p><strong>{t("booking_details.engine_type")}:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.engine_type)}</p>
                    <p><strong>{t("booking_details.transmission")}:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.transmission_type)}</p>
                    <p><strong>{t("booking_details.seats")}:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.seats_count)}</p>
                    <p><strong>{t("booking_details.color")}:</strong> {getValueOrNA(selectedBooking.car?.color)}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 sm:gap-4 justify-end">
                  <button onClick={() => handleUpdateStatus(selectedBooking.id, "completed")} className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs sm:text-sm" disabled={loading}>
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      t("buttons.complete")
                    )}
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedBooking.id, "canceled")} className="bg-yellow-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs sm:text-sm" disabled={loading}>
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      t("buttons.cancel")
                    )}
                  </button>
                  <button onClick={() => handleDeleteBooking(selectedBooking.id)} className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs sm:text-sm" disabled={loading}>
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      t("buttons.delete_booking")
                    )}
                  </button>
                  <button onClick={() => handleAssignCar(selectedBooking.id)} className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs sm:text-sm" disabled={loading}>
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      t("buttons.assign_car")
                    )}
                  </button>
                  <button onClick={() => setShowDriversModal(true)} className="bg-purple-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs sm:text-sm" disabled={loading}>
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      t("buttons.view_drivers")
                    )}
                  </button>
                  <button onClick={() => { const carId = selectedBooking.car?.id || selectedBooking.car_model?.id; if (!carId) { toast.error(t("toast.car_id_not_found")); return; } handleChangeCarStatus(parseInt(carId)); }} className="bg-teal-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs sm:text-sm" disabled={loading}>
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      t("buttons.available")
                    )}
                  </button>
                </div>
                {showDriversModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto relative">
                      <h3 className="text-lg sm:text-xl font-bold mb-4">{t("drivers_list.title")}</h3>
                      <button onClick={() => setShowDriversModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl sm:text-2xl">X</button>
                      {drivers.length === 0 ? (
                        <p className="text-center text-gray-500">{t("drivers_list.no_data")}</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left">
                            <thead>
                              <tr className="text-[#8B919E] bg-[#FAF7F2] text-xs font-bold">
                                <th className="py-3 px-4">{t("drivers_list.id")}</th>
                                <th className="py-3 px-4">{t("drivers_list.name")}</th>
                                <th className="py-3 px-4">{t("drivers_list.email")}</th>
                                <th className="py-3 px-4">{t("drivers_list.phone")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {drivers.map((driver) => (
                                <tr key={driver.id} className="border-b last:border-b-0">
                                  <td className="py-3 px-4">{driver.id}</td>
                                  <td className="py-3 px-4">{driver.attributes.name}</td>
                                  <td className="py-3 px-4">{driver.attributes.email}</td>
                                  <td className="py-3 px-4">{driver.attributes.phone}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={i18n.language === "ar"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      />
    </div>
  );
};

export default DashboardOverview;

