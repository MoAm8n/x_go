<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components'
import  Footer  from './components/ui/Footer'
import { Loading, CarCollection, Car ,Booking,Payment,BookingSuccess } from './pages'
import './App.css'
import './index.css'
const App = () => {
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Loading/>} />
          <Route path="/loading" element={<Loading/>} />
          <Route path="/cartCollection" element={<CarCollection/>} />
          <Route path="/car" element={<Car/>} />
          <Route path="/booking/step2" element={<Booking />} />
          <Route path="/booking/payment" element={<Payment />} />
          <Route path="/booking/payment/booking-success" element={<BookingSuccess />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
=======
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
      <Routes>
        {/* صفحات بدون هيدر وفوتر */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* باقي الصفحات داخل الـ Layout */}
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
          path="/car"
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
    </BrowserRouter>
  );
};

export default App;
>>>>>>> f2bdbf85dde77f5d13f8c768064716a0fcbcb4d3
