import React, { useState, useEffect } from "react";
import CarDetailsTabs from "../components/uiUser/CarDetailsTabs";
import RentSidebar from "../components/uiUser/RentSidebar";
import carImg from "../assets/image.jpg";
import { useParams } from "react-router-dom";
import { getCars, showCarId } from "../context/Data/DataUser";
import type { CarItem } from "../context/Data/DataUser";
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EarbudsIcon from '@mui/icons-material/Earbuds';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { Link } from 'react-router-dom';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useNavigate } from 'react-router-dom';

const Car: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarItem | null>(null);
  const [relatedCars, setRelatedCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error("No car ID provided");
        }

        const [carData, allCars] = await Promise.all([
          showCarId(id),
          getCars()
        ]);
        
        setCar(carData);
        
        const filteredCars = allCars.filter(c => 
          c.id !== id && 
          (c.type === carData.type || c.brandId === carData.brandId)
        ); 
        const randomCars = filteredCars.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRelatedCars(randomCars);
      } catch (err) {
        console.error('Error fetching car data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load car details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#E6911E] text-white px-4 py-2 rounded-lg hover:bg-[#D6820E] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-lg mb-4">Car not found</p>
        <Link 
          to="/" 
          className="bg-[#E6911E] text-white px-4 py-2 rounded-lg hover:bg-[#D6820E] transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 flex flex-col bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 md:px-8">
        <div className="max-w-6xl mx-auto mt-10 gap-10">
          {/* Car Images Section */}
          <section className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="lg:w-[70%]">
              <img
                src={car.image || carImg}
                alt={car.name || 'Car'}
                className="w-full h-auto max-h-[480px] rounded-3xl object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="lg:w-[30%] flex flex-col gap-2 mt-16">
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    src={car.image || carImg}
                    alt={`${car.name || 'Car'} thumbnail ${i}`}
                    className="h-32 w-full object-cover rounded-lg cursor-pointer"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Car Details and Booking Section */}
          <section className="flex flex-col lg:flex-row w-full gap-6 mt-8">
            {/* Car Details */}
            <div className="flex flex-col my-6 lg:w-[70%] bg-white p-6 rounded-xl shadow-sm">
              <div className='flex justify-between items-center mb-4'>
                <h2 className="text-2xl font-bold">{car.name || 'Unnamed Car'}</h2>
                {car.brand && (
                  <div className='bg-[#E5393533] px-4 py-1 rounded-2xl flex items-center justify-center text-sm font-medium'>
                    {car.brand}
                  </div>
                )}
              </div>
              
              {/* Car Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                {car.type && (
                  <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                    <DirectionsCarIcon fontSize="small"/>
                    <span className="font-medium text-sm">{car.type}</span>
                  </div>
                )}
                {car.seats && (
                  <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                    <AirlineSeatReclineExtraIcon fontSize="small"/>
                    <span className="text-sm">{car.seats} seats</span>
                  </div>
                )}
                {car.transmission && (
                  <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                    <EarbudsIcon fontSize="small"/>
                    <span className="text-sm">{car.transmission}</span>
                  </div>
                )}
                {car.fuel && (
                  <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                    <LocalGasStationIcon fontSize="small"/>
                    <span className="text-sm">{car.fuel}</span>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <CarDetailsTabs car={car} />
              </div>
            </div>

            <div className="lg:w-[30%]">
              {id && <RentSidebar car={car} carId={id} />}
            </div>
          </section>

          <section className="max-w-6xl mx-auto mt-12 mb-10">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar) => (
                <Link key={relatedCar.id} to={`/car/${relatedCar.id}`} className="hover:no-underline">
                  <div className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div>
                      <img
                        src={relatedCar.image || carImg}
                        alt={relatedCar.name || 'Car image'}
                        className="w-full h-48 object-cover mb-4 rounded-lg"
                      />
                      <div className='flex justify-between items-center px-2'>
                        <h2 className="text-xl font-bold mb-2">{relatedCar.name || 'Unnamed Car'}</h2>
                        {relatedCar.brand && (
                          <div className='bg-[#E5393533] px-3 py-1 rounded-2xl flex items-center justify-center text-sm'>
                            {relatedCar.brand}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 lg:px-2 px-2 py-4">
                        {relatedCar.type && (
                          <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                            <DirectionsCarIcon fontSize="small"/>
                            <span className="font-medium text-sm">{relatedCar.type}</span>
                          </div>
                        )}
                        {relatedCar.seats && (
                          <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                            <AirlineSeatReclineExtraIcon fontSize="small"/>
                            <span className="text-sm">{relatedCar.seats} seats</span>
                          </div>
                        )}
                        {relatedCar.transmission && (
                          <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                            <EarbudsIcon fontSize="small"/>
                            <span className="text-sm">{relatedCar.transmission}</span>
                          </div>
                        )}
                        {relatedCar.fuel && (
                          <div className='flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-xl'>
                            <LocalGasStationIcon fontSize="small"/>
                            <span className="text-sm">{relatedCar.fuel}</span>
                          </div>
                        )}
                      </div>
                      {relatedCar.price && (
                        <div className="mt-4 flex items-center justify-between px-2">
                          <p className="font-bold text-lg text-[#E6911E]">
                            ${typeof relatedCar.price === 'number' 
                              ? relatedCar.price.toLocaleString() 
                              : relatedCar.price}
                            <span className='font-medium text-black text-base ml-1'> / day</span>
                          </p>
                          <button className='border border-[#E6911E] rounded-full flex items-center justify-center h-10 w-10 hover:bg-[#E6911E] hover:text-white transition-colors'>
                            <ArrowOutwardIcon fontSize="small" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Car;