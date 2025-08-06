import axios from "axios";
import { useEffect, useState } from "react";
import { Trash, Pencil } from "lucide-react";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";
import React from "react";

interface Brand {
  id: number;
  name: string;
  logo: string;
}

export default function BrandDashboard() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBrandId, setEditBrandId] = useState<number | null>(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [editBrandLogo, setEditBrandLogo] = useState<File | null>(null);
  const [editBrandPreview, setEditBrandPreview] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandIdToDelete, setBrandIdToDelete] = useState<number | null>(null);
  const [typesModalOpen, setTypesModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [types, setTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [editTypeModalOpen, setEditTypeModalOpen] = useState(false);
  const [editType, setEditType] = useState<any>(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [editTypeDescription, setEditTypeDescription] = useState("");

  const [deleteTypeModalOpen, setDeleteTypeModalOpen] = useState(false);
  const [selectedTypeToDelete, setSelectedTypeToDelete] = useState(null);

  // جلب البرندات عند تحميل الصفحة
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("tokenAdman");
        const response = await axios.get(`${API_URL}/api/admin/Brands`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBrands(response.data.data || response.data); // حسب شكل الريسبونس
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "حدث خطأ أثناء جلب البرندات"
        );
      }
    };
    fetchBrands();
  }, []);

  // جلب الأنواع عند فتح مودال الأنواع
  useEffect(() => {
    if (!typesModalOpen || !selectedBrand) return;
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const token = localStorage.getItem("tokenAdman");
        const response = await axios.get(
          `${API_URL}/api/admin/Brands/${selectedBrand.id}/Types
          `,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTypes(response.data.data || response.data);
      } catch (error) {
        setTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, [typesModalOpen, selectedBrand]);

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName || !newBrandLogo) return;

    const formData = new FormData();
    formData.append("name", newBrandName);
    formData.append("logo", newBrandLogo);

    try {
      const token = localStorage.getItem("tokenAdman");
      const response = await axios.post(
        `${API_URL}/api/admin/Brands`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "تمت إضافة البراند بنجاح!");
      setNewBrandName("");
      setNewBrandLogo(null);
      // إعادة جلب البرندات بعد الإضافة
      const brandsRes = await axios.get(`${API_URL}/api/admin/Brands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBrands(brandsRes.data.data || brandsRes.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء الإضافة"
      );
    }
  };

  // دالة فتح المودال مع تعبئة البيانات
  const openEditModalBrand = (brand: Brand) => {
    setEditBrandId(brand.id);
    setEditBrandName(brand.name);
    setEditBrandPreview(brand.image);
    setEditBrandLogo(null);
    setEditModalOpen(true);
  };

  // دالة إغلاق المودال
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditBrandId(null);
    setEditBrandName("");
    setEditBrandLogo(null);
    setEditBrandPreview(null);
  };

  // دالة التحديث
  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBrandId || !editBrandName) return;
    const formData = new FormData();
    formData.append("name", editBrandName);
    if (editBrandLogo) formData.append("logo", editBrandLogo);
    try {
      const token = localStorage.getItem("tokenAdman");
      const response = await axios.post(
        `${API_URL}/api/admin/Brands/${editBrandId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "تم تحديث البراند بنجاح!");
      closeEditModal();
      // تحديث القائمة
      const brandsRes = await axios.get(`${API_URL}/api/admin/Brands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBrands(brandsRes.data.data || brandsRes.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء التحديث"
      );
    }
  };

  // فتح مودال الحذف
  const openDeleteModalBrand = (id: number) => {
    setBrandIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // إغلاق مودال الحذف
  const closeDeleteModal = () => {
    setBrandIdToDelete(null);
    setDeleteModalOpen(false);
  };

  // تنفيذ الحذف بعد التأكيد
  const confirmDelete = async () => {
    if (!brandIdToDelete) return;
    try {
      const token = localStorage.getItem("tokenAdman");
      const response = await axios.delete(
        `${API_URL}/api/admin/Brands/${brandIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "تم حذف البراند بنجاح!");
      // تحديث القائمة بعد الحذف
      const brandsRes = await axios.get(`${API_URL}/api/admin/Brands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBrands(brandsRes.data.data || brandsRes.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "حدث خطأ أثناء الحذف"
      );
    } finally {
      closeDeleteModal();
    }
  };

  // دالة فتح مودال الأنواع
  const openTypesModal = (brand: any) => {
    setSelectedBrand(brand);
    setTypesModalOpen(true);
  };
  // دالة غلق مودال الأنواع
  const closeTypesModal = () => {
    setSelectedBrand(null);
    setTypesModalOpen(false);
  };

  // تعدديل الانواع
  const openEditModalTypes = (type: any) => {
    setEditType(type); // ده بيحتفظ بالكائن كامل

    // استخدم attributes بدلًا من type مباشرة
    setEditTypeName(type.attributes.name);
    setEditTypeDescription(type.attributes.description);
    setEditTypeModalOpen(true);
  };

  const closeEditTypeModal = () => {
    setEditType(null);
    setEditTypeName("");
    setEditTypeDescription("");
    setEditTypeModalOpen(false);
  };

  const handleOpenDeleteTypeDialog = (type) => {
    setEditType(type);
    setSelectedTypeToDelete(type);
    setDeleteTypeModalOpen(true);
  };

  const closeDeleteTypeModal = () => {
    setDeleteTypeModalOpen(false);
    setSelectedTypeToDelete(null);
  };
  const confirmDeleteType = async () => {
    if (
      !selectedTypeToDelete ||
      !selectedTypeToDelete.attributes?.brand_id ||
      !selectedTypeToDelete.id
    ) {
      toast.error("بيانات النوع غير صالحة");
      closeDeleteTypeModal();
      return;
    }

    try {
      const brandId = selectedTypeToDelete.attributes.brand_id;
      const typeId = selectedTypeToDelete.id;
      const token = localStorage.getItem("tokenAdman");

      if (!token) {
        toast.error("يرجى تسجيل الدخول أولاً");
        closeDeleteTypeModal();
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تحقق من نجاح العملية
      if (response.status === 200 || response.status === 204) {
        toast.success(response.data.message || "تم حذف النوع بنجاح");

        // إعادة جلب الأنواع لتحديث القائمة
        const typesRes = await axios.get(
          `${API_URL}/api/admin/Brands/${brandId}/Types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTypes(typesRes.data.data || typesRes.data);
      } else {
        toast.error("فشل حذف النوع");
      }

      closeDeleteTypeModal();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "حدث خطأ أثناء الحذف"
      );
      closeDeleteTypeModal();
    }
  };

  const handleUpdateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editType) return;

    try {
      const brandId = editType.attributes.brand_id;
      const typeId = editType.id;
      const token = localStorage.getItem("tokenAdman");

      const response = await axios.post(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}`,
        {
          name: editTypeName,
          description: editTypeDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //  await axios.post(
      //   `${API_URL}/api/admin/Brands/${type.attributes.brand.data.id}/Types/${editType.id}`,
      //   {
      //     name: editTypeName,
      //     description: editTypeDescription,
      //   }
      // );
      toast.success(response.data.message || "تم تعديل النوع بنجاح!");

      // حدث القائمة
      const res = await axios.get(
        `${API_URL}/api/admin/Brands/${selectedBrand.id}/Types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTypes(res.data.data || res.data);
      closeEditTypeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التعديل");
    }
  };

  return (
    <div className="max-w-1xl mx-auto p-6">
      <form
        onSubmit={handleAddBrand}
        className="flex flex-col gap-3 mb-8 bg-[#faf7f2] p-4 rounded-xl shadow max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 "> Brand</h2>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Brand name</label>
            <input
              type="text"
              className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              placeholder=" Brand name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium"> Photo brand</label>
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
              <input
                type="file"
                accept="image/*"
                className="hidden bg-[#FAF7F2] border border-[#E6911E]"
                onChange={(e) =>
                  setNewBrandLogo(e.target.files ? e.target.files[0] : null)
                }
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
          type="submit"
          className="bg-gradient-to-r from-[#f4a825] via-[#f4a825] to-[#fdc77a] text-white py-2 rounded-xl mt-2"
        >
          Add Brand
        </button>
      </form>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center gap-6 bg-gray-50 p-3 rounded-xl shadow-xl bg-[#faf7f2]"
            >
              {/* صورة واسم البراند */}
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => openTypesModal(brand)}
                title="عرض الأنواع"
              >
                <img
                  src={brand.attributes.logo}
                  alt={brand.attributes.name}
                  className=" rounded object-cover border mb-1 "
                />
              </div>
              {/* أزرار التعديل والحذف */}
              <div className="flex justify-between gap-3 items-center flex-1 justify-start w-full px-10">
                {" "}
                <h2 className="text-base font-semibold text-center break-words">
                  {brand.attributes.name}
                </h2>
                <div className="flex gap-5">
                  <button
                    onClick={() => openEditModalBrand(brand)}
                    className="text-blue-600 hover:underline"
                    title="تعديل"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => openDeleteModalBrand(brand.id)}
                    className="text-red-600 hover:underline"
                    title="حذف"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مودال التعديل */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#faf7f2] rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeEditModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">تعديل البراند</h2>
            <form
              onSubmit={handleUpdateBrand}
              className="flex flex-col gap-3 bg-[#f9fafb] p-4 rounded-xl"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex-1">
                  <label className="block mb-2 font-medium">اسم البراند</label>
                  <input
                    type="text"
                    className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="block mb-2 font-medium">صورة البراند</label>
                  <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer bg-[#FAF7F2]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden bg-[#f9fafb] border border-[#E6911E]"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEditBrandLogo(e.target.files[0]);
                          setEditBrandPreview(
                            URL.createObjectURL(e.target.files[0])
                          );
                        }
                      }}
                    />
                    {editBrandPreview ? (
                      <img
                        src={editBrandPreview}
                        alt="Brand Logo Preview"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-3xl text-gray-400">&#8682;</span>
                    )}
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#f4a825] via-[#f4a825] to-[#fdc77a] text-white py-2 rounded-xl mt-2"
              >
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}

      {/* مودال تأكيد الحذف */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#faf7f2] rounded-xl p-6 w-full max-w-sm shadow-xl relative flex flex-col items-center">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeDeleteModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">تأكيد الحذف</h2>
            <p className="mb-6 text-center text-gray-700">
              هل أنت متأكد أنك تريد حذف هذا البراند؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الأنواع */}
      {typesModalOpen && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50   ">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeTypesModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              أنواع {selectedBrand.attributes.name}
            </h2>
            {/* عرض الأنواع */}
            {loadingTypes ? (
              <div className="text-center text-gray-500">جاري التحميل...</div>
            ) : types.length === 0 ? (
              <div className="text-center text-gray-500">
                لا توجد أنواع لهذا البراند.
              </div>
            ) : (
              <ul className="space-y-2">
                {types.map((type) => (
                  <li
                    key={type.id}
                    className="bg-[#faf7f2] p-2 rounded shadow flex justify-between px-8"
                  >
                    {/* أزرار التعديل والحذف */}

                    <div className="">
                      <p className="font-bold">{type.attributes.name}</p>
                      <p className="text-sm text-gray-500">
                        {type.attributes.description}
                      </p>
                      {type.relationship &&
                        type.relationship["Model Names"] && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-400">
                              الموديلات:
                            </span>
                            <ul className="flex flex-wrap gap-2 mt-1">
                              {type.relationship["Model Names"].map(
                                (model: any) => (
                                  <li
                                    key={model.id}
                                    className="bg-gray-200 px-2 py-1 rounded text-xs"
                                  >
                                    {model.name}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                    <div
                      className="
                     flex gap-5"
                    >
                      <button
                        onClick={() =>
                          // alert(`تعديل النوع: ${type.attributes.name}`)
                          openEditModalTypes(type)
                        }
                        className="text-blue-600 hover:underline"
                        title="تعديل النوع"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteTypeDialog(type)}
                        //</div> onClick={
                        //  () => openDeleteModalTypes(type.attributes.id)

                        // alert(`حذف النوع: ${type.attributes.name}`)
                        //}
                        className="text-red-600 hover:underline"
                        title="حذف النوع"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {editTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#faf7f2] rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeEditTypeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">تعديل النوع</h2>
            <form onSubmit={handleUpdateType} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">اسم النوع</label>
                <input
                  type="text"
                  className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                  value={editTypeName}
                  onChange={(e) => setEditTypeName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">الوصف</label>
                <textarea
                  className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                  rows={3}
                  value={editTypeDescription}
                  onChange={(e) => setEditTypeDescription(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#f4a825] via-[#f4a825] to-[#fdc77a] text-white py-2 rounded-xl"
              >
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}
      {deleteTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#faf7f2] rounded-xl p-6 w-full max-w-sm shadow-xl relative flex flex-col items-center">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeDeleteTypeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">تأكيد الحذف</h2>
            <p className="mb-6 text-center text-gray-700">
              هل أنت متأكد أنك تريد حذف هذا النوع؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={confirmDeleteType}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={closeDeleteTypeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
