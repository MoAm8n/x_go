import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authUsers, saveBooking } from '../context/Data/DataUser';
import type { BookingData } from '../context/Data/DataUser';
import { useTranslation } from "react-i18next";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const languages = [
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "en", label: "English", dir: "ltr" },
    { code: "ru", label: "Русский", dir: "ltr" },
  ];

  const [currentLanguage, setCurrentLanguage] = useState(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang.code);
    document.documentElement.dir = lang.dir;
    setOpen(false);
  };

  useEffect(() => {
    if (location.state?.email) {
      setForm(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await authUsers(form);
      
      localStorage.setItem('tokenUser', token);
      localStorage.setItem('user', JSON.stringify(user));

      const tempBookingData = location.state?.tempBookingData || 
      JSON.parse(localStorage.getItem('tempBookingData') || '{}');

      if (tempBookingData) {
        try {
          const bookingData: BookingData = {
            start_date: tempBookingData.start_date,
            end_date: tempBookingData.end_date,
            carmodel_id: tempBookingData.carmodel_id,
            user_id: user.id,
            additional_driver: tempBookingData.additional_driver,
            pickup_location: tempBookingData.pickup_location,
            dropoff_location: tempBookingData.dropoff_location
          };

          const res = await saveBooking(tempBookingData.carmodel_id, bookingData);
          localStorage.removeItem('tempBookingData');
          
          navigate(`/bookings/${res.bookingId}`, {
            state: {
              carDetails: tempBookingData.carDetails,
              bookingDetails: {
                ...bookingData,
                extras: tempBookingData.extras,
                totalPrice: tempBookingData.totalPrice
              }
            }
          });
          return;
        } catch (bookingError) {
          console.error('Failed to complete booking:', bookingError);
        }
      }
      navigate('/bookings');
    } catch (error) {
      let errorMessage = t('signin.unexpected_error');
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);

      if (error instanceof Error && error.message.includes(t('signin.incorrect_credentials'))) {
        setTimeout(() => {
          navigate('/signup', { state: { email: form.email } });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFB347] via-[#FFE0B2] to-[#fdf9f2] sm:px-4 md:px-32">
      <div className="flex flex-col lg:flex-row justify-between item-center w-full bg-transparent overflow-hidden">
        <div className="w-full flex flex-col justify-evenly max-lg:pt-14">
          <div className="w-full max-lg:text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 lg:w-3/4 max-lg:px-10 max-lg:py-2">
              {t("signin.welcome_message")}
            </h2>
            <p className="text-gray-600 lg:w-3/4 text-lg max-lg:px-6">
              {t("signin.welcome_subtext")}
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row w-full max-lg:justify-center items-center gap-4 max-lg:py-8">
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="px-4 py-2 rounded-lg font-medium text-[14px] bg-inherit border border-gray-300 lg:mr-10 flex items-center gap-2"
                type="button"
              >
                🌐 {currentLanguage.label}
              </button>
              {open && (
                <ul className="absolute left-0 bg-white border shadow-md w-44 z-[10000] rounded-lg">
                  {languages.map((lang) => (
                    <li 
                      key={lang.code}
                      className={`hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px] ${
                        lang.code === currentLanguage.code ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <nav className="flex gap-4">
              <a href="#" className="text-[14px] text-[#E6911E]">
                {t("common.terms")}
              </a>
              <a href="#" className="text-[14px] text-[#E6911E]">
                {t("common.plans")}
              </a>
              <a href="#" className="text-[14px] text-[#E6911E]">
                {t("common.contact_us")}
              </a>
            </nav>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center bg-white shadow-lg rounded-lg">
          <form className="w-full px-8 py-4 mx-auto" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
                {error.includes(t('signin.incorrect_credentials')) && (
                  <div className="mt-2">
                    <Link 
                      to="/signup" 
                      state={{ email: form.email }}
                      className="text-blue-600 hover:underline"
                    >
                      {t("signin.create_account")}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <h3 className="text-2xl font-extrabold text-gray-900 my-3">{t("signin.title")}</h3>
            <p className="mb-6">{t("signin.subtitle")}</p>

            <div>
              <label htmlFor="email" className="block my-2 text-sm font-semibold text-gray-700">
                {t("signin.email_label")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                placeholder="name@email.com"
                required
              />
            </div>

            <div>
              <label className="block my-2 text-sm font-semibold text-gray-700">
                {t("signin.password_label")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-10">
              <button
                type="submit"
                className="w-full text-white bg-[#E6911E] hover:bg-[#cc7f15] font-bold rounded-lg text-base px-5 py-2 text-center transition-colors shadow-lg"
                disabled={loading}
              >
                {loading ? t('signin.signing_in') : t('signin.signin_button')}
              </button>
            </div>

            <div className="text-xs text-gray-400 mt-4 text-center">
              {t("signin.no_account")}{' '}
              <Link to="/signup" className="text-[#E6911E] hover:underline">
                {t("signin.signup_link")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;