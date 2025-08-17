import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [typeName, setTypeName] = useState("");

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
        toast.error(t("type_dashboard.error_fetching_brands"));
      }
    };
    fetchBrands();
  }, [t]);

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
      toast.success(t("type_dashboard.success_adding_type"));
      setTypeName("");
      setSelectedBrand("");
    } catch (err) {
      toast.error(t("type_dashboard.error_type_exists"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mb-8 bg-[#faf7f2] p-4 rounded-xl shadow max-w-2xl mx-auto"
    >
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          {t("type_dashboard.choose_brand")}
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
        >
          <option value="">{t("type_dashboard.select_brand")}</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.attributes.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block mb-2 font-medium">{t("type_dashboard.add_car_type")}</label>
        <select
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
        >
          <option value="">{t("type_dashboard.select_car_type")}</option>
          {carTypes.map((type) => (
            <option key={type} value={type}>
              {t(`type_dashboard.car_types.${type.toLowerCase().replace(" ", "_")}`)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-gradient-to-r from-[#f4a825] via-[#f4a825] to-[#fdc77a] text-white py-2 rounded-xl mt-2"
      >
        {t("type_dashboard.add_type")}
      </button>
    </form>
  );
}