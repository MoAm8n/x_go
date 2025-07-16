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

const App = () => {
  return (
    <BrowserRouter>
      <main className='main-content'>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
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
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;