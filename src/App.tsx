import { Route, Routes, Navigate } from 'react-router-dom'
import { Car, CarCollection, SignIn, SignUp, Payment, BookingSuccess, Loading, Bookings } from './pages'
import Header from './components/Header'
import Footer from './components/Footer'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const App = () => {
  const location = useLocation()

  useEffect(() => {
    // تنظيف بيانات الحجز المؤقتة عند الخروج من صفحة الحجز
    if (!location.pathname.includes('/booking') && 
        !location.pathname.includes('/signin') && 
        !location.pathname.includes('/signup')) {
      localStorage.removeItem('tempBookingData')
    }
  }, [location])

  // تحقق إذا كانت الصفحة الحالية هي SignIn أو SignUp
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup'

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="main-content">
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
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </>
  )
}

export default App