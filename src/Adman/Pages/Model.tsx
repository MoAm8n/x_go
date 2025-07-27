import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { Select, MenuItem } from "@mui/material";
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
  const [image, setImage] = useState(null); // Single image file
  const [images, setImages] = useState([]); // Multiple images files (first group)
  const [images2, setImages2] = useState([]); // Multiple images files (second group)
  const [imagePreview, setImagePreview] = useState(null); // Preview URL for single image
  const [imagesPreview, setImagesPreview] = useState([]); // Preview URLs for first group
  const [images2Preview, setImages2Preview] = useState([]); // Preview URLs for second group

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
      })
      .catch((err) => console.error("Error fetching brands:", err));
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
        })
        .catch((err) => console.error("Error fetching types:", err));
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
        .get(`${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setModels(res.data.data);
          console.log("Model Names:", res.data.data);
        })
        .catch((err) => console.error("Error fetching model names:", err));
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
          .get(`${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setModels(res.data.data);
            console.log("Updated Model Names:", res.data.data);
          })
          .catch((err) => console.error("Error refetching model names:", err));
      } catch (err) {
        console.error("Error adding new model:", err);
      }
    } else {
      console.log("Selected:", { brandId, typeId, modelId });
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

    // Validation for other fields
    if (!brandId || !typeId || !modelId) {
      toast.error("Please select a brand, type, and model.");
      return;
    }
    if (!year || !price || !engineType || !transmissionType || !seatType || !seatsCount || !acceleration) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    // Add name field based on selected model
    const modelName = models.find(m => m.id === modelId)?.attributes?.name || newModel;
    if (modelName) formData.append("name", modelName);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("engine_type", engineType);
    formData.append("transmission_type", transmissionType);
    formData.append("seat_type", seatType);
    formData.append("seats_count", seatsCount);
    formData.append("acceleration", acceleration);
    if (image) formData.append("image", image); // Single image
    images.forEach((img, index) => formData.append(`images[]`, img)); // First group of multiple images
    images2.forEach((img, index) => formData.append(`images2[]`, img)); // Second group of multiple images
    // Log formData for debugging
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
      console.log("API Response:", response.data); // Log the response
      // Clear form fields and previews after successful save
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
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "An error occurred";
      console.error("API Error:", err.response?.data); // Log full error
      toast.error(errorMsg);
      // Display detailed errors if available
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((errorArray) => {
          errorArray.forEach((msg) => toast.error(msg));
        });
      }
    }
  };

  // Handle single image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Handle first group of multiple images preview
  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...newFiles]);
    const newPreviews = newFiles.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise(resolve => {
        reader.onloadend = () => resolve(reader.result);
      });
    });
    Promise.all(newPreviews).then(results => setImagesPreview(prevPreviews => [...prevPreviews, ...results]));
  };

  // Handle second group of multiple images preview
  const handleImages2Change = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages2(prevImages2 => [...prevImages2, ...newFiles]);
    const newPreviews = newFiles.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise(resolve => {
        reader.onloadend = () => resolve(reader.result);
      });
    });
    Promise.all(newPreviews).then(results => setImages2Preview(prevPreviews2 => [...prevPreviews2, ...results]));
  };

  // Remove single image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Remove specific image from first group
  const removeImageFromImages = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    setImagesPreview(newPreviews);
  };

  // Remove specific image from second group
  const removeImageFromImages2 = (index) => {
    const newImages2 = images2.filter((_, i) => i !== index);
    setImages2(newImages2);
    const newPreviews2 = images2Preview.filter((_, i) => i !== index);
    setImages2Preview(newPreviews2);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto bg-[#faf7f2] p-4 rounded-xl shadow">
      {/* First Form: Select Brand, Type, and Model */}
      <form onSubmit={handleAddNew} className="flex flex-col gap-3">
        {/* Brand selection */}
        <div>
          <label className="block mb-1">Choose Brand</label>
          <Select
            className="w-full p-2 border rounded"
            value={brandId || ""}
            onChange={(e) => setBrandId(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              -- اختر برند --
            </MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.attributes.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Type selection */}
        <div>
          <label className="block mb-1">Choose Type</label>
          <Select
            className="w-full p-2 border rounded"
            value={typeId || ""}
            onChange={(e) => setTypeId(e.target.value)}
            displayEmpty
            disabled={!brandId}
          >
            <MenuItem value="" disabled>
              -- اختر النوع --
            </MenuItem>
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.attributes?.name || type.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Model selection */}
        <div>
          <label className="block mb-1">Choose Model</label>
          <Select
            className="w-full p-2 border rounded"
            value={modelId || ""}
            onChange={(e) => setModelId(e.target.value)}
            displayEmpty
            disabled={!typeId}
          >
            <MenuItem value="" disabled>
              -- اختر موديل --
            </MenuItem>
            {models.map((model) => (
              <MenuItem key={model.id} value={model.id}>
                {model.attributes?.name || model.name}
              </MenuItem>
            ))}
          </Select>
          <input
            className="mt-2 p-2 border w-full rounded"
            placeholder="أو أدخل موديل جديد"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          />
        </div>

        {/* Submit button for first form */}
        <button
          type="submit"
          className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
        >
          حفظ أو إضافة جديد
        </button>
      </form>

      {/* Second Form: Model Details */}
      <form onSubmit={handleSaveDetails} className="flex flex-col gap-3 mt-4">
        <h3 className="text-lg font-bold">تفاصيل الموديل</h3>
        <div>
          <label className="block mb-1">السنة (Year)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="مثال: 2024"
          />
        </div>
        <div>
          <label className="block mb-1">السعر (Price)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثال: 1000"
          />
        </div>
        <div>
          <label className="block mb-1">نوع المحرك (Engine Type)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={engineType}
            onChange={(e) => setEngineType(e.target.value)}
            placeholder="مثال: Electric"
          />
        </div>
        <div>
          <label className="block mb-1">نوع الترانسيمشن (Transmission Type)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={transmissionType}
            onChange={(e) => setTransmissionType(e.target.value)}
            placeholder="مثال: Automatic"
          />
        </div>
        <div>
          <label className="block mb-1">نوع المقاعد (Seat Type)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={seatType}
            onChange={(e) => setSeatType(e.target.value)}
            placeholder="مثال: leather"
          />
        </div>
        <div>
          <label className="block mb-1">عدد المقاعد (Seats Count)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={seatsCount}
            onChange={(e) => setSeatsCount(e.target.value)}
            placeholder="مثال: 4"
          />
        </div>
        <div>
          <label className="block mb-1">التسارع (Acceleration)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
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
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="max-w-[200px] max-h-[200px] object-cover" />
              <button
                type="button"
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                onClick={removeImage}
              >
                حذف
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
                  <img src={preview} alt={`Preview ${index}`} className="max-w-[150px] max-h-[150px] object-cover" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white px-1 py-1 rounded"
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
       

        {/* Submit button for second form */}
        <button
          type="submit"
          className="bg-[#E6911E] text-white rounded-xl py-2 mt-3"
          disabled={!brandId || !typeId || !modelId}
        >
          حفظ التفاصيل
        </button>
      </form>
    </div>
  );
}