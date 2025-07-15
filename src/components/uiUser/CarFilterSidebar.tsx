import React, { useState, useEffect, useCallback } from "react";
import {
  getBrands,
  getTypes,
  getPriceRange,
  getCars,
} from "../../context/Data/DataUser";
import type { CarItem } from "../../context/Data/DataUser";
import {
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
} from "@mui/material";

export interface Brand {
  id: number;
  name: string;
  logo: string;
  carCount: number;
}

export interface Type {
  name: string;
}

interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  selectedBrands: number[];
  selectedTypes: string[];
  priceRange: [number, number];
}

interface Props {
  onFilterChange: (filters: FilterState) => void;
}

const CarFilterSidebar: React.FC<Props> = ({ onFilterChange }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allBrandsSelected, setAllBrandsSelected] = useState(false);
  const [allTypesSelected, setAllTypesSelected] = useState(false);
  const [cars, setCars] = useState<CarItem[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    selectedTypes: [],
    priceRange: [0, 0],
  });

  useEffect(() => {
    if (brands.length === 0) return;
    setAllBrandsSelected(filters.selectedBrands.length === brands.length);
  }, [filters.selectedBrands, brands.length]);

  useEffect(() => {
    if (types.length === 0) return;
    setAllTypesSelected(filters.selectedTypes.length === types.length);
  }, [filters.selectedTypes, types.length]);

  const toggleAllBrands = useCallback(
    (checked: boolean) => {
      setFilters((prev) => ({
        ...prev,
        selectedBrands: checked ? brands.map((b) => b.id) : [],
      }));
      setAllBrandsSelected(checked);
    },
    [brands]
  );

  const toggleAllTypes = useCallback(
    (checked: boolean) => {
      setFilters((prev) => ({
        ...prev,
        selectedTypes: checked ? types.map((t) => t.name) : [],
      }));
      setAllTypesSelected(checked);
    },
    [types]
  );

  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [brandsData, typesData, priceData, carsData] = await Promise.all([
        getBrands(),
        getTypes(),
        getPriceRange(),
        getCars(),
      ]);

      setBrands(brandsData);
      setTypes(typesData);
      setPriceRange(priceData);
      setCars(carsData);

      setFilters({
        selectedBrands: brandsData.map((b) => b.id),
        selectedTypes: typesData.map((t) => t.name),
        priceRange: priceData ? [priceData.min, priceData.max] : [0, 0],
      });
    } catch (error) {
      console.error("Failed to load filters:", error);
      setError("Failed to load filter options. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleBrandToggle = useCallback((brandId: number) => {
    setFilters((prev) => {
      const newBrands = prev.selectedBrands.includes(brandId)
        ? prev.selectedBrands.filter((b) => b !== brandId)
        : [...prev.selectedBrands, brandId];
      return { ...prev, selectedBrands: newBrands };
    });
  }, []);

  const handleTypeToggle = useCallback((typeName: string) => {
    setFilters((prev) => {
      const newTypes = prev.selectedTypes.includes(typeName)
        ? prev.selectedTypes.filter((t) => t !== typeName)
        : [...prev.selectedTypes, typeName];
      return { ...prev, selectedTypes: newTypes };
    });
  }, []);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!priceRange) return;

      const value = Number(e.target.value);
      setFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], value],
      }));
    },
    [priceRange]
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      selectedBrands: [],
      selectedTypes: [],
      priceRange: priceRange ? [priceRange.min, priceRange.max] : [0, 0],
    });
  }, [priceRange]);

  const getCarCountForBrand = (brandId: number) => {
    return cars.filter((car) => car.brandId === brandId).length;
  };

  const getCarCountForType = (typeName: string) => {
    return cars.filter(
      (car) => car.type?.toLowerCase() === typeName.toLowerCase()
    ).length;
  };

  const totalCarsCount = cars.length;

  // if (loading) {
  //   return (
  //     <div className="p-6 text-center">
  //       <CircularProgress color="primary" />
  //       <p className="mt-3">Loading filter options...</p>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="w-full p-6 text-center text-red-500">
        {error}
        <Button variant="outlined" onClick={fetchFilterOptions} sx={{ mt: 2 }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <aside className="sticky top-0 w-full">
      <div className="p-6 w-full max-w-lg min-w-[350px] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button
            onClick={clearAllFilters}
            disabled={
              filters.selectedBrands.length === 0 &&
              filters.selectedTypes.length === 0 &&
              filters.priceRange[1] === (priceRange?.max || 0)
            }
            size="small"
          >
            Clear All
          </Button>
        </div>

        <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Car Brands</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <div className="flex justify-between items-center w-full">
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allBrandsSelected}
                        indeterminate={
                          filters.selectedBrands.length > 0 &&
                          filters.selectedBrands.length < brands.length
                        }
                        onChange={(e) => toggleAllBrands(e.target.checked)}
                      />
                    }
                    label={
                      <div className="flex items-center gap-2">
                        <span>All Brands</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {brands.length}
                        </span>
                      </div>
                    }
                  />
                </div>
                <span className="text-xs bg-[#f6d1cc] px-2 py-0.5 rounded-full text-gray-700 font-bold">
                  {totalCarsCount}
                </span>
              </div>
            </li>

            {brands.map((brand) => (
              <li key={brand.id} className="flex items-center justify-between">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                    />
                  }
                  label={
                    <div className="flex items-center gap-2">
                      <span>{brand.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {getCarCountForBrand(brand.id)}
                      </span>
                    </div>
                  }
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Filter Price</h3>
          {priceRange && (
            <>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange[1]}
                onChange={handlePriceChange}
                className="w-full accent-[#E6911E] cursor-pointer"
                aria-label="Price range"
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className="bg-gray-100 px-2 py-1 rounded-lg font-bold">
                  ${priceRange.min.toLocaleString()}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg font-bold">
                  ${filters.priceRange[1].toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Car Types</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <div className="flex justify-between items-center w-full">
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allTypesSelected}
                        indeterminate={
                          filters.selectedTypes.length > 0 &&
                          filters.selectedTypes.length < types.length
                        }
                        onChange={(e) => toggleAllTypes(e.target.checked)}
                      />
                    }
                    label={
                      <div className="flex items-center gap-2">
                        <span>All Types</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {types.length}
                        </span>
                      </div>
                    }
                  />
                </div>
                <span className="text-xs bg-[#f6d1cc] px-2 py-0.5 rounded-full text-gray-700 font-bold">
                  {totalCarsCount}
                </span>
              </div>
            </li>

            {types.map((type) => (
              <li key={type.name} className="flex items-center justify-between">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.selectedTypes.includes(type.name)}
                      onChange={() => handleTypeToggle(type.name)}
                    />
                  }
                  label={
                    <div className="flex items-center gap-2">
                      <span>{type.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {getCarCountForType(type.name)}
                      </span>
                    </div>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default CarFilterSidebar;
