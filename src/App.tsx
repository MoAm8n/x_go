import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components'
import  Footer  from './components/ui/Footer'
import { Loading, CarCollection, Car } from './pages'
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
          <Route path="/car/:id" element={<Car/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App