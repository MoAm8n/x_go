import React, { useEffect, useState } from "react";
import SidebarDashboard from "../Components/SidebarDashboard";
import HeaderDashboard from "../Components/HeaderDashboard";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { Pencil, Trash } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboardlisting() {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  // جلب قائمة السيارات
  const fetchCars = async (pageNum) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/Home?page=${pageNum}`);
      setCars(res.data.data);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("فشل جلب قائمة السيارات، حاول مرة أخرى.");
    }
  };

  // فتح نافذة تأكيد الحذف
  const openDeleteModal = (car) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  // إغلاق نافذة تأكيد الحذف
  const closeDeleteModal = () => {
    setCarToDelete(null);
    setShowDeleteModal(false);
  };

  // دالة الحذف
  const handleDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    try {
      // استخراج المعرفات
      const brandId = carToDelete.id; // حسب طلبك
      const typeId = carToDelete.relationship.Types?.type_id;
      const modelNameId = carToDelete.relationship["Model Names"]?.model_name_id;
      const modelId = carToDelete.relationship.Models?.id || 1;
      const carId = carToDelete.id;

      // التحقق من المعرفات
      if (!brandId || !typeId || !modelNameId || !carId) {
        console.error("Missing required IDs:", { brandId, typeId, modelNameId, carId });
        toast.error("بيانات السيارة غير مكتملة. يرجى التحقق من البيانات.");
        closeDeleteModal();
        return;
      }

      console.log("brandId:", brandId);
      console.log("typeId:", typeId);
      console.log("modelNameId:", modelNameId);
      console.log("modelId:", modelId);
      console.log("carId:", carId);

      // جلب التوكن
      const token = localStorage.getItem("tokenAdman");
      console.log("token:", token);

      if (!token) {
        toast.error("لم يتم العثور على توكن المصادقة. الرجاء تسجيل الدخول.");
        closeDeleteModal();
        return;
      }

      // طلب الحذف
      await axios.delete(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}/Model-Names/${modelNameId}/Models/${modelId}/Cars/${carId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // إزالة السيارة
      setCars(cars.filter((c) => c.id !== carId));
      toast.success("تم حذف السيارة بنجاح!");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting car:", error);
      if (error.response?.status === 401) {
        toast.error("غير مصرح لك بحذف السيارة. الرجاء التحقق من تسجيل الدخول.");
      } else if (error.response?.status === 404) {
        toast.error("السيارة أو المسار غير موجود. تحقق من المعرفات.");
      } else {
        toast.error("فشل حذف السيارة، حاول مرة أخرى.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // دالة التعديل
  const handleEdit = (car) => {
    const brandId = car.relationship.Brand.id;
    const typeId = car.relationship.Types.type_id;
    const modelNameId = car.relationship["Model Names"].model_name_id;
    const modelId = car.relationship.Models?.id || 1;
    const carId = car.id;
    navigate(`/edit-car/${brandId}/${typeId}/${modelNameId}/${modelId}/${carId}`);
  };

  useEffect(() => {
    console.log("Cars data:", cars);
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
                    <span className="flex items-center">{car.attributes.year}</span>
                  </div>
                  {/* أزرار الحذف والتعديل */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(car)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                      disabled={isDeleting}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(car)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                      disabled={isDeleting}
                    >
                      <Trash size={18} />
                      {isDeleting ? " جارٍ الحذف..." : ""}
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

        {/* Modal لتأكيد الحذف */}
        {showDeleteModal && carToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">تأكيد الحذف</h2>
              <p className="mb-4">
                هل أنت متأكد من حذف السيارة{" "}
                <strong>
                  {carToDelete.relationship.Brand.brand_name}{" "}
                  {carToDelete.relationship["Model Names"].model_name}
                </strong>
                ؟
              </p>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={isDeleting}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? "جارٍ الحذف..." : "تأكيد الحذف"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      </div>
    </div>
  );
}
