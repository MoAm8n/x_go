import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { Pencil, Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#faf7f2] p-6 rounded-lg max-w-md w-full text-center text-lg">
        <h2 className="text-lg font-bold mb-4">{t("dashboard_list_cars.confirm_delete")}</h2>
        <p className="mb-6">{t("dashboard_list_cars.delete_confirmation")}</p>
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

const EditCarModal = ({ isOpen, car, model, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    capacity: car?.capacity || "",
    description: car?.description || "",
    color: car?.color || "",
    plate_number: car?.plate_number || "",
    status: car?.status || "available",
    image: null,
  });

  useEffect(() => {
    setFormData({
      capacity: car?.capacity || "",
      description: car?.description || "",
      color: car?.color || "",
      plate_number: car?.plate_number || "",
      status: car?.status || "available",
      image: null,
    });
  }, [car]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("tokenAdman");
      const data = new FormData();
      data.append("capacity", formData.capacity);
      data.append("description", formData.description);
      data.append("color", formData.color);
      data.append("plate_number", formData.plate_number);
      data.append("status", formData.status);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const brandId = model?.relationships?.brand?.brand_id;
      const typeId = model?.relationships?.types?.type_id;
      const modelNameId = model?.relationships?.model_names?.model_name_id;
      const modelId = model?.id;
      const carId = car?.id;

      const url = `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models/${modelId}/Cars/${carId}`;

      await axios.post(
        url,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(t("dashboard_list_cars.success_updating_car"));
      onSave();
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error(t("dashboard_list_cars.error_updating_car"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#faf7f2] p-6 rounded-lg max-w-md w-full text-center max-h-[90%] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">{t("dashboard_list_cars.edit_car_details")}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 shadow rounded-xl p-6">
          <div>
            <label className="block mb-1">{t("dashboard_list_cars.plate_number")}</label>
            <input
              type="text"
              name="plate_number"
              value={formData.plate_number}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              required
            />
          </div>
          <div>
            <label className="block mb-1">{t("dashboard_list_cars.status")}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              required
            >
              <option value="available">{t("dashboard_list_cars.status_available")}</option>
              <option value="unavailable">{t("dashboard_list_cars.status_unavailable")}</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">{t("dashboard_list_cars.color")}</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              required
            />
          </div>
          <div>
            <label className="block mb-1">{t("dashboard_list_cars.capacity")}</label>
            <input
              type="text"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              required
            />
          </div>
          <div>
            <label className="block mb-1">{t("dashboard_list_cars.description")}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium">{t("dashboard_list_cars.image")}</label>
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
                  src={formData.image instanceof File ? URL.createObjectURL(formData.image) : car.image}
                  alt="Car Image"
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
              {t("dashboard_list_cars.save_changes")}
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

export default function DashboardListCars() {
  const { t } = useTranslation();
  const [models, setModels] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, car: null, modelIndex: null });
  const [editModal, setEditModal] = useState({ isOpen: false, car: null, model: null, modelIndex: null });

  useEffect(() => {
    axios
      .post(`${API_URL}/api/user/Home`, {}, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        setModels(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error(t("dashboard_list_cars.error_fetching_cars"));
      });
  }, [t]);

  const handleDelete = (car, modelIndex) => {
    setConfirmModal({ isOpen: true, car, modelIndex });
  };

  const confirmDelete = async () => {
    const { car, modelIndex } = confirmModal;
    if (!car) return;

    try {
      const token = localStorage.getItem("tokenAdman");
      const model = models[modelIndex];
      const brandId = model?.relationships?.brand?.brand_id;
      const typeId = model?.relationships?.types?.type_id;
      const modelNameId = model?.relationships?.model_names?.model_name_id;
      const modelId = model?.id;
      const carId = car?.id;

      const url = `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models/${modelId}/Cars/${carId}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedModels = [...models];
      updatedModels[modelIndex].relationships.cars = updatedModels[modelIndex].relationships.cars.filter(
        (c) => c.id !== car.id
      );
      setModels(updatedModels);
      toast.success(t("dashboard_list_cars.success_deleting_car"));
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error(t("dashboard_list_cars.error_deleting_car"));
    } finally {
      setConfirmModal({ isOpen: false, car: null, modelIndex: null });
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, car: null, modelIndex: null });
  };

  const handleEdit = (car, modelIndex) => {
    const model = models[modelIndex];
    setEditModal({ isOpen: true, car, model, modelIndex });
  };

  const handleSaveEdit = (modelIndex) => {
    setEditModal({ isOpen: false, car: null, model: null, modelIndex: null });
    axios
      .post(`${API_URL}/api/user/Home`, {}, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        setModels(response.data.data);
      })
      .catch((error) => {
        console.error("Error refreshing data:", error);
        toast.error(t("dashboard_list_cars.error_fetching_cars"));
      });
  };

  return (
    <div className="p-5 w-full bg-[#fdf9f2]">
      <div className="px-10">
        {models.map((model, index) => (
          <div key={index} className="mb-10 py-6 border-b border-gray-200 last:border-b-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">
              {model?.attributes?.model_name || t("dashboard_list_cars.unnamed_model")}
            </h2>
            <div className="flex flex-wrap justify-start items-center gap-4 text-gray-600 text-sm font-medium mb-6">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#E6911E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>{t("dashboard_list_cars.acceleration")}: {model.attributes.acceleration}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#E6911E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{t("dashboard_list_cars.seat_type")}: {model.attributes.seat_type}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#E6911E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a2 2 0 00-2-2h-3m-2 4H7a2 2 0 01-2-2v-2m12-4V8a2 2 0 00-2-2H7a2 2 0 00-2 2v4m14 0H5"
                  />
                </svg>
                <span>{t("dashboard_list_cars.seats_count")}: {model.attributes.seats_count}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {model?.relationships?.cars?.map((car, carIndex) => (
                <div
                  key={carIndex}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={car.image}
                    alt={t("dashboard_list_cars.car")}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>{t("dashboard_list_cars.color")}:</strong> {car.color}
                    </p>
                    <p>
                      <strong>{t("dashboard_list_cars.plate_number")}:</strong> {car.plate_number}
                    </p>
                    <p>
                      <strong>{t("dashboard_list_cars.status")}:</strong> {t(`dashboard_list_cars.status_${car.status}`)}
                    </p>
                    <p>
                      <strong>{t("dashboard_list_cars.capacity")}:</strong> {car.capacity}
                    </p>
                    <p>
                      <strong>{t("dashboard_list_cars.description")}:</strong> {car.description}
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(car, index)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                    >
                      <Pencil size={16} /> {t("dashboard_list_cars.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(car, index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                    >
                      <Trash size={16} /> {t("dashboard_list_cars.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {editModal.modelIndex === index && (
              <EditCarModal
                isOpen={editModal.isOpen}
                car={editModal.car}
                model={editModal.model}
                onClose={() => setEditModal({ isOpen: false, car: null, model: null, modelIndex: null })}
                onSave={() => handleSaveEdit(index)}
              />
            )}
          </div>
        ))}
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <ToastContainer />
    </div>
  );
}