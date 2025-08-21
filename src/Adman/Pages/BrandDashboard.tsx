import axios from "axios";
import { useEffect, useState } from "react";
import { Trash, Pencil } from "lucide-react";
import { API_URL } from "../../context/api/Api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Brand {
  id: number;
  attributes: {
    name: string;
    logo: string;
  };
}

export default function BrandDashboard() {
  const { t } = useTranslation();
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

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("tokenAdman");
        const response = await axios.get(`${API_URL}/api/admin/Brands`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBrands(response.data.data || response.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            t("brand_dashboard.error_fetching_brands")
        );
      }
    };
    fetchBrands();
  }, [t]);

  useEffect(() => {
    if (!typesModalOpen || !selectedBrand) return;
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const token = localStorage.getItem("tokenAdman");
        const response = await axios.get(
          `${API_URL}/api/admin/Brands/${selectedBrand.id}/Types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTypes(response.data.data || response.data);
      } catch (error) {
        setTypes([]);
        toast.error(t("brand_dashboard.error_fetching_types"));
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, [typesModalOpen, selectedBrand, t]);

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
      toast.success(
        response.data.message || t("brand_dashboard.success_adding_brand")
      );
      setNewBrandName("");
      setNewBrandLogo(null);
      const brandsRes = await axios.get(`${API_URL}/api/admin/Brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(brandsRes.data.data || brandsRes.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          t("brand_dashboard.error_adding_brand")
      );
    }
  };

  const openEditModalBrand = (brand: Brand) => {
    setEditBrandId(brand.id);
    setEditBrandName(brand.attributes.name);
    setEditBrandPreview(brand.attributes.logo);
    setEditBrandLogo(null);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditBrandId(null);
    setEditBrandName("");
    setEditBrandLogo(null);
    setEditBrandPreview(null);
  };

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
      toast.success(
        response.data.message || t("brand_dashboard.success_updating_brand")
      );
      closeEditModal();
      const brandsRes = await axios.get(`${API_URL}/api/admin/Brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(brandsRes.data.data || brandsRes.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          t("brand_dashboard.error_updating_brand")
      );
    }
  };

  const openDeleteModalBrand = (id: number) => {
    setBrandIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setBrandIdToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!brandIdToDelete) return;
    try {
      const token = localStorage.getItem("tokenAdman");
      const response = await axios.delete(
        `${API_URL}/api/admin/Brands/${brandIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        response.data.message || t("brand_dashboard.success_deleting_brand")
      );
      const brandsRes = await axios.get(`${API_URL}/api/admin/Brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(brandsRes.data.data || brandsRes.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          t("brand_dashboard.error_deleting_brand")
      );
    } finally {
      closeDeleteModal();
    }
  };

  const openTypesModal = (brand: any) => {
    setSelectedBrand(brand);
    setTypesModalOpen(true);
  };

  const closeTypesModal = () => {
    setSelectedBrand(null);
    setTypesModalOpen(false);
  };

  const openEditModalTypes = (type: any) => {
    setEditType(type);
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

  const handleOpenDeleteTypeDialog = (type: any) => {
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
      toast.error(t("brand_dashboard.error_invalid_type_data"));
      closeDeleteTypeModal();
      return;
    }

    try {
      const brandId = selectedTypeToDelete.attributes.brand_id;
      const typeId = selectedTypeToDelete.id;
      const token = localStorage.getItem("tokenAdman");

      if (!token) {
        toast.error(t("toast.token_not_found"));
        closeDeleteTypeModal();
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/admin/Brands/${brandId}/Types/${typeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success(
          response.data.message || t("brand_dashboard.success_deleting_type")
        );
        const typesRes = await axios.get(
          `${API_URL}/api/admin/Brands/${brandId}/Types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTypes(typesRes.data.data || typesRes.data);
      } else {
        toast.error(t("brand_dashboard.error_deleting_type"));
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          t("brand_dashboard.error_deleting_type")
      );
    } finally {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        response.data.message || t("brand_dashboard.success_updating_type")
      );
      const res = await axios.get(
        `${API_URL}/api/admin/Brands/${selectedBrand.id}/Types`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTypes(res.data.data || res.data);
      closeEditTypeModal();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          t("brand_dashboard.error_updating_type")
      );
    }
  };

  return (
    <div className="max-w-1xl mx-auto p-6">
      <form
        onSubmit={handleAddBrand}
        className="flex flex-col gap-3 mb-8 bg-[#faf7f2] p-4 rounded-xl shadow max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">{t("brand_dashboard.brand")}</h2>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-1">
            <label className="block mb-2 font-medium">
              {t("brand_dashboard.brand_name")}
            </label>
            <input
              type="text"
              className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              placeholder={t("brand_dashboard.brand_name")}
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium">
              {t("brand_dashboard.photo_brand")}
            </label>
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
          {t("brand_dashboard.add_brand")}
        </button>
      </form>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center gap-6 bg-gray-50 p-3 rounded-xl shadow-xl bg-[#faf7f2]"
            >
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => openTypesModal(brand)}
                title={t("brand_dashboard.view_types")}
              >
                <img
                  src={brand.attributes.logo}
                  alt={brand.attributes.name}
                  className="rounded object-cover border mb-1"
                />
              </div>
              <div className="flex justify-between gap-3 items-center flex-1 justify-start w-full px-10">
                <h2 className="text-base font-semibold text-center break-words">
                  {brand.attributes.name}
                </h2>
                <div className="flex gap-5">
                  <button
                    onClick={() => openEditModalBrand(brand)}
                    className="text-blue-600 hover:underline"
                    title={t("brand_dashboard.edit")}
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => openDeleteModalBrand(brand.id)}
                    className="text-red-600 hover:underline"
                    title={t("brand_dashboard.delete")}
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#faf7f2] rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeEditModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              {t("brand_dashboard.edit_brand")}
            </h2>
            <form
              onSubmit={handleUpdateBrand}
              className="flex flex-col gap-3 bg-[#f9fafb] p-4 rounded-xl"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex-1">
                  <label className="block mb-2 font-medium">
                    {t("brand_dashboard.brand_name")}
                  </label>
                  <input
                    type="text"
                    className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="block mb-2 font-medium">
                    {t("brand_dashboard.photo_brand")}
                  </label>
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
                {t("brand_dashboard.save_changes")}
              </button>
            </form>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#faf7f2] rounded-xl p-6 w-full max-w-sm shadow-xl relative flex flex-col items-center">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeDeleteModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {t("brand_dashboard.confirm_delete")}
            </h2>
            <p className="mb-6 text-center text-gray-700">
              {t("brand_dashboard.delete_confirmation")}
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold"
              >
                {t("brand_dashboard.confirm_delete")}
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl font-bold"
              >
                {t("buttons.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
      {typesModalOpen && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 left-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeTypesModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {t("brand_dashboard.types_of_brand", {
                brand: selectedBrand.attributes.name,
              })}
            </h2>
            {loadingTypes ? (
              <div className="text-center text-gray-500">{t("loading")}</div>
            ) : types.length === 0 ? (
              <div className="text-center text-gray-500">
                {t("brand_dashboard.no_types_available")}
              </div>
            ) : (
              <ul className="space-y-2">
                {types.map((type) => (
                  <li
                    key={type.id}
                    className="bg-[#faf7f2] p-2 rounded shadow flex justify-between px-8"
                  >
                    <div>
                      <p className="font-bold">{type.attributes.name}</p>
                      <p className="text-sm text-gray-500">
                        {type.attributes.description}
                      </p>
                      {type.relationship && type.relationship["Model Names"] && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-400">
                            {t("brand_dashboard.models")}:
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
                    <div className="flex gap-5">
                      <button
                        onClick={() => openEditModalTypes(type)}
                        className="text-blue-600 hover:underline"
                        title={t("brand_dashboard.edit_type")}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteTypeDialog(type)}
                        className="text-red-600 hover:underline"
                        title={t("brand_dashboard.delete_type")}
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
            <h2 className="text-xl font-bold mb-4">
              {t("brand_dashboard.edit_type")}
            </h2>
            <form onSubmit={handleUpdateType} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  {t("brand_dashboard.type_name")}
                </label>
                <input
                  type="text"
                  className="border border-[#E6911E] rounded-xl px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                  value={editTypeName}
                  onChange={(e) => setEditTypeName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  {t("brand_dashboard.description")}
                </label>
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
                {t("brand_dashboard.save_changes")}
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
            <h2 className="text-xl font-bold mb-4 text-center">
              {t("brand_dashboard.confirm_delete")}
            </h2>
            <p className="mb-6 text-center text-gray-700">
              {t("brand_dashboard.delete_confirmation")}
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={confirmDeleteType}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold"
              >
                {t("brand_dashboard.confirm_delete")}
              </button>
              <button
                onClick={closeDeleteTypeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl font-bold"
              >
                {t("buttons.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}