import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";


type AddCarBrandProps = {
  carBrand: string;
  setCarBrand: (val: string) => void;
  carLogo: File | null;
  setCarLogo: (val: File | null) => void;
};

type Brand = {
  id: string;
  name: string;
  logo: string;
};

const AddCarBrand = ({ carBrand, setCarBrand, carLogo, setCarLogo }: AddCarBrandProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);

  // جلب البرندات من API عند تحميل الكومبوننت مع التوكن
  useEffect(() => {
    const token = localStorage.getItem("tokenAdman");
    axios.get(`${API_URL}/api/admin/Brands`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      const apiBrands = res.data.data.map((item: any) => ({
        id: item.id,
        name: item.attributes.name,
        logo: item.attributes.logo,
      }));
      setBrands(apiBrands);
    });
  }, []);

  // عند إضافة برند جديد (UI فقط)
 const handleAddBrand = () => {
  if (newBrandName) {
    const formData = new FormData();
    formData.append("name", newBrandName);
    if (newBrandLogo) {
      formData.append("logo", newBrandLogo);
    }

    const token = localStorage.getItem("tokenAdman");

    axios
      .post(`${API_URL}/api/admin/Brands`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // تحديث الواجهة بالبرند الجديد بعد نجاح الإضافة
        const newBrand = {
          id: res.data.data.id,
          name: res.data.data.attributes.name,
          logo: res.data.data.attributes.logo,
        };
        console.log(newBrand)
        setBrands([...brands, newBrand]);
        setCarBrand(newBrand.id);
        setCarLogo(newBrandLogo);
        setShowAddBrand(false);
        setNewBrandName("");
        setNewBrandLogo(null);
        toast.success(res.response?.data?.message)
      })
      .catch((err) => {
        toast.error( err.response?.data?.message)
      });
  }
};


  return (
    <div className="flex flex-col gap-4">
      <label className="font-semibold mb-1">Car Brand</label>
      <select
        className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
        value={carBrand}
        onChange={e => setCarBrand(e.target.value)}
      >
        <option value="">اختر البرند</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.name}>{brand.name}</option>
        ))}
      </select>
      <button
        className="text-[#E6911E] text-sm underline w-fit"
        type="button"
        onClick={() => setShowAddBrand(!showAddBrand)}
      >
        + إضافة برند جديد
      </button>
      {showAddBrand && (
        <div className="bg-[#FAF7F2] border border-[#E6911E] rounded-xl shadow p-4 flex flex-col gap-3 mt-2">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex-1">
              <label className="block mb-2 font-medium">Add Car Brand</label>
              <input
                type="text"
                className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                placeholder="Car Brand"
                value={newBrandName}
                onChange={e => setNewBrandName(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block mb-2 font-medium">Add Car Logo</label>
              <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden bg-[#FAF7F2] border border-[#E6911E]"
                  onChange={e => setNewBrandLogo(e.target.files ? e.target.files[0] : null)}
                />
                {newBrandLogo ? (
                  <img
                    src={URL.createObjectURL(newBrandLogo)}
                    alt="Car Logo"
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-3xl text-gray-400">&#8682;</span>
                )}
              </label>
            </div>
          </div>
          <button
            className="bg-[#E6911E] hover:bg-[#e6a200] text-white rounded-xl px-4 py-2 mt-4 font-semibold transition self-end"
            type="button"
            onClick={handleAddBrand}
          >
            حفظ
          </button>
        </div>
      )}
      {/* عرض صورة اللوجو إذا تم اختيارها */}
      {carLogo && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">الشعار المختار:</span>
          <img src={URL.createObjectURL(carLogo)} alt="Car Logo" className="w-8 h-8 object-contain" />
        </div>
      )}
    </div>
  );
};

export default AddCarBrand;
 