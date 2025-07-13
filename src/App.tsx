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