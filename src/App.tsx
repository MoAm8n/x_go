// import {  Route, Routes } from "react-router-dom";
// import MainLayout from "./pages/MainLayout";
// import {
//   Loading,
//   CarCollection,
//   Car,
//   Booking,
//   Payment,
//   BookingSuccess,
//   SignUp,
//   SignIn,
// } from "./pages";
import "./App.css";
import "./index.css";
// import Dashboard from "./Adman/Pages/Dashboard";

import SignInAdmin from "./Adman/Pages/SignInDashboard";
import DashboardOverview from "./Adman/Pages/DashboardOverview";
import DashboardCars from "./Adman/Pages/DashboardCars";
import Dashboardlisting from "./Adman/Pages/DashboardListing";
import DashboardStatisics from "./Adman/Pages/DashboardStatisics";
import BrandDashboard from "./Adman/Pages/BrandDashboard";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import {
  Car,
  CarCollection,
  SignIn,
  SignUp,
  Payment,
  BookingSuccess,
  Loading,
  Bookings,
  ForgotPassword,
} from "./pages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // تنظيف بيانات الحجز المؤقتة عند الخروج من صفحة الحجز
    if (
      !location.pathname.includes("/booking") &&
      !location.pathname.includes("/signin") &&
      !location.pathname.includes("/signup")
    ) {
      localStorage.removeItem("tempBookingData");
    }
  }, [location]);

  // تحقق إذا كانت الصفحة الحالية هي SignIn أو SignUp
  const isAuthPage =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname === "/DashboardOverview" ||
    location.pathname === "/DashboardCars" ||
    location.pathname === "/Dashboardlisting" ||
    location.pathname === "/DashboardStatisics" ||
    location.pathname === "/DashboardBrand" ||
    location.pathname === "/SignInDashboard";

  // <Route path="/DashboardOverview" element={<DashboardOverview />} />
  // <Route path="/DashboardCars" element={<DashboardCars />} />
  // <Route path="/Dashboardlisting" element={<Dashboardlisting />} />
  // <Route path="/DashboardStatisics" element={<DashboardStatisics />} />
  // <Route path="/DashboardBrand" element={<BrandDashboard />} />{" "}
  // <Route path="/SignInDashboard" element={<SignInAdmin />} />
  return (
    // <<<<<<< HEAD
    //     <BrowserRouter>
    //       <Routes>
    //         <Route path="/signin" element={<SignIn />} />
    //         <Route path="/signup" element={<SignUp />} />
    //         <Route path="/forgotpassword" element={<ForgotPassword />} />
    //         <Route path="/SignInDashboard" element={<SignInAdmin />} />

    //         <Route
    //           path="/"
    //           element={
    //             <MainLayout>
    //               <Loading />
    //             </MainLayout>
    //           }
    //         />
    //         <Route
    //           path="/loading"
    //           element={
    //             <MainLayout>
    //               <Loading />
    //             </MainLayout>
    //           }
    //         />
    //         <Route
    //           path="/cartCollection"
    //           element={
    //             <MainLayout>
    //               <CarCollection />
    //             </MainLayout>
    //           }
    //         />
    //         <Route
    //           path="/car/:id"
    //           element={
    //             <MainLayout>
    //               <Car />
    //             </MainLayout>
    //           }
    //         />
    //         <Route
    //           path="/booking/step2"
    //           element={
    //             <MainLayout>
    //               <Booking />
    //             </MainLayout>
    //           }
    //         />
    //         <Route
    //           path="/booking/payment"
    //           element={
    //             <MainLayout>
    //               <Payment />
    //             </MainLayout>
    //           }
    //         />
    //         <Route
    //           path="/booking/payment/booking-success"
    //           element={
    //             <MainLayout>
    //               <BookingSuccess />
    //             </MainLayout>
    //           }
    //         />

    //         {/* Dashboard */}

    //         {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
    //         {/* <Route path="/DashboardOverview" element={<DashboardOverview />} />
    //         <Route path="/DashboardCars" element={<DashboardCars />} />
    //         <Route path="/Dashboardlisting" element={<Dashboardlisting />} />
    //         <Route path="/DashboardStatisics" element={<DashboardStatisics />} />
    //         <Route path="/DashboardBrand" element={<BrandDashboard />} /> */}
    //       </Routes>
    //       <ToastContainer />
    //     </BrowserRouter>
    //   );
    // };

    // export default App;
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

          <Route path="/DashboardOverview" element={<DashboardOverview />} />
          <Route path="/DashboardCars" element={<DashboardCars />} />
          <Route path="/Dashboardlisting" element={<Dashboardlisting />} />
          <Route path="/DashboardStatisics" element={<DashboardStatisics />} />
          <Route path="/DashboardBrand" element={<BrandDashboard />} />{" "}
          <Route path="/SignInDashboard" element={<SignInAdmin />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </main>
          
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
