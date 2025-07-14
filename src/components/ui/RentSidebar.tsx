import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { CarItem } from "../../context/Data/DataUser";
import { getCars } from "../../context/Data/DataUser";
import { useParams } from "react-router-dom";

interface ExtraItem {
  label: string;
  price: number;
}

const extrasList: ExtraItem[] = [
  { label: "GPS Navigation System", price: 55 },
  { label: "Child Seat", price: 55 },
  { label: "Additional Driver", price: 55 },
  { label: "Insurance Coverage", price: 55 },
];

const RentSidebar: React.FC = () => {
  const [car, setCar] = useState<CarItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [dropoffDate, setDropoffDate] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const carList = await getCars(Number(id));
        setCar(carList[0] || null);
      } catch (err) {
        setError("Failed to load car details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleCheckbox = (idx: number) => {
    setSelectedExtras((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const calculateTotal = () => {
    if (!car?.price) return 0;
    
    const tax = 50;
    const basePrice = typeof car.price === 'number' ? car.price : parseFloat(car.price);
    const extrasTotal = selectedExtras.reduce(
      (sum, idx) => sum + extrasList[idx].price, 0
    );
    
    return basePrice + tax + extrasTotal;
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (!car) return <div className="text-center py-4">Car not found</div>;

  return (
    <div className="gap-5 border border-[#cdcac5] border-opacity-30 rounded-xl shadow mt-10 p-6 w-full mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4">
        Rent This Vehicle
      </h2>
      
      {/* Date Pickers */}
      <div className="mb-4 flex items-center justify-between">
        <label htmlFor="pickup-date" className="block text-sm font-medium mb-1">
          Pick-Up
        </label>
        <div className="relative">
          <input
            id="pickup-date"
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: "#cdcac5" }}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <label htmlFor="dropoff-date" className="block text-sm font-medium mb-1">
          Drop-Off
        </label>
        <div className="relative">
          <input
            id="dropoff-date"
            type="date"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: "#cdcac5" }}
            min={pickupDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Extras */}
      <div className="mb-4">
        <span className="block text-sm font-bold mb-3">Add Extra:</span>
        <div className="space-y-4 mb-5">
          {extrasList.map((extra, idx) => (
            <label
              key={extra.label}
              className={`flex items-center justify-between text-sm rounded-lg cursor-pointer font-bold`}
              htmlFor={`extra-${idx}`}
            >
              <span className="flex items-center">
                <input
                  id={`extra-${idx}`}
                  type="checkbox"
                  checked={selectedExtras.includes(idx)}
                  onChange={() => handleCheckbox(idx)}
                  className={`
                    w-4 h-4 mr-2
                    rounded border
                    focus:ring-0 focus:ring-offset-0
                    ${selectedExtras.includes(idx)
                      ? 'bg-[#E6911E] border-[#E6911E]'
                      : 'border-[#aaa9a8]'
                    }
                    transition-colors duration-200
                  `}
                />
                {extra.label}
              </span>
              <span className="font-medium">${extra.price.toFixed(2)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-gray-200 pt-4 text-sm space-y-1">
        <div className="flex justify-between items-center">
          <span>Sub Total</span>
          <p className="font-medium text-lg text-[#E6911E]">
            ${typeof car.price === 'number' 
              ? car.price.toLocaleString() 
              : parseFloat(car.price).toLocaleString()}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span>Tax</span>
          <span>$50.00</span>
        </div>
        {selectedExtras.length > 0 && (
          <div className="flex justify-between">
            <span>Extras</span>
            <span>
              ${selectedExtras.reduce(
                (sum, idx) => sum + extrasList[idx].price, 0
              ).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-base">
          <span>Total Payable</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <Link
        to="/booking/step2"
        className="w-full block bg-[#E6911E] hover:bg-[#E6911E]/90 font-semibold py-2 rounded-xl mt-2 transition text-center text-white"
        state={{
          car,
          selectedExtras: selectedExtras.map(idx => extrasList[idx]),
          pickupDate,
          dropoffDate,
          total: calculateTotal()
        }}
      >
        Book Now
      </Link>
    </div>
  );
};

export default RentSidebar;