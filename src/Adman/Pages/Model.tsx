import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";

export default function Model() {
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [models, setModels] = useState([]);

  const [brandId, setBrandId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [modelId, setModelId] = useState("");

  const [newBrand, setNewBrand] = useState("");
  const [newType, setNewType] = useState("");
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
  const [images2, setImages2] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images2Preview, setImages2Preview] = useState([]);

  // State for car details form
  const [showCarForm, setShowCarForm] = useState(true);
  const [plateNumber, setPlateNumber] = useState("");
  const [status, setStatus] = useState("");
  const [carImage, setCarImage] = useState(null);
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");

  const TransmissionTypes = ["Manual", "Automatic", "Hydramatic", "CVT", "DCT"];
  const EngineTypes = ["Gasoline", "Electric", "Hybrid", "Plug-in Hybrid"];
  const SeatTypes = ["fabric", "leather", "accessible", "sport", "electric"];
  const statusCars = ["available", "rented", "maintenance"];
  // Fetch brands on component mount
  useEffect(() => {
    const token = localStorage.getItem("tokenAdman");
    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }
    axios
      .get(`${API_URL}/api/admin/Brands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBrands(res.data.data);
        console.log("Brands:", res.data.data);
        toast.success("Brands fetched successfully");
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
        toast.error("Failed to fetch brands");
      });
  }, []);

  // Fetch types when brandId changes
  useEffect(() => {
    if (brandId) {
      const token = localStorage.getItem("tokenAdman");
      if (!token) {
        toast.error("Token not found. Please log in.");
        return;
      }
      axios
        .get(`${API_URL}/api/admin/Brands/${brandId}/Types`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTypes(res.data.data);
          console.log("Types:", res.data.data);
          toast.success("Types fetched successfully");
        })
        .catch((err) => {
          console.error("Error fetching types:", err);
          toast.error("Failed to fetch types");
        });
    } else {
      setTypes([]);
      setTypeId("");
    }
  }, [brandId]);

  // Fetch model names when brandId or typeId changes
  useEffect(() => {
    if (brandId && typeId) {
      const token = localStorage.getItem("tokenAdman");
      if (!token) {
        toast.error("Token not found. Please log in.");
        return;
      }
      axios
        .get(
          `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setModels(res.data.data);
          console.log("Model Names:", res.data.data);
          toast.success("Models fetched successfully");
        })
        .catch((err) => {
          console.error("Error fetching model names:", err);
          toast.error("Failed to fetch models");
        });
    } else {
      setModels([]);
      setModelId("");
    }
  }, [brandId, typeId]);

  // Handle adding new model
  const handleAddNew = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenAdman");

    if (newModel && brandId && typeId) {
      try {
        await axios.post(
          `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`,
          { name: newModel },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNewModel("");
        axios
          .get(
            `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setModels(res.data.data);
            console.log("Updated Model Names:", res.data.data);
            toast.success("New model added successfully");
          })
          .catch((err) => {
            console.error("Error refetching model names:", err);
            toast.error("Failed to refresh models");
          });
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || err.message || "An error occurred";
        console.error("Error adding new model:", err.response?.data);
        toast.error(errorMsg);
      }
    } else {
      toast.warning("Please fill all required fields to add a new model");
    }
  };

  // Handle saving model details
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenAdman");
    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    if (!brandId || !typeId || !modelId) {
      toast.error("Please select a brand, type, and model.");
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
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    const modelName =
      models.find((m) => m.id === modelId)?.attributes?.name || newModel;
    if (modelName) formData.append("name", modelName);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("engine_type", engineType);
    formData.append("transmission_type", transmissionType);
    formData.append("seat_type", seatType);
    formData.append("seats_count", seatsCount);
    formData.append("acceleration", acceleration);
    if (image) formData.append("image", image);
    images.forEach((img, index) => formData.append(`images[]`, img));
    images2.forEach((img, index) => formData.append(`images2[]`, img));

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelId}/Models`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("API Response:", response.data);
      setYear("");
      setPrice("");
      setEngineType("");
      setTransmissionType("");
      setSeatType("");
      setSeatsCount("");
      setAcceleration("");
      setImage(null);
      setImages([]);
      setImages2([]);
      setImagePreview(null);
      setImagesPreview([]);
      setImages2Preview([]);
      toast.success("Model details updated successfully");
      setShowCarForm(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "An error occurred";
      console.error("API Error:", err.response?.data);
      toast.error(errorMsg);
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((errorArray) =>
          errorArray.forEach((msg) => toast.error(msg))
        );
      }
    }
  };

  // Handle saving car details
  const handleSaveCarDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenAdman");
    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    if (!plateNumber || !status || !color || !description || !capacity) {
      toast.error("All fields are required for car details.");
      return;
    }

    const formData = new FormData();
    formData.append("plate_number", plateNumber);
    formData.append("status", status);
    if (carImage) formData.append("image", carImage);
    formData.append("color", color);
    formData.append("Description", description);
    formData.append("Capacity", capacity);

    try {
      const response = await axios.post(
        `${API_URL}/api/admin/Brands/1/Types/1/Model-Names/1/Models/1/Cars`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Car API Response:", response.data);
      setPlateNumber("");
      setStatus("");
      setCarImage(null);
      setColor("");
      setDescription("");
      setCapacity("");
      toast.success("Car details saved successfully");
      setShowCarForm(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while saving car details";
      console.error("Car API Error:", err.response?.data);
      if (err.response?.data?.includes("Data truncated for column 'status'")) {
        toast.error(
          "Error: The 'status' value is invalid or too long. Please use a valid value (e.g., 'available' or 'unavailable')."
        );
      } else if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((errorArray) =>
          errorArray.forEach((msg) => toast.error(msg))
        );
      } else {
        toast.error(errorMsg);
      }
    }
  };

  // Handle image change for car
  const handleCarImageChange = (e) => {
    const file = e.target.files[0];
    setCarImage(file);
    if (file) {
      toast.success("Car image selected successfully");
    } else {
      toast.error("Failed to select car image");
    }
  };

  // Existing image handling functions remain unchanged
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Image selected successfully");
    } else {
      setImagePreview(null);
      toast.error("Failed to select image");
    }
  };

  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
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
      toast.success("Images selected successfully");
    } else {
      toast.error("Failed to select images");
    }
  };

  const handleImages2Change = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages2((prevImages2) => [...prevImages2, ...newFiles]);
    const newPreviews = newFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
    });
    Promise.all(newPreviews).then((results) =>
      setImages2Preview((prevPreviews2) => [...prevPreviews2, ...results])
    );
    if (newFiles.length > 0) {
      toast.success("Images2 selected successfully");
    } else {
      toast.error("Failed to select images2");
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    toast.success("Image removed successfully");
  };

  const removeImageFromImages = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    setImagesPreview(newPreviews);
    toast.success("Image removed from images successfully");
  };

  const removeImageFromImages2 = (index) => {
    const newImages2 = images2.filter((_, i) => i !== index);
    setImages2(newImages2);
    const newPreviews2 = images2Preview.filter((_, i) => i !== index);
    setImages2Preview(newPreviews2);
    toast.success("Image removed from images2 successfully");
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 rounded-xl">
      {/* First Form: Select Brand, Type, and Model */}
      <form
        onSubmit={handleAddNew}
        className="flex flex-col gap-3 bg-[#faf7f2] shadow rounded-xl p-6"
      >
        <div>
          <label className="block mb-1">Choose Brand</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={brandId || ""}
            onChange={(e) => setBrandId(e.target.value)}
          >
            <option value="" disabled>
              -- اختر برند --
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.attributes.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Choose Type</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={typeId || ""}
            onChange={(e) => setTypeId(e.target.value)}
            disabled={!brandId}
          >
            <option value="" disabled>
              -- اختر النوع --
            </option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.attributes?.name || type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Choose Model</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 mb-3 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={modelId || ""}
            onChange={(e) => setModelId(e.target.value)}
            disabled={!typeId}
          >
            <option value="" disabled>
              -- اختر موديل --
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.attributes?.name || model.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            placeholder="أو أدخل موديل جديد"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
        >
          حفظ أو إضافة جديد
        </button>
      </form>

      {/* Second Form: Model Details */}
      <form
        onSubmit={handleSaveDetails}
        className="flex flex-col gap-3 mt-4 bg-[#faf7f2] shadow rounded-xl p-6"
      >
        <h3 className="text-lg font-bold">تفاصيل الموديل</h3>
        <div>
          <label className="block mb-1">السنة (Year)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="مثال: 2024"
          />
        </div>
        <div>
          <label className="block mb-1">السعر (Price)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثال: 1000"
          />
        </div>
        <div>
          <label className="block mb-1">نوع المحرك (Engine Type)</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={engineType}
            onChange={(e) => setEngineType(e.target.value)}
          >
            <option value="" disabled>
              -- اختر نوع المحرك --
            </option>
            {EngineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">
            نوع الترانسيمشن (Transmission Type)
          </label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={transmissionType}
            onChange={(e) => setTransmissionType(e.target.value)}
          >
            <option value="" disabled>
              -- اختر نوع الترانسيمشن --
            </option>
            {TransmissionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">نوع المقاعد (Seat Type)</label>
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={seatType}
            onChange={(e) => setSeatType(e.target.value)}
          >
            <option value="" disabled>
              -- اختر نوع المقاعد --
            </option>
            {SeatTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">عدد المقاعد (Seats Count)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={seatsCount}
            onChange={(e) => setSeatsCount(e.target.value)}
            placeholder="مثال: 4"
          />
        </div>
        <div>
          <label className="block mb-1">التسارع (Acceleration)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            value={acceleration}
            onChange={(e) => setAcceleration(e.target.value)}
            placeholder="مثال: 3.1"
          />
        </div>
        <div>
          <label className="block mb-1">صورة واحدة (Image)</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-[200px] max-h-[200px] object-cover rounded-xl border"
              />
              <button
                type="button"
                className="absolute top-1 left-1 bg-red-500 text-white px-2 py-2 rounded-xl"
                onClick={removeImage}
              >
                x
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1">مجموعة صور الأولى (images[])</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />
          {imagesPreview.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {imagesPreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="max-w-[150px] max-h-[150px] object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    className="absolute top-1 left-1 bg-red-500 text-white px-2 py-2 rounded-xl"
                    onClick={() => removeImageFromImages(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-600">يمكنك اختيار أي عدد من الصور.</p>
        </div>
        <button
          type="submit"
          className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
          disabled={!brandId || !typeId || !modelId}
        >
          حفظ التفاصيل
        </button>
      </form>

      {/* Car Details Form */}
      {showCarForm && (
        <form
          onSubmit={handleSaveCarDetails}
          className="flex flex-col gap-3 mt-4 bg-[#faf7f2] shadow rounded-xl p-6"
        >
          <h3 className="text-lg font-bold">تفاصيل السيارة</h3>
          <div>
            <label className="block mb-1">رقم اللوحة (Plate Number)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="مثال: 4693"
            />
          </div>
          <div>
            <label className="block mb-1">الحالة (Status)</label>
            {/* <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="مثال: available"
            /> */}
            {/* <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>
                {statusCars.map((statusCar) => (
                  <option key={statusCar} value={statusCar}>
                    {statusCar}
                  </option>
                ))}
              </option>
            </select> */}
          <select
        className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="" disabled>
          -- اختر الحالة --
        </option>
        {statusCars.map((statusCar) => (
          <option key={statusCar} value={statusCar}>
            {statusCar}
          </option>
        ))}
      </select>
          </div>
          <div>
            <label className="block mb-1">الصورة (Image)</label>
            <input
              type="file"
              className="w-full p-2 border rounded"
              onChange={handleCarImageChange}
            />
          </div>
          <div>
            <label className="block mb-1">اللون (Color)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="مثال: silver"
            />
          </div>
          <div>
            <label className="block mb-1">الوصف (Description)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: 33"
            />
          </div>
          <div>
            <label className="block mb-1">السعة (Capacity)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="مثال: 322"
            />
          </div>
          <button
            type="submit"
            className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
          >
            حفظ تفاصيل السيارة
          </button>
        </form>
      )}
    </div>
  );
}
