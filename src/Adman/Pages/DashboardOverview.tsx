import React, { useState, useEffect } from "react";
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

// Interfaces
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

// Utility Functions
function getStatusBadge(status: string) {
  const statusMap: { [key: string]: { color: string; icon: React.ReactNode; text: string } } = {
    Success: { color: "green", icon: <CheckCircle size={16} />, text: "Success" },
    confirmed: { color: "green", icon: <CheckCircle size={16} />, text: "Success" },
    completed: { color: "green", icon: <CheckCircle size={16} />, text: "Success" },
    car_assigned: { color: "green", icon: <CheckCircle size={16} />, text: "Success" },
    Processing: { color: "yellow", icon: <Clock size={16} />, text: "Processing" },
    Failed: { color: "red", icon: <XCircle size={16} />, text: "Failed" },
    canceled: { color: "red", icon: <XCircle size={16} />, text: "Failed" },
  };
  const badge = statusMap[status] || { color: "gray", icon: null, text: "Pending" };
  return (
    <span className={`flex items-center gap-1 bg-${badge.color}-100 text-${badge.color}-600 px-2 py-1 rounded-full text-xs font-medium`}>
      {badge.icon} {badge.text}
    </span>
  );
}

const TABS = [
  { label: "Confirmed Bookings", color: "#28C76F", key: "confirmed" },
  { label: "Processing Bookings", color: "#F4A825", key: "processing" },
  { label: "Completed Bookings", color: "#00CFE8", key: "completed" },
  { label: "Canceled Bookings", color: "#6C757D", key: "canceled" },
  { label: "New Bookings", color: "#3F51B5", key: "new-bookings" },
  { label: "Assigned Cars", color: "#FF5733", key: "car_assigned" },
];

const TABLE_HEADERS = {
  car: "Car",
  payment_amount: "Payment Amount",
  price_per_day: "Price/Day",
  status: "Status",
  actions: "Actions",
};

// API Functions
async function fetchBookings(tabKey: string): Promise<BookingType[]> {
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
    toast.error("Token not found. Please log in.");
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
      model_name: booking.model_name || booking.car_model?.relationship?.["Model Names"]?.model_name || "Unknown",
      brand_name: booking.brand_name || booking.car_model?.relationship?.Brand?.brand_name || "Unknown",
      car_model_image: booking.car_model_image || booking.car_model?.attributes?.image || "",
      payment_method: booking.payment_method || "Not Available",
      user_name: booking.user_name || booking.user?.name || "Not Available",
      user_email: booking.user_email || booking.user?.email || "Not Available",
    }));
  } catch (err) {
    toast.error("Error fetching bookings.");
    console.error("Error fetching bookings:", err);
    return [];
  }
}

async function fetchBookingDetails(id: number): Promise<DetailedBooking | null> {
  const url = `${API_URL}/api/admin/Booking/${id}`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) return null;

  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.data || null;
  } catch (err) {
    toast.error("Error fetching booking details.");
    console.error("Error fetching booking details:", err);
    return null;
  }
}

async function deleteBooking(id: number): Promise<boolean> {
  const url = `${API_URL}/api/admin/Booking/${id}`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) {
    toast.error("Token not found. Please log in.");
    return false;
  }

  try {
    const response = await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Delete response:", response);
    if (response.status === 200) {
      toast.success(response.data?.message || "Booking deleted successfully!");
      return true;
    }
    toast.error(response.data?.message || "Unexpected response from server or booking not deleted.");
    return false;
  } catch (err: any) {
    console.error("Error deleting booking:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || `Failed to delete booking: ${err.message}`);
    return false;
  }
}

async function updateBookingStatus(id: number, status: string): Promise<boolean> {
  const url = `${API_URL}/api/admin/booking/${id}/status`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) return false;

  const validStatuses = ["confirmed", "processing", "completed", "canceled", "car_assigned"];
  if (!validStatuses.includes(status)) {
    toast.error(`Invalid status: ${status}. Allowed: ${validStatuses.join(", ")}`);
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
    toast.error(response.data?.message || "Unexpected response from server.");
    return false;
  } catch (err: any) {
    console.error("Error updating booking status:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || `Failed to update booking status: ${err.message}`);
    return false;
  }
}

async function assignCar(bookingId: number, carId: number): Promise<boolean> {
  const url = `${API_URL}/api/admin/Booking/${bookingId}/Assign-Car`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) return false;

  try {
    const response = await axios.post(url, { car_id: carId }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
      return true;
    }
    toast.error(response.data?.message || "Unexpected response from server.");
    return false;
  } catch (err: any) {
    console.error("Error assigning car:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || `Failed to assign car: ${err.message}`);
    return false;
  }
}

async function assignDriver(bookingId: number, driverId: number): Promise<boolean> {
  const url = `${API_URL}/api/admin/Booking/${bookingId}/assign-driver`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) return false;

  try {
    const response = await axios.post(url, { driver_id: driverId }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
      return true;
    }
    toast.error(response.data?.message || "Unexpected response from server.");
    return false;
  } catch (err: any) {
    console.error("Error assigning driver:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || `Failed to assign driver: ${err.message}`);
    return false;
  }
}

async function changeCarStatus(carId: number): Promise<boolean> {
  const url = `${API_URL}/api/admin/car/${carId}/changeStat`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) return false;

  try {
    const response = await axios.post(url, { status: "available" }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
      return true;
    }
    toast.error(response.data?.message || "Unexpected response from server.");
    return false;
  } catch (err: any) {
    console.error("Error changing car status:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || `Failed to change car status: ${err.message}`);
    return false;
  }
}

async function fetchDrivers(): Promise<DriverType[]> {
  const url = `${API_URL}/api/admin/Drivers`;
  const token = localStorage.getItem("tokenAdman");
  if (!token) return [];

  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.data || [];
  } catch (err) {
    toast.error("Error fetching drivers.");
    console.error("Error fetching drivers:", err);
    return [];
  }
}

// Component
const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState<string>("confirmed");
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<DetailedBooking | null>(null);
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [showDriversModal, setShowDriversModal] = useState(false);
  const [driverIdInput, setDriverIdInput] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setLoading(true);
    fetchBookings(activeTab)
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error loading bookings:", err))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      fetchDrivers()
        .then((data) => setDrivers(data))
        .catch((err) => console.error("Error loading drivers:", err))
        .finally(() => setLoading(false));
    }
  }, [showModal]);

  const handleViewDetails = async (id: number) => {
    setLoading(true);
    const details = await fetchBookingDetails(id);
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
    const success = await deleteBooking(id);
    if (success) {
      await fetchBookings(activeTab).then((data) => setBookings(data)).catch((err) => {
        console.error("Error refreshing bookings:", err);
        toast.error("Failed to refresh bookings after deletion.");
      });
      closeModal();
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    setLoading(true);
    const success = await updateBookingStatus(id, status);
    if (success) {
      const updatedDetails = await fetchBookingDetails(id);
      setSelectedBooking(updatedDetails);
      await fetchBookings(activeTab).then((data) => setBookings(data));
    }
    setLoading(false);
  };

  const handleAssignCar = async (bookingId: number) => {
    setLoading(true);
    const carId = selectedBooking?.car?.id || selectedBooking?.car_model?.id;
    if (!carId) {
      toast.error("Car ID not found. Please select a car first.");
      setLoading(false);
      return;
    }
    const success = await assignCar(bookingId, parseInt(carId));
    if (success) {
      const updatedDetails = await fetchBookingDetails(bookingId);
      setSelectedBooking(updatedDetails);
      await fetchBookings(activeTab).then((data) => setBookings(data));
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
      toast.error("Please enter a valid Driver ID.");
      return;
    }
    setLoading(true);
    const success = await assignDriver(bookingId, parseInt(driverId));
    if (success) {
      await fetchBookings(activeTab).then((data) => setBookings(data));
      setDriverIdInput((prev) => ({ ...prev, [bookingId]: "" }));
    }
    setLoading(false);
  };

  const handleChangeCarStatus = async (carId: number) => {
    setLoading(true);
    const success = await changeCarStatus(carId);
    if (success) {
      const updatedDetails = await fetchBookingDetails(selectedBooking!.id);
      setSelectedBooking(updatedDetails);
      await fetchBookings(activeTab).then((data) => setBookings(data));
    }
    setLoading(false);
  };

  const handleDriverIdChange = (bookingId: number, value: string) => {
    setDriverIdInput((prev) => ({ ...prev, [bookingId]: value }));
  };

  const getValueOrNA = (value: any) => (value || value === 0 ? value : "Not Available");

  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-2 md:px-10">
          <h1 className="font-bold text-3xl mb-2">Welcome Back</h1>
          <p className="text-[#b0b0b0] text-sm font-Poppins">Get your latest update for the last 7 days</p>
          <button
            onClick={handleAllAssignCar}
            className="mt-2 bg-blue-500 text-white p-2 rounded flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "All Assign Car"}
          </button>

          <div className="px-3 pt-6 pb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-sm mb-1 font-medium transition-all rounded ${activeTab === tab.key ? "bg-[#FAF7F2] py-2 md:py-2 shadow font-semibold" : ""}`}
                style={{ color: tab.color }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl">
            <table className="min-w-full text-left rounded-xl overflow-hidden mb-10">
              <thead>
                <tr className="text-[#8B919E] bg-[#FAF7F2] text-xs font-bold">
                  <th className="py-5 px-6 rounded-tl-xl">{TABLE_HEADERS.car}</th>
                  <th className="py-2 px-6">{TABLE_HEADERS.payment_amount}</th>
                  <th className="py-2 px-6">{TABLE_HEADERS.price_per_day}</th>
                  <th className="py-2 px-6">{TABLE_HEADERS.status}</th>
                  <th className="py-2 px-6 rounded-tr-xl w-80 text-center">{TABLE_HEADERS.actions}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-10"><div className="flex flex-col items-center gap-2 text-gray-500"><svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><span className="font-bold text-xl">Loading...</span></div></td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10"><div className="flex flex-col items-center gap-2 text-gray-400"><svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v2m0 4h.01"/></svg><span className="font-bold text-xl">No data available</span></div></td></tr>
                ) : (
                  bookings.map((b, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-3 px-6">{`${b.brand_name} ${b.model_name}`}</td>
                      <td className="py-3 px-6">{b.final_price}</td>
                      <td className="py-3 px-6">{b.final_price && b.start_date && b.end_date ? (parseFloat(b.final_price) / ((new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / (1000 * 3600 * 24))).toFixed(2) : "N/A"}</td>
                      <td className="py-3 px-6">{getStatusBadge(b.status)}</td>
                      <td className="flex gap-2 justify-center w-80">
                        <button onClick={() => handleViewDetails(b.id)} className="bg-blue-500 text-white p-2 rounded">Details</button>
                        {activeTab === "new-bookings" && (
                          <>
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateStatus(b.id, "completed")} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" disabled={loading} title="Confirm"><CheckCircle size={20} />ؤؤ</button>
                              {/* <button onClick={() => handleUpdateStatus(b.id, "processing")} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded" disabled={loading} title="Processing"><Clock size={20} /></button> */}
                              <button onClick={() => handleUpdateStatus(b.id, "canceled")} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" disabled={loading} title="Cancel"><XCircle size={20} /></button>
                            </div>
                            <button onClick={() => handleDeleteBooking(b.id)} className="bg-red-500 text-white p-2 rounded" disabled={loading}><Trash2 size={20} /></button>
                          </>
                        )}
                        {activeTab === "car_assigned" && (
                          <div className="flex gap-2 items-center">
                            <input type="number" value={driverIdInput[b.id] || ""} onChange={(e) => handleDriverIdChange(b.id, e.target.value)} placeholder="Driver ID" className="p-2 border rounded w-24" disabled={loading} />
                            <button onClick={() => handleAssignDriver(b.id)} className="bg-purple-500 text-white p-2 rounded" disabled={loading}>Assign</button>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={loading ? undefined : closeModal}>
              <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Booking Details (ID: {selectedBooking.id})</h2>
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl" disabled={loading}>X</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Booking Information</h3>
                    <p><strong>Start Date:</strong> {getValueOrNA(selectedBooking.start_date)}</p>
                    <p><strong>End Date:</strong> {getValueOrNA(selectedBooking.end_date)}</p>
                    <p><strong>Final Price:</strong> {getValueOrNA(selectedBooking.final_price)}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedBooking.status)}</p>
                    <p><strong>Payment Method:</strong> {getValueOrNA(selectedBooking.payment_method)}</p>
                    <p><strong>Additional Driver:</strong> {getValueOrNA(selectedBooking.additional_driver) ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Car Information</h3>
                    <p><strong>Model:</strong> {getValueOrNA(selectedBooking.car_model?.relationship?.["Model Names"]?.model_name)}</p>
                    <p><strong>Brand:</strong> {getValueOrNA(selectedBooking.car_model?.relationship?.Brand?.brand_name)}</p>
                    <p><strong>Year:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.year)}</p>
                    <p><strong>Plate Number:</strong> {getValueOrNA(selectedBooking.car?.plate_number)}</p>
                    <p><strong>Engine Type:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.engine_type)}</p>
                    <p><strong>Transmission:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.transmission_type)}</p>
                    <p><strong>Seats:</strong> {getValueOrNA(selectedBooking.car_model?.attributes?.seats_count)}</p>
                    <p><strong>Color:</strong> {getValueOrNA(selectedBooking.car?.color)}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  {activeTab === "new-bookings" && (
                    <>
                      {/* <button onClick={() => handleUpdateStatus(selectedBooking.id, "confirmed")} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                        {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "Confirm"}
                      </button> */}
                      {/* <button onClick={() => handleUpdateStatus(selectedBooking.id, "processing")} className="bg-yellow-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                        {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "Processing"}
                      </button> */}
                    </>
                  )}
                  <button onClick={() => handleUpdateStatus(selectedBooking.id, "completed")} className="bg-green-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                    {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "Complete"}
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedBooking.id, "canceled")} className="bg-yellow-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                    {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "Cancel"}
                  </button>
                  <button onClick={() => handleDeleteBooking(selectedBooking.id)} className="bg-red-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                    {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "Delete Booking"}
                  </button>
                  <button onClick={() => handleAssignCar(selectedBooking.id)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                    {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "Assign Car"}
                  </button>
                  <button onClick={() => setShowDriversModal(true)} className="bg-purple-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                    {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "View Drivers"}
                  </button>
                  <button onClick={() => { const carId = selectedBooking.car?.id || selectedBooking.car_model?.id; if (!carId) { toast.error("Car ID not found."); return; } handleChangeCarStatus(parseInt(carId)); }} className="bg-teal-500 text-white p-2 rounded flex items-center gap-2" disabled={loading}>
                    {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : "Available"}
                  </button>
                </div>
                {showDriversModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
                      <h3 className="text-xl font-bold mb-4">Drivers List</h3>
                      <button onClick={() => setShowDriversModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">X</button>
                      {drivers.length === 0 ? <p className="text-center text-gray-500">No drivers data available</p> : (
                        <table className="min-w-full text-left">
                          <thead><tr className="text-[#8B919E] bg-[#FAF7F2] text-xs font-bold"><th className="py-3 px-4">ID</th><th className="py-3 px-4">Name</th><th className="py-3 px-4">Email</th><th className="py-3 px-4">Phone</th></tr></thead>
                          <tbody>{drivers.map((driver) => <tr key={driver.id} className="border-b last:border-b-0"><td className="py-3 px-4">{driver.id}</td><td className="py-3 px-4">{driver.attributes.name}</td><td className="py-3 px-4">{driver.attributes.email}</td><td className="py-3 px-4">{driver.attributes.phone}</td></tr>)}</tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashboardOverview;
