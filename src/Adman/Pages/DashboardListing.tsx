import React, { useEffect, useState } from "react";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
export default function Dashboardlisting() {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  // جلب قائمة السيارات
  const fetchCars = async (pageNum) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/Home?page=${pageNum}`);
      setCars(res.data.data);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // دالة الحذف
  const handleDelete = async (car) => {
    if (window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
      try {
        // استخراج المعرفات من بيانات السيارة
        const brandId = car.relationship.Brand.id; // تصحيح: استخدام معرف العلامة التجارية
        const typeId = car.relationship.Types.type_id; // حسب تعديلك
        const modelNameId = car.relationship["Model Names"].model_name_id; // حسب تعديلك
        const modelId = car.relationship.Models?.id || 1; // قيمة افتراضية
        const carId = car.id;

        // تسجيل المعرفات للتحقق
        console.log("brandId:", brandId);
        console.log("typeId:", typeId);
        console.log("modelNameId:", modelNameId);
        console.log("modelId:", modelId);
        console.log("carId:", carId);

        // جلب التوكن من localStorage
        const token = localStorage.getItem("tokenUser");
        console.log("token:", token); // تسجيل التوكن للتحقق

        if (!token) {
          alert("لم يتم العثور على توكن المصادقة. الرجاء تسجيل الدخول.");
          return;
        }

        // إرسال طلب الحذف مع رأس Authorization
        await axios.delete(
          `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models/${modelId}/Cars/${carId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // إزالة السيارة من القائمة
        setCars(cars.filter((c) => c.id !== carId));
        alert("تم حذف السيارة بنجاح!");
      } catch (error) {
        console.error("Error deleting car:", error);
        if (error.response?.status === 401) {
          alert("غير مصرح لك بحذف السيارة. الرجاء التحقق من تسجيل الدخول.");
        } else {
          alert("فشل حذف السيارة، حاول مرة أخرى.");
        }
      }
    }
  };

  // دالة التعديل
  const handleEdit = (car) => {
    const brandId = car.relationship.Brand.id;
    const typeId = car.relationship.Types.type_id; // تعديل ليتناسب مع هيكل البيانات
    const modelNameId = car.relationship["Model Names"].model_name_id;
    const modelId = car.relationship.Models?.id || 1;
    const carId = car.id;
    navigate(
      `/edit-car/${brandId}/${typeId}/${modelNameId}/${modelId}/${carId}`
    );
  };

  useEffect(() => {
    console.log("Cars data:", cars); // للتحقق من هيكل البيانات
    fetchCars(page);
  }, [page]);

  return (
    <div className="flex min-h-screen bg-[#fdf9f2]">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col lg:pl-64">
        <HeaderDashboard />
        <div className="flex-1 px-2 md:px-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-10">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div
                key={car.id}
                className="rounded-xl shadow-sm transition-shadow cursor-pointer  transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={car.attributes.image || "/placeholder-car.jpg"}
                  alt="car"
                  className="w-full h-44 md:h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 border border-[#000000] rounded-b-xl">
                  <div className="flex justify-between mb-2 max-md:flex-col">
                    <h3 className="font-bold text-lg">
                      {car.relationship.Brand.brand_name}{" "}
                      {car.relationship["Model Names"].model_name}
                    </h3>
                    <p className="text-lg">
                      ${car.attributes.price}/
                      <span className="text-sm text-gray-600">Day</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-sm">
                    <span className="flex items-center">
                      {car.relationship.Types.type_name}
                    </span>
                    <span className="flex items-center">
                      {car.attributes.year}
                    </span>
                  </div>
                  {/* أزرار الحذف والتعديل */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(car)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Pencil  size={18}/>
                    </button>
                    <button
                      onClick={() => handleDelete(car)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash size={18} />{" "}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              لا توجد سيارات متاحة للعرض
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 py-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gradient-to-r from-[#f4a825] to-[#fdc77a] text-white rounded w-[100px]"
          >
            السابق
          </button>
          <button
            disabled={page >= lastPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gradient-to-r from-[#f4a825] to-[#fdc77a] text-white rounded w-[100px]"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
