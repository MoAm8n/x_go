import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TransmissionTypes = ["Manual", "Automatic", "Hydramatic", "CVT", "DCT"];
const EngineTypes = ["Gasoline", "Electric", "Hybrid", "Plug-in Hybrid"];
const SeatTypes = ["fabric", "leather", "accessible", "sport", "electric"];
const statusCars = ["available", "rented", "maintenance"];

export default function Model() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  const [existingModels, setExistingModels] = useState([]);
  const [modelsId, setModelsId] = useState(null);

  const [brandId, setBrandId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [modelNameId, setModelNameId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  const [newModel, setNewModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [engineType, setEngineType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [seatType, setSeatType] = useState("");
  const [seatsCount, setSeatsCount] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [showCarForm, setShowCarForm] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");
  const [status, setStatus] = useState("");
  const [carImage, setCarImage] = useState(null);
  const [carImagePreview, setCarImagePreview] = useState(null);
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Brands
  useEffect(() => {
    const token = localStorage.getItem("tokenAdman");
    if (!token) {
      toast.error(t("model.token_not_found"));
      return;
    }
    setIsLoading(true);
    axios
      .get(`${API_URL}/api/admin/Brands`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBrands(res.data.data);
        toast.success(t("model.brands_fetched"));
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
        toast.error(t("model.error_fetching_brands"));
      })
      .finally(() => setIsLoading(false));
  }, [t]);

  // Fetch Types
  useEffect(() => {
    if (brandId) {
      const token = localStorage.getItem("tokenAdman");
      if (!token) {
        toast.error(t("model.token_not_found"));
        return;
      }
      setIsLoading(true);
      axios
        .get(`${API_URL}/api/admin/Brands/${brandId}/Types`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTypes(res.data.data);
          toast.success(t("model.types_fetched"));
        })
        .catch((err) => {
          console.error("Error fetching types:", err);
          toast.error(t("model.error_fetching_types"));
        })
        .finally(() => setIsLoading(false));
    } else {
      setTypes([]);
      setTypeId("");
      setModelNames([]);
      setModelNameId("");
      setExistingModels([]);
      setSelectedModelId("");
      setShowCarForm(false);
    }
  }, [brandId, t]);

  // Fetch Model Names
  useEffect(() => {
    if (brandId && typeId) {
      const token = localStorage.getItem("tokenAdman");
      if (!token) {
        toast.error(t("model.token_not_found"));
        return;
      }
      setIsLoading(true);
      axios
        .get(`${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setModelNames(res.data.data);
          toast.success(t("model.models_fetched"));
        })
        .catch((err) => {
          console.error("Error fetching model names:", err);
          toast.error(t("model.error_fetching_models"));
        })
        .finally(() => setIsLoading(false));
    } else {
      setModelNames([]);
      setModelNameId("");
      setExistingModels([]);
      setSelectedModelId("");
      setShowCarForm(false);
    }
  }, [brandId, typeId, t]);

  // Fetch Existing Models
  useEffect(() => {
    if (brandId && typeId && modelNameId) {
      const token = localStorage.getItem("tokenAdman");
      if (!token) {
        toast.error(t("model.token_not_found"));
        return;
      }
      setIsLoading(true);
      axios
        .get(
          `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setExistingModels(res.data.data);
          toast.success(t("model.existing_models_fetched"));
        })
        .catch((err) => {
          console.error("Error fetching existing models:", err);
          toast.error(t("model.error_fetching_existing_models"));
        })
        .finally(() => setIsLoading(false));
    } else {
      setExistingModels([]);
      setSelectedModelId("");
      setShowCarForm(false);
    }
  }, [brandId, typeId, modelNameId, t]);

  // Populate fields when selecting an existing model
  useEffect(() => {
    if (selectedModelId) {
      const selectedModel = existingModels.find((model) => model.id === selectedModelId);
      if (selectedModel) {
        setModelsId(selectedModel.id);
        setShowCarForm(true);
      }
    } else {
      setModelsId(null);
      setShowCarForm(false);
    }
  }, [selectedModelId, existingModels]);

  // Add New Model Name
  const handleAddNew = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenAdman");
    if (!token) {
      toast.error(t("model.token_not_found"));
      return;
    }

    if (newModel && brandId && typeId) {
      setIsLoading(true);
      try {
        await axios.post(
          `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`,
          { name: newModel },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNewModel("");
        axios
          .get(
            `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            setModelNames(res.data.data);
            toast.success(t("model.model_added"));
          })
          .catch((err) => {
            console.error("Error refetching model names:", err);
            toast.error(t("model.error_refetching_models"));
          });
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || t("model.error_adding_model");
        console.error("Error adding new model:", err.response?.data);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning(t("model.fill_required_fields"));
    }
  };

  // Save Model Details
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenAdman");
    if (!token) {
      toast.error(t("model.token_not_found"));
      return;
    }

    if (!brandId || !typeId || !modelNameId) {
      toast.error(t("model.select_required_fields"));
      return;
    }
    if (
      !year ||
      !price ||
      !engineType ||
      !transmissionType ||
      !seatType ||
      !seatsCount ||
      !acceleration
    ) {
      toast.error(t("model.all_fields_required"));
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      toast.error(t("model.invalid_year"));
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      toast.error(t("model.invalid_price"));
      return;
    }
    if (!/^\d+$/.test(seatsCount) || parseInt(seatsCount) < 1) {
      toast.error(t("model.invalid_seats_count"));
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(acceleration) || parseFloat(acceleration) < 0) {
      toast.error(t("model.invalid_acceleration"));
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    const modelName =
      modelNames.find((m) => m.id === modelNameId)?.attributes?.name || newModel;
    if (modelName) formData.append("name", modelName);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("engine_type", engineType);
    formData.append("transmission_type", transmissionType);
    formData.append("seat_type", seatType);
    formData.append("seats_count", seatsCount);
    formData.append("acceleration", acceleration);
    if (image) formData.append("image", image);
    images.forEach((img) => formData.append("images", img));

    try {
      const response = await axios.post(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setModelsId(response.data.data.id);
      setYear("");
      setPrice("");
      setEngineType("");
      setTransmissionType("");
      setSeatType("");
      setSeatsCount("");
      setAcceleration("");
      setImage(null);
      setImages([]);
      setImagePreview(null);
      setImagesPreview([]);
      toast.success(t("model.model_details_updated"));
      setShowCarForm(true);
      // Refetch models
      axios
        .get(
          `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setExistingModels(res.data.data);
        });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || t("model.error_updating_model");
      console.error("API Error:", err.response?.data);
      toast.error(errorMsg);
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((errorArray) =>
          errorArray.forEach((msg) => toast.error(msg))
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save Car Details
  const handleSaveCarDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenAdman");
    if (!token) {
      toast.error(t("model.token_not_found"));
      return;
    }

    if (!plateNumber || !status || !color || !description || !capacity) {
      toast.error(t("model.all_car_fields_required"));
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("plate_number", plateNumber);
    formData.append("status", status);
    if (carImage) formData.append("image", carImage);
    formData.append("color", color);
    formData.append("Description", description);
    formData.append("Capacity", capacity);

    try {
      await axios.post(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models/${modelsId}/Cars`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPlateNumber("");
      setStatus("");
      setCarImage(null);
      setCarImagePreview(null);
      setColor("");
      setDescription("");
      setCapacity("");
      toast.success(t("model.car_details_saved"));
      // Keep showCarForm true to allow adding another car
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || t("model.error_saving_car");
      console.error("Car API Error:", err.response?.data);
      if (err.response?.data?.includes("Data truncated for column 'status'")) {
        toast.error(t("model.invalid_status"));
      } else if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((errorArray) =>
          errorArray.forEach((msg) => toast.error(msg))
        );
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Image Changes
  const handleCarImageChange = (e) => {
    const file = e.target.files[0];
    const maxSizeMB = 5;
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      toast.error(t("model.image_too_large", { maxSize: maxSizeMB }));
      return;
    }
    setCarImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success(t("model.car_image_selected"));
    } else {
      setCarImagePreview(null);
      toast.error(t("model.error_selecting_car_image"));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSizeMB = 5;
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      toast.error(t("model.image_too_large", { maxSize: maxSizeMB }));
      return;
    }
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success(t("model.image_selected"));
    } else {
      setImagePreview(null);
      toast.error(t("model.error_selecting_image"));
    }
  };

  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const maxImages = 5;
    const maxSizeMB = 5;
    if (newFiles.some((file) => file.size > maxSizeMB * 1024 * 1024)) {
      toast.error(t("model.image_too_large", { maxSize: maxSizeMB }));
      return;
    }
    if (images.length + newFiles.length > maxImages) {
      toast.error(t("model.max_images_exceeded", { max: maxImages }));
      return;
    }
    setImages((prevImages) => [...prevImages, ...newFiles]);
    const newPreviews = newFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
    });
    Promise.all(newPreviews).then((results) =>
      setImagesPreview((prevPreviews) => [...prevPreviews, ...results])
    );
    if (newFiles.length > 0) {
      toast.success(t("model.images_selected"));
    } else {
      toast.error(t("model.error_selecting_images"));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    toast.success(t("model.image_removed"));
  };

  const removeImageFromImages = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    setImagesPreview(newPreviews);
    toast.success(t("model.image_removed_from_images"));
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 rounded-xl">
      {/* Form for selecting brand, type, model name, and adding new model name */}
      <form
        onSubmit={handleAddNew}
        className="flex flex-col gap-3 bg-[#faf7f2] shadow rounded-xl p-6"
      >
        <h3 className="text-lg font-bold">{t("model.select_model")}</h3>
        <div>
          <label className="block mb-1">{t("model.choose_brand")}</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={brandId || ""}
            onChange={(e) => setBrandId(e.target.value)}
            disabled={isLoading}
          >
            <option value="" disabled>
              {t("model.select_brand")}
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.attributes.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">{t("model.choose_type")}</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={typeId || ""}
            onChange={(e) => setTypeId(e.target.value)}
            disabled={!brandId || isLoading}
          >
            <option value="" disabled>
              {t("model.select_type")}
            </option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.attributes?.name || type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">{t("model.choose_model_name")}</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 mb-3 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={modelNameId || ""}
            onChange={(e) => setModelNameId(e.target.value)}
            disabled={!typeId || isLoading}
          >
            <option value="" disabled>
              {t("model.select_model_name")}
            </option>
            {modelNames.map((model) => (
              <option key={model.id} value={model.id}>
                {model.attributes?.name || model.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            placeholder={t("model.new_model_placeholder")}
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
            disabled={isLoading}
          >
            {t("model.add_new_model_name")}
          </button>
        </div>

        <div>
          <label className="block mb-1">{t("model.select_existing_model")}</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={selectedModelId || ""}
            onChange={(e) => setSelectedModelId(e.target.value)}
            disabled={!modelNameId || isLoading}
          >
            <option value="" disabled>
              {t("model.select_model")}
            </option>
            {existingModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.attributes.name} ({model.attributes.year})
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Form for adding new model details */}
      {modelNameId && !selectedModelId && (
        <form
          onSubmit={handleSaveDetails}
          className="flex flex-col gap-3 mt-4 bg-[#faf7f2] shadow rounded-xl p-6"
        >
          <h3 className="text-lg font-bold">{t("model.new_model_details")}</h3>
          <div>
            <label className="block mb-1">{t("model.year")}</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder={t("model.year_placeholder")}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-1">{t("model.price")}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t("model.price_placeholder")}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-1">{t("model.engine_type")}</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={engineType}
              onChange={(e) => setEngineType(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                {t("model.select_engine_type")}
              </option>
              {EngineTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`model.engine_types.${type.toLowerCase().replace(" ", "_")}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">{t("model.transmission_type")}</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={transmissionType}
              onChange={(e) => setTransmissionType(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                {t("model.select_transmission_type")}
              </option>
              {TransmissionTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`model.transmission_types.${type.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">{t("model.seat_type")}</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                {t("model.select_seat_type")}
              </option>
              {SeatTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`model.seat_types.${type.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">{t("model.seats_count")}</label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={seatsCount}
              onChange={(e) => setSeatsCount(e.target.value)}
              placeholder={t("model.seats_count_placeholder")}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-1">{t("model.acceleration")}</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={acceleration}
              onChange={(e) => setAcceleration(e.target.value)}
              placeholder={t("model.acceleration_placeholder")}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium">{t("model.image")}</label>
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
              <input
                type="file"
                className="hidden bg-[#FAF7F2] border border-[#E6911E]"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={t("model.image_preview")}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-3xl text-gray-400">&#8682;</span>
              )}
            </label>
            {imagePreview && (
              <button
                type="button"
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded-xl"
                onClick={removeImage}
                disabled={isLoading}
              >
                {t("model.remove_image")}
              </button>
            )}
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium">{t("model.images")}</label>
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
              <input
                type="file"
                className="hidden bg-[#FAF7F2] border border-[#E6911E]"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                disabled={isLoading}
              />
              {imagesPreview.length > 0 ? (
                <img
                  src={imagesPreview[0]}
                  alt={t("model.images_preview")}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-3xl text-gray-400">&#8682;</span>
              )}
            </label>
            {imagesPreview.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagesPreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`${t("model.images_preview")} ${index}`}
                      className="max-w-[150px] max-h-[150px] object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 left-1 bg-red-500 text-white px-2 py-1 rounded-xl"
                      onClick={() => removeImageFromImages(index)}
                      disabled={isLoading}
                    >
                      {t("model.remove_image")}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-600">{t("model.images_instruction")}</p>
          </div>
          <button
            type="submit"
            className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
            disabled={isLoading}
          >
            {isLoading ? t("model.saving") : t("model.save_details")}
          </button>
        </form>
      )}

      {/* Form for adding car details */}
      {showCarForm && (
        <form
          onSubmit={handleSaveCarDetails}
          className="flex flex-col gap-3 mt-4 bg-[#faf7f2] shadow rounded-xl p-6"
        >
          <h3 className="text-lg font-bold">{t("model.car_details")}</h3>
          <div>
            <label className="block mb-1">{t("model.plate_number")}</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder={t("model.plate_number_placeholder")}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-1">{t("model.status")}</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                {t("model.select_status")}
              </option>
              {statusCars.map((statusCar) => (
                <option key={statusCar} value={statusCar}>
                  {t(`model.status_types.${statusCar}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium">{t("model.car_image")}</label>
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
              <input
                type="file"
                className="hidden bg-[#FAF7F2] border border-[#E6911E]"
                accept="image/*"
                onChange={handleCarImageChange}
                disabled={isLoading}
              />
              {carImagePreview ? (
                <img
                  src={carImagePreview}
                  alt={t("model.car_image_preview")}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-3xl text-gray-400">&#8682;</span>
              )}
            </label>
            {carImagePreview && (
              <button
                type="button"
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded-xl"
                onClick={() => {
                  setCarImage(null);
                  setCarImagePreview(null);
                  toast.success(t("model.car_image_removed"));
                }}
                disabled={isLoading}
              >
                {t("model.remove_image")}
              </button>
            )}
          </div>
          <div>
            <label className="block mb-1">{t("model.color")}</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder={t("model.color_placeholder")}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-1">{t("model.description")}</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("model.description_placeholder")}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-1">{t("model.capacity")}</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder={t("model.capacity_placeholder")}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
            disabled={isLoading}
          >
            {isLoading ? t("model.saving") : t("model.save_car_details")}
          </button>
        </form>
      )}
    </div>
  );
}
