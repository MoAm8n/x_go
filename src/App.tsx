import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { Car, CarCollection, SignIn, SignUp, Payment, BookingSuccess, Loading, Bookings, ForgotPassword } from './pages'
import Header from './components/Header'
import Footer from './components/Footer'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import DashboardOverview from "./Adman/Pages/DashboardOverview";
import DashboardCars from "./Adman/Pages/DashboardCars";
import Dashboardlisting from "./Adman/Pages/DashboardListing";
import DashboardStatisics from "./Adman/Pages/DashboardStatisics";
import BrandDashboard from "./Adman/Pages/BrandDashboard";
import SignInAdmin from "./Adman/Pages/SignInDashboard";

const App = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  // تحديث الاتجاه حسب اللغة
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // تنظيف بيانات الحجز المؤقتة عند الخروج من صفحة الحجز
  useEffect(() => {
    if (
      !location.pathname.includes("/booking") &&
      !location.pathname.includes("/signin") &&
      !location.pathname.includes("/signup")
    ) {
      localStorage.removeItem("tempBookingData");
    }
  }, [location]);

  // التحقق من الصفحات التي لا تحتاج هيدر وفوتر
  const isAuthPage =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgotpassword" ||
    location.pathname === "/DashboardOverview" ||
    location.pathname === "/DashboardCars" ||
    location.pathname === "/Dashboardlisting" ||
    location.pathname === "/DashboardStatisics" ||
    location.pathname === "/DashboardBrand" ||
    location.pathname === "/SignInDashboard";

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? "" : "pt-20"}>
        <Routes>
          <Route path="/" element={<Navigate to="/loading" />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/carCollection" element={<CarCollection />} />
          <Route path="/car/:id" element={<Car />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<Bookings />} />
          <Route path="/bookings/:id/payment" element={<Payment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          {/* Admin Dashboard Pages */}
          <Route path="/DashboardOverview" element={<DashboardOverview />} />
          <Route path="/DashboardCars" element={<DashboardCars />} />
          <Route path="/Dashboardlisting" element={<Dashboardlisting />} />
          <Route path="/DashboardStatisics" element={<DashboardStatisics />} />
          <Route path="/DashboardBrand" element={<BrandDashboard />} />
          <Route path="/SignInDashboard" element={<SignInAdmin />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
