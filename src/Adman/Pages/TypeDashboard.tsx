import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";

const carTypes = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Pickup",
  "Van",
  "Wagon",
  "Sports Car",
  "Crossover",
];

export default function TypeDashboard() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [typeName, setTypeName] = useState("");

  // جلب البرندات
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("tokenAdman");

        const res = await axios.get(`${API_URL}/api/admin/Brands`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBrands(res.data.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message 
        );
      }
    };
    fetchBrands();
    console.log(brands);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("tokenAdman");
      await axios.post(
        `${API_URL}/api/admin/Brands/${selectedBrand}/Types`,
        { name: typeName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(" Car type added successfully");
      setTypeName("");
      setSelectedBrand("");
    } catch (err) {
toast.error("Car type already exists.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mb-8 bg-[#faf7f2] p-4 rounded-xl shadow max-w-2xl mx-auto"
    >
      {/* اختيار البرند */}

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Choose the brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
        >
          <option value="">-- اختر برند --</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.attributes.name}
            </option>
          ))}
        </select>
      </div>

      {/* إدخال اسم النوع */}

      <div className="flex-1">
        <label className="block mb-2 font-medium">Add Car Type</label>
        <select
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
        >
          <option value="">Select Car Type</option>
          {carTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* زر الإضافة */}
      <button
        type="submit"
        className="bg-gradient-to-r from-[#f4a825] via-[#f4a825] to-[#fdc77a] text-white py-2 rounded-xl mt-2"
      >
        Add type
      </button>
    </form>
  );
}
