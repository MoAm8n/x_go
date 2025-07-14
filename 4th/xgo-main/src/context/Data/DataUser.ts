import axios from 'axios';
import { API_URL } from '../api/Api';

const apiClient = axios.create({
  baseURL: API_URL
});

export interface Brand {
  id: number;
  name: string;
  logo: string;
  carCount: number;
}

export interface Type {
  name: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface CarItem {
  id: string;
  name: string;
  image?: string;
  brand?: string;
  brandId?: number;
  seats?: number;
  luggage?: string;
  transmission?: string;
  fuel?: string;
  price?: number | string;
  type?: string;
}

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    if (!response.data?.brands) {
      throw new Error('No brands data available');
    }

    return response.data.brands.map((brand: any) => ({
      id: Number(brand.id) || 0,
      name: brand.attributes?.name || '',
      logo: brand.attributes?.logo || '',
      carCount: brand.attributes?.car_count || 0 
    }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export const getTypes = async (): Promise<Type[]> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    if (!response.data?.types) {
      throw new Error('No types data available');
    }
    
    return response.data.types.map((type: any) => ({
      name: type.name || ''
    }));
  } catch (error) {
    console.error('Error fetching types:', error);
    return [];
  }
};

export const getPriceRange = async (): Promise<PriceRange> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    return {
      min: Number(response.data?.min_price) || 0,
      max: Number(response.data?.max_price) || 0
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 0 };
  }
};

export const getCars = async (
  brandId?: number,
  type?: string,
  priceRange?: [number, number]
): Promise<CarItem[]> => {
  try {
    const response = await apiClient.post('/api/user/Home', {});
    
    if (!response.data?.data) {
      throw new Error('No car data available');
    }

    return response.data.data
      .map((item: any) => ({
        id: String(item.id) || '',
        name: item.relationship?.['Model Names']?.model_name || '',
        image: item.attributes?.image || '',
        brand: item.relationship?.Brand?.brand_name || '',
        brandId: Number(item.relationship?.Brand?.brand_id) || 0,
        seats: item.attributes?.seats_count || 0,
        luggage: item.attributes?.seat_type || '',
        transmission: item.attributes?.transmission_type || '',
        fuel: item.attributes?.engine_type || '',
        price: Number(item.attributes?.price) || 0,
        type: item.relationship?.Types?.type_name || ''
      }))
      .filter((car: CarItem) => {
        const brandMatch = !brandId || car.brandId === brandId;
        const typeMatch = !type || car.type === type;
        const priceMatch = !priceRange || (
          typeof car.price === 'number' && 
          car.price >= priceRange[0] && 
          car.price <= priceRange[1]
        );
        return brandMatch && typeMatch && priceMatch;
      });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};