import React, { useState, useEffect } from "react";
import CarDetailsTabs from "../components/ui/CarDetailsTabs";
import RentSidebar from "../components/ui/RentSidebar";
import carImg from "../assets/image.jpg";
import { useParams } from "react-router-dom";
import { getCars } from "../context/Data/DataUser";
import type { CarItem } from "../context/Data/DataUser";
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EarbudsIcon from '@mui/icons-material/Earbuds';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { Link } from 'react-router-dom';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const Car: React.FC = () => {
  const { id } = useParams();
  const [car, setCar] = useState<CarItem | null>(null);
  const [relatedCars, setRelatedCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current car
        const carList = await getCars(Number(id));
        setCar(carList[0] || null);
        
        // Fetch all cars for related items
        const allCars = await getCars();
        // Exclude current car and get 3 random cars
        const filteredCars = allCars.filter(c => c.id !== Number(id));
        const randomCars = filteredCars.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRelatedCars(randomCars);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!car) {
    return <div className="min-h-screen flex items-center justify-center">Car not found</div>;
  }

  return (
    <div className="min-h-screen pb-10 flex flex-col">
      <main className="container mx-auto px-2 sm:px-4 md:px-8">
        <div className="max-w-6xl mx-auto mt-10 gap-10">
          {/* Main Car Image and Thumbnails */}
          <section className="flex-1 flex flex-col md:flex-row gap-4">
            <img
              src={car.image || carImg}
              alt={car.name || 'Car'}
              className="lg:w-[780px] lg:h-[480px] w-full object-cover rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2 my-auto">
              {[...Array(6)].map((_, i) => (
                <img
                  key={i}
                  src={car.image || carImg}
                  alt={`${car.name || 'Car'} thumbnail ${i}`}
                  className="h-32 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          </section>

          {/* Car Details Section */}
          <section className="flex flex-col lg:flex-row w-full lg:gap-6 mt-6">
            <div className="flex flex-col my-6 lg:w-3/4">
              <div className='flex justify-between items-center px-4'>
                <h2 className="text-xl font-bold mb-2">{car.name || 'Unnamed Car'}</h2>
                {car.brand && (
                  <div className='bg-[#E5393533] w-16 h-7 rounded-2xl flex items-center justify-center text-sm'>
                    {car.brand}
                  </div>
                )}
              </div>
              
              {/* Car Features */}
              <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-4 lg:gap-10 gap-2 mx-auto lg:px-4 py-4">
                {car.type && (
                  <div className='flex items-center gap-1 bg-[#E5393533] lg:w-fit px-4 py-3 rounded-2xl'>
                    <DirectionsCarIcon fontSize="small"/>
                    <span className="font-medium text-sm">{car.type}</span>
                  </div>
                )}
                {car.seats && (
                  <div className='flex items-center gap-1 bg-[#E5393533] lg:w-fit px-4 py-3 rounded-2xl'>
                    <AirlineSeatReclineExtraIcon fontSize="small"/>
                    <span className="text-sm">{car.seats} seats</span>
                  </div>
                )}
                {car.transmission && (
                  <div className='flex items-center gap-1 bg-[#E5393533] lg:w-fit px-4 py-3 rounded-2xl'>
                    <EarbudsIcon fontSize="small"/>
                    <span className="text-sm">{car.transmission}</span>
                  </div>
                )}
                {car.fuel && (
                  <div className='flex items-center gap-1 bg-[#E5393533] lg:w-fit px-4 py-3 rounded-2xl'>
                    <LocalGasStationIcon fontSize="small"/>
                    <span className="text-sm">{car.fuel}</span>
                  </div>
                )}
              </div>
              
              {/* Tabs Section */}
              <div className="flex flex-col gap-6">
                <CarDetailsTabs />
              </div>
            </div>
            
            {/* Rental Sidebar */}
            <div className="lg:w-1/4">
              <RentSidebar />
            </div>
          </section>
        </div>

        {/* Related Cars Section */}
        <section className="max-w-6xl mx-auto mt-10 mb-10">
          <h2 className="text-xl font-bold mb-6">You May Also Like These</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {relatedCars.map((car) => (
              <div key={car.id} className="bg-[#FAF7F2] rounded-xl p-4 hover:shadow-md transition-shadow">
                <div>
                  <img
                    src={car.image || carImg}
                    alt={car.name || 'Car image'}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                  <div className='flex justify-between items-center px-2'>
                    <h2 className="text-xl font-bold mb-2">{car.name || 'Unnamed Car'}</h2>
                    {car.brand && (
                      <div className='bg-[#E5393533] w-16 h-7 rounded-2xl flex items-center justify-center text-sm'>
                        {car.brand}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 lg:px-2 py-4">
                    {car.type && (
                      <div className='flex items-center gap-1'>
                        <DirectionsCarIcon fontSize="small"/> 
                        <span className="font-medium text-sm">{car.type}</span>
                      </div>
                    )}
                    {car.seats && (
                      <div className='flex items-center gap-1'>
                        <AirlineSeatReclineExtraIcon fontSize="small"/>
                        <span className="text-sm">{car.seats} seats</span>
                      </div>
                    )}
                    {car.transmission && (
                      <div className='flex items-center gap-1'>
                        <EarbudsIcon fontSize="small"/>
                        <span className="text-sm">{car.transmission}</span>
                      </div>
                    )}
                    {car.fuel && (
                      <div className='flex items-center gap-1'>
                        <LocalGasStationIcon fontSize="small"/>
                        <span className="text-sm">{car.fuel}</span>
                      </div>
                    )}
                  </div>
                  {car.price && (
                    <div className="mt-4 flex items-center justify-between lg:px-2">
                      <p className="font-bold text-lg text-[#E6911E]">
                        ${typeof car.price === 'number' ? car.price.toLocaleString() : car.price}
                        <span className='font-medium text-black text-base ml-1'> / Per Day</span>
                      </p>
                      <Link to={`/car/${car.id}`}>
                        <button className='border border-[#E6911E] rounded-full flex items-center justify-center h-10 w-10 hover:bg-[#E6911E] hover:text-white transition-colors'>
                          <ArrowOutwardIcon fontSize="small" />
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Car;