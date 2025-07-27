import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import {
  Loading,
  CarCollection,
  Car,
  Booking,
  Payment,
  BookingSuccess,
  SignUp,
  ForgotPassword,
  SignIn,
} from "./pages";
import "./App.css";
import "./index.css";
import SignInAdmin from "./Adman/Pages/SignInDashboard";
// import Dashboard from "./Adman/Pages/Dashboard";
import DashboardOverview from "./Adman/Pages/DashboardOverview";
import DashboardCars from "./Adman/Pages/DashboardCars";
import Dashboardlisting from "./Adman/Pages/Dashboardlisting";
import DashboardStatisics from "./Adman/Pages/DashboardStatisics";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import BrandDashboard from "./Adman/Pages/BrandDashboard";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/SignInDashboard" element={<SignInAdmin />} />

        <Route
          path="/"
          element={
            <MainLayout>
              <Loading />
            </MainLayout>
          }
        />
        <Route
          path="/loading"
          element={
            <MainLayout>
              <Loading />
            </MainLayout>
          }
        />
        <Route
          path="/cartCollection"
          element={
            <MainLayout>
              <CarCollection />
            </MainLayout>
          }
        />
        <Route
          path="/car/:id"
          element={
            <MainLayout>
              <Car />
            </MainLayout>
          }
        />
        <Route
          path="/booking/step2"
          element={
            <MainLayout>
              <Booking />
            </MainLayout>
          }
        />
        <Route
          path="/booking/payment"
          element={
            <MainLayout>
              <Payment />
            </MainLayout>
          }
        />
        <Route
          path="/booking/payment/booking-success"
          element={
            <MainLayout>
              <BookingSuccess />
            </MainLayout>
          }
        />

        {/* Dashboard */}

        {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
        <Route path="/DashboardOverview" element={<DashboardOverview />} />
        <Route path="/DashboardCars" element={<DashboardCars />} />
        <Route path="/Dashboardlisting" element={<Dashboardlisting />} />
        <Route path="/DashboardStatisics" element={<DashboardStatisics />} />
        <Route path="/DashboardBrand" element={<BrandDashboard />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
