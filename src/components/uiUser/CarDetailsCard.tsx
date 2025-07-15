import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCars } from "../../context/Data/DataUser";
import type { CarItem } from "../../context/Data/DataUser";
import type { FilterState } from "./CarFilterSidebar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

interface Props {
  filters: FilterState;
}

const CarDetailsCard: React.FC<Props> = ({ filters }) => {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCars = await getCars();
        const filteredCars = fetchedCars.filter(
          (car) =>
            (filters.selectedBrands.length === 0 ||
              (car.brandId && filters.selectedBrands.includes(car.brandId))) &&
            (filters.selectedTypes.length === 0 ||
              (car.type &&
                filters.selectedTypes.some(
                  (t) => t.toLowerCase() === car.type?.toLowerCase()
                ))) &&
            typeof car.price === "number" &&
            car.price >= filters.priceRange[0] &&
            car.price <= filters.priceRange[1]
        );
        setCars(filteredCars);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load car data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  // if (loading) {
  //     return <div className="p-4 text-center">Loading car details...</div>;
  // }

  // if (error) {
  //     return <div className="p-4 text-center text-red-500">{error}</div>;
  // }

  // if (cars.length === 0) {
  //     return <div className="p-4 text-center">No cars match the current filters.</div>;
  // }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
      {cars.map((car) => (
      <Link key={car.id} to={`/car/${car.id}`}>
        <div key={car.id} className="bg-[#FAF7F2] rounded-xl p-4">
          <div>
            {car.image && (
              <img
                src={car.image}
                alt={car.name || "Car image"}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
            )}
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold mb-2">
                {car.name || "Unnamed Car"}
              </h2>
              {car.brand && (
                <div className="bg-[#E5393533] w-16 h-7 rounded-2xl flex items-center justify-center text-sm">
                  {car.brand}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 lg:px-2 py-4">
              {car.type && (
                <div className="flex items-center gap-1 w-fit">
                  <AirlineSeatReclineExtraIcon fontSize="small" />
                  <span className="text-xs lg:text-sm">
                    {car.seats} seats
                  </span>
                </div>
              )}
              {car.seats && (
                <div className="flex items-center gap-1 w-fit">
                  <DirectionsCarIcon fontSize="small" />
                  <span className="text-xs lg:text-sm">{car.type}</span>
                </div>
              )}
              {car.transmission && (
                <div className="flex items-center gap-1 w-fit">
                  <EarbudsIcon fontSize="small" />
                  <span className="text-xs lg:text-sm">{car.transmission}</span>
                </div>
              )}
              {car.fuel && (
                <div className="flex items-center gap-1 w-fit">
                  <LocalGasStationIcon fontSize="small" />
                  <span className="text-xs lg:text-sm">{car.fuel}</span>
                </div>
              )}
            </div>
            {car.price && (
              <div className="mt-4 flex items-center justify-between lg:px-2">
                <p className="font-bold text-lg text-[#E6911E]">
                  $
                  {typeof car.price === "number"
                    ? car.price.toLocaleString()
                    : car.price}
                  <span className="font-medium text-black text-base ml-1">
                    / Per Day
                  </span>
                </p>
                  <button className="border border-[#E6911E] rounded-full flex items-center justify-center h-10 w-10 hover:bg-[#E6911E] hover:text-white transition-colors">
                    <ArrowOutwardIcon fontSize="small" />
                  </button>
              </div>
            )}
          </div>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default CarDetailsCard;
