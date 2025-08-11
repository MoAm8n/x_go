import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CarDetailsCard from '../components/uiUser/CarDetailsCard';
import CarFilterSidebar from '../components/uiUser/CarFilterSidebar';
import carImg from '../assets/image.jpg';
import type { FilterState } from '../components/uiUser/CarFilterSidebar';
import { CircularProgress, Pagination } from '@mui/material';
import type { CarItem } from '../context/Data/DataUser';

const CarCollection = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    selectedTypes: [],
    priceRange: [0, 0],
  });

  const [cars, setCars] = useState<CarItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6;

  const fetchCars = useCallback(async (page: number, filters: FilterState) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://xgo.mlmcosmo.com/api/user/Home`, {
        params: {
          page,
          per_page: itemsPerPage,
          brands: filters.selectedBrands.join(','),
          types: filters.selectedTypes.join(','),
          min_price: filters.priceRange[0],
          max_price: filters.priceRange[1]
        }
      });

      const { data, meta } = response.data;
      const mappedData: CarItem[] = (data || []).map((item: any) => ({
        id: String(item.id) || '',
        name: item.relationships?.model_names?.model_name || item.attributes?.model_name || '',
        image: item.attributes?.image || carImages[0] || '',
        brand: item.relationships?.brand?.brand_name || item.attributes?.brand || '',
        brandId: Number(item.relationships?.brand?.brand_id) || 0,
        seats: item.attributes?.seats_count || 0,
        luggage: item.attributes?.seat_type || '',
        transmission: item.attributes?.transmission_type || '',
        fuel: item.attributes?.engine_type || '',
        price: Number(item.attributes?.price) || 0,
        type: item.relationships?.types?.type_name || '',
        year: String(item.attributes?.year || '2020'),
      }));
      setCars(mappedData);
      setCurrentPage(meta.current_page);
      setTotalPages(meta.last_page);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars(currentPage, filters);
  }, [currentPage, filters, fetchCars]);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <section>
      <div>
        <img
          src={carImg}
          alt="Car Collection"
          className="w-full lg:h-[706px] object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="container mx-auto py-4">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="md:w-2/4 lg:w-1/4">
            <CarFilterSidebar 
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }} 
            />
          </div>
          
          <div className="md:w-2/4 lg:w-3/4">
            {isLoading ? (
              <div className="flex justify-center my-8">
                <CircularProgress />
              </div>
            ) : (
              <>
                <CarDetailsCard cars={cars} filters={filters} />
                
                <div className="flex justify-center mt-8">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#e6911e',
                        border: '1px solid #e6911e',
                      },
                      '& .MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: '#e6911e',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#d6820e',
                        },
                      },
                    }}
                    />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarCollection;