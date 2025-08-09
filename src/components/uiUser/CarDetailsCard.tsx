import React from "react";
import { Link } from "react-router-dom";
import type { CarItem } from "../../context/Data/DataUser";
import type { FilterState } from "./CarFilterSidebar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useTranslation } from "react-i18next";

interface Props {
  filters: FilterState;
  cars: CarItem[];
}

const CarDetailsCard: React.FC<Props> = ({ filters, cars }) => {
  const { t } = useTranslation();
  
  const filteredCars = cars.filter(
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      {filteredCars.map((car) => (
        <Link key={car.id} to={`/car/${car.id}`}>
          <div className="bg-[#FAF7F2] rounded-xl p-4">
            <div>
              {car.image && (
                <img
                  src={car.image}
                  alt={car.name || "Car image"}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                  loading="lazy"
                />
              )}
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-bold mb-2">
                  {t(`brand.${car.brand}`)|| "Unnamed Car"}
                </h2>
                {car.name && (
                  <div className="bg-[#E5393533] w-16 h-7 rounded-2xl flex items-center justify-center text-sm">
                    {t(`name.${car.name}`) || "Unnamed Model"}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 lg:px-2 py-4">
                {car.seats && (
                  <div className="flex items-center gap-2">
                    <AirlineSeatReclineExtraIcon fontSize="small" />
                    <span className="text-xs lg:text-sm">
                      {car.seats} {t('seats')}
                    </span>
                  </div>
                )}
                {car.type && (
                  <div className="flex items-center gap-2">
                    <DirectionsCarIcon fontSize="small" />
                    <span className="text-xs lg:text-sm">{t(`name.${car.type}`)}</span>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex items-center gap-2">
                    <EarbudsIcon fontSize="small" />
                    <span className="text-xs lg:text-sm">
                      {t(`type.${car.transmission}`)}
                    </span>
                  </div>
                )}
                {car.fuel && (
                  <div className="flex items-center gap-2">
                    <LocalGasStationIcon fontSize="small" />
                    <span className="text-xs lg:text-sm">{t(`Gasoline.${car.fuel}`)}</span>
                  </div>
                )}
              </div>
              {car.price && (
                <div className="mt-4 flex items-center justify-between lg:px-2">
                  <p className="font-bold text-lg text-[#E6911E]">
                    ${car.price.toLocaleString()}
                    <span className="font-medium text-black text-base ml-1">
                      / {t("Per Day")}
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
