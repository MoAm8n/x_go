import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../context/api/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
];

const SignInDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  // تغيير: حفظ كود اللغة بدلاً من اللاف
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // دالة تسجيل الدخول
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/admin/login`,
        {
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            "Accept-Language": selectedLang.code, // إضافة اللغة في الـ Headers
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("tokenAdman", response.data.data.token);
      // حفظ اللغة في localStorage للاستخدام لاحقاً
      localStorage.setItem("selectedLanguage", selectedLang.code);

      navigate("/DashboardOverview");
      toast.success(response.data.message || t("AdmanSignIn.successLogin"));
    } catch (err: any) {
      console.log("Login error:", err, err.response?.data);

      toast.error(
        err.response?.data?.message || t("AdmanSignIn.errorLogin")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLang = (lang: { code: string; label: string }) => {
    setSelectedLang(lang);
    localStorage.setItem("selectedLanguage", lang.code);
    i18n.changeLanguage(lang.code);
    document.dir = lang.code === "ar" ? "rtl" : "ltr";
    setOpen(false);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFB347] via-[#FFE0B2] to-white px-2 sm:px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl bg-transparent overflow-hidden md:h-[450px] ">
          {/* Left Side (Welcome Section) */}
          <div className="w-full flex flex-col justify-between pt-[10%] md:pl-12 md:pr-8 my-20 md:my-0 ">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight text-center md:text-left">
                {t("AdmanSignIn.title")}
              </h2>
              <p className="text-gray-600 mb-10 max-w-md md:max-w-xs text-center md:text-left">
                {t("AdmanSignIn.description")}
              </p>
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-4 mt-4">
              {/* زر تغيير اللغة Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="px-4 py-2 rounded-md font-medium text-[14px] border shadow-lg flex items-center gap-2"
                  type="button"
                >
                  <span role="img" aria-label="language">
                    🌐
                  </span>{" "}
                  {selectedLang.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {open && (
                  <ul className="absolute left-0 bottom-full mb-2 bg-white border rounded-md shadow-md w-40 z-50">
                    {languages.map((lang) => (
                      <li
                        key={lang.code}
                        className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]"
                        onClick={() => handleSelectLang(lang)}
                      >
                        {lang.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <nav className="flex gap-4">
                <Link to="#" className="text-[14px] text-[#E6911E]">
                  {t("AdmanSignIn.terms")}
                </Link>
                <Link to="#" className="text-[14px] text-[#E6911E]">
                  {t("AdmanSignIn.plans")}
                </Link>
                <Link to="#" className="text-[14px] text-[#E6911E]">
                  {t("AdmanSignIn.contact")}
                </Link>
              </nav>
            </div>
          </div>
          {/* Right Side (Form) */}
          <div className="w-full max-w-sm flex flex-col justify-center items-center p-6 bg-white rounded-lg my-20 md:my-0 ">
            <form
              className="w-full flex flex-col gap-5  mx-auto"
              onSubmit={handleSubmit}
            >
              <h3 className="text-2xl font-extrabold text-gray-900 ">
                {t("AdmanSignIn.signIn")}
              </h3>
              <p className="">{t("AdmanSignIn.enterEmailPassword")}
</p>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  {t("AdmanSignIn.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-input py-1 px-4 block w-full rounded-xl border border-gray-300 focus:ring-[#E6911E] focus:border-[#E6911E] text-base"
                  placeholder="name@email.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 ">
                  {t("AdmanSignIn.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      // أيقونة عين مفتوحة
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      // أيقونة عين مغلقة
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.872A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3l18 18"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between pt-10 gap-4 sm:gap-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-[45%] text-white bg-[#E6911E] hover:bg-[#cc7f15] font-bold rounded-xl text-base px-5 py-2 text-center transition-colors shadow-lg"
                >
                  {loading ?t("AdmanSignIn.signingIn") : t("AdmanSignIn.signIn")}
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-[45%] text-[#E6911E] border border-[#E6911E] hover:bg-[#FFE0B2] font-bold rounded-xl text-base px-5 py-2 text-center transition-colors shadow-lg"
                >
                  {t("AdmanSignIn.backHome")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={selectedLang.code === "ar"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          direction: selectedLang.code === "ar" ? "rtl" : "ltr",
        }}
      />
    </>
  );
};

export default SignInDashboard;
