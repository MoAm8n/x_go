import React, { useState } from 'react';
import CarDetailsCard from '../components/ui/CarDetailsCard';
import CarFilterSidebar from '../components/ui/CarFilterSidebar';
import carImg from '../assets/image.jpg';
// import { FilterState } from '../components/ui/CarFilterSidebar';

const CarCollection = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    selectedTypes: [],
    priceRange: [0, 0]
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <section>
      <div>
        <img
          src={carImg}
          alt="Car Collection"
          className="w-full lg:h-[706px] object-cover" 
          loading='lazy'
        />
      </div>
      <div className="container mx-auto py-4">
        <div className='w-full flex flex-col lg:flex-row gap-4'>
          <div className="">
            <CarFilterSidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="">
            <CarDetailsCard filters={filters} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarCollection;