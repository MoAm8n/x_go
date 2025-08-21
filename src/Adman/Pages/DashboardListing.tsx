import React, { useEffect, useState } from "react";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import DashboardListCars from "./DashboardListCars";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full text-center text-lg">
        <h2 className="text-lg font-bold mb-4">
          {t("dashboard_listing.confirm_delete")}
        </h2>
        <p className="mb-6">{t("dashboard_listing.delete_confirmation")}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {t("buttons.confirm")}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {t("buttons.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, car, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    year: car?.attributes.year || "",
    price: car?.attributes.price || "",
    engine_type: car?.attributes.engine_type || "",
    transmission_type: car?.attributes.transmission_type || "",
    seat_type: car?.attributes.seat_type || "",
    seats_count: car?.attributes.seats_count || "",
    acceleration: car?.attributes.acceleration || "",
    image: car?.attributes.image || null,
    images: car?.attributes.images || [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (name === "images[]") {
      setFormData((prev) => ({ ...prev, images: [...files] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("tokenAdman");
      const brandId = car.relationships?.brand?.brand_id;
      const typeId = car.relationships?.types?.type_id;
      const modelNameId = car.relationships.model_names.model_name_id;
      const model = car.id;

      const data = new FormData();
      data.append("year", formData.year);
      data.append("price", formData.price);
      data.append("engine_type", formData.engine_type);
      data.append("transmission_type", formData.transmission_type);
      data.append("seat_type", formData.seat_type);
      data.append("seats_count", formData.seats_count);
      data.append("acceleration", formData.acceleration);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => {
          data.append("images[]", img);
        });
      }

      const response = await axios.post(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models/${model}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const successMessage =
        response.data.data?.message ||
        t("dashboard_listing.success_updating_model");
      toast.success(successMessage);
      onSave();
    } catch (error) {
      console.error(
        "Error updating model:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        t("dashboard_listing.error_updating_model");
      toast.error(errorMessage);
    }
  };

  const TransmissionTypes = ["Manual", "Automatic", "Hydramatic", "CVT", "DCT"];
  const EngineTypes = ["Gasoline", "Electric", "Hybrid", "Plug-in Hybrid"];
  const SeatTypes = ["fabric", "leather", "accessible", "sport", "electric"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full text-center max-h-[90%] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          {t("dashboard_listing.model_details")}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 mt-4 shadow rounded-xl p-6"
        >
          <div>
            <label className="block mb-1">{t("dashboard_listing.year")}</label>
            <input
              type="text"
              name="year"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={formData.year}
              onChange={handleChange}
              placeholder={t("dashboard_listing.year_placeholder")}
            />
          </div>
          <div>
            <label className="block mb-1">{t("dashboard_listing.price")}</label>
            <input
              type="text"
              name="price"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={formData.price}
              onChange={handleChange}
              placeholder={t("dashboard_listing.price_placeholder")}
            />
          </div>
          <div>
            <label className="block mb-1">
              {t("dashboard_listing.engine_type")}
            </label>
            <select
              name="engine_type"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={formData.engine_type}
              onChange={handleChange}
            >
              <option value="" disabled>
                {t("dashboard_listing.select_engine_type")}
              </option>
              {EngineTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`dashboard_listing.engine_types.${type.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">
              {t("dashboard_listing.transmission_type")}
            </label>
            <select
              name="transmission_type"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={formData.transmission_type}
              onChange={handleChange}
            >
              <option value="" disabled>
                {t("dashboard_listing.select_transmission_type")}
              </option>
              {TransmissionTypes.map((type) => (
                <option key={type} value={type}>
                  {t(
                    `dashboard_listing.transmission_types.${type.toLowerCase()}`
                  )}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">
              {t("dashboard_listing.seat_type")}
            </label>
            <select
              name="seat_type"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={formData.seat_type}
              onChange={handleChange}
            >
              <option value="" disabled>
                {t("dashboard_listing.select_seat_type")}
              </option>
              {SeatTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`dashboard_listing.seat_types.${type.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">
              {t("dashboard_listing.seats_count")}
            </label>
            <input
              type="text"
              name="seats_count"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={formData.seats_count}
              onChange={handleChange}
              placeholder={t("dashboard_listing.seats_count_placeholder")}
            />
          </div>
          <div>
            <label className="block mb-1">
              {t("dashboard_listing.acceleration")}
            </label>
            <input
              type="text"
              name="acceleration"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={formData.acceleration}
              onChange={handleChange}
              placeholder={t("dashboard_listing.acceleration_placeholder")}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium">
              {t("dashboard_listing.image")}
            </label>
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden bg-[#FAF7F2] border border-[#E6911E]"
                onChange={handleChange}
              />
              {formData.image ? (
                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image
                  }
                  alt="Car Image"
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-3xl text-gray-400">&#8682;</span>
              )}
            </label>
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium">
              {t("dashboard_listing.additional_images")}
            </label>
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
              <input
                type="file"
                name="images[]"
                accept="image/*"
                multiple
                className="hidden bg-[#FAF7F2] border border-[#E6911E]"
                onChange={handleChange}
              />
              {formData.images.length > 0 ? (
                <img
                  src={URL.createObjectURL(formData.images[0])}
                  alt="Additional Image"
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-3xl text-gray-400">&#8682;</span>
              )}
            </label>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-[#E6911E] text-white rounded-xl py-2 px-4"
            >
              {t("dashboard_listing.save_model_details")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {t("buttons.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DashboardListing() {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    car: null,
  });
  const [editModal, setEditModal] = useState({ isOpen: false, car: null });
  const [view, setView] = useState("model");

  const navigate = useNavigate();

  const fetchCars = async (pageNum) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/Home?page=${pageNum}`);
      setCars(res.data.data);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error(t("dashboard_listing.error_fetching_cars"));
    }
  };

  const handleDelete = async (car) => {
    setConfirmModal({ isOpen: true, car });
  };

  const confirmDelete = async () => {
    const car = confirmModal.car;
    if (!car) return;

    try {
      const brandId = car.relationships?.brand?.brand_id;
      const typeId = car.relationships?.types?.type_id;
      const modelNameId = car.relationships.model_names.model_name_id;
      const modelId = car.id;

      const token = localStorage.getItem("tokenAdman");
      if (!token) {
        toast.error(t("toast.token_not_found"));
        setConfirmModal({ isOpen: false, car: null });
        return;
      }

      await axios.delete(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models/${modelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCars(cars.filter((c) => c.id !== modelId));
      toast.success(t("dashboard_listing.success_deleting_model"));
    } catch (error) {
      console.error("Error deleting model:", error);
      if (error.response?.status === 401) {
        toast.error(t("dashboard_listing.error_unauthorized"));
      } else {
        toast.error(
          error.response?.data?.message ||
            t("dashboard_listing.error_deleting_model")
        );
      }
    } finally {
      setConfirmModal({ isOpen: false, car: null });
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, car: null });
  };

  const handleEdit = (car) => {
    setEditModal({ isOpen: true, car });
  };

  const handleSaveEdit = () => {
    setEditModal({ isOpen: false, car: null });
    fetchCars(page);
  };

  useEffect(() => {
    fetchCars(page);
  }, [page]);

  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex justify-center gap-4 px-10 pt-6 w-full">
          <div className="border border-[#E6911E] rounded-xl flex flex-col sm:flex-row overflow-hidden w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <button
              onClick={() => setView("model")}
              className={`px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-1/2 font-medium text-xs sm:text-sm transition-all ${
                view === "model"
                  ? "bg-[#E6911E] text-white"
                  : "bg-[#FAF7F2] text-[#E6911E]"
              }`}
            >
              {t("dashboard.model")}
            </button>
            <button
              onClick={() => setView("car")}
              className={`px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-1/2 font-medium text-xs sm:text-sm transition-all border-t sm:border-t-0 border-[#E6911E] ${
                view === "car"
                  ? "bg-[#E6911E] text-white"
                  : "bg-[#FAF7F2] text-[#E6911E]"
              }`}
            >
              {t("dashboard.car")}
            </button>
          </div>
        </div>
        <div className="flex-1 px-2 md:px-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-10 w-full">
          {view === "model" && (
            <>
              {cars.length > 0 ? (
                cars.map((car) => (
                  <div
                    key={car.id}
                    className="rounded-xl shadow-sm transition-shadow cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={car.attributes.image || "/placeholder-car.jpg"}
                      alt="car"
                      className="w-full h-44 md:h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 border border-[#000000] rounded-b-xl">
                      <div className="flex justify-between mb-2 max-md:flex-col">
                        <h3 className="font-bold text-lg">
                          {car.attributes.brand} {car.attributes.model_name}
                        </h3>
                        <p className="text-lg">
                          ${car.attributes.price}/
                          <span className="text-sm text-gray-600">
                            {t("dashboard_listing.day")}
                          </span>
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-gray-500 text-sm">
                        <span className="flex items-center">
                          {car.relationships.types.type_name}
                        </span>
                        <span className="flex items-center">
                          {car.attributes.year}
                        </span>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleEdit(car)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(car)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {t("dashboard_listing.no_cars_available")}
                </div>
              )}
            </>
          )}
        </div>
        {view === "car" && <DashboardListCars />}
        <div className="flex justify-center gap-4 py-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gradient-to-r from-[#f4a825] to-[#fdc77a] text-white rounded w-[100px]"
          >
            {t("dashboard_listing.previous")}
          </button>
          <button
            disabled={page >= lastPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gradient-to-r from-[#f4a825] to-[#fdc77a] text-white rounded w-[100px]"
          >
            {t("dashboard_listing.next")}
          </button>
        </div>
        <EditModal
          isOpen={editModal.isOpen}
          car={editModal.car}
          onClose={() => setEditModal({ isOpen: false, car: null })}
          onSave={handleSaveEdit}
        />
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
        <ToastContainer />
      </div>
    </div>
  );
}
