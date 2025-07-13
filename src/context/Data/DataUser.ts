import axios from 'axios';
import { API_URL } from '../api/Api';

const apiClient = axios.create({
  baseURL: API_URL
});

interface Brand {
  id: number;
  name: string;
  logo: string;
}

interface CarItem {
  id: number;
  image: string;
  name: string;
  price: number;
  year?: string;
  engine_type?: string;
  brand_id?: number;
  brand_name?: string;
  type_name?: string;
}

// دالة لجلب العلامات التجارية
export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    if (!response.data?.brands) {
      throw new Error('لا توجد بيانات للعلامات التجارية');
    }

    return response.data.brands.map((brand: any) => ({
      id: Number(brand.id) || 0,
      name: brand.attributes?.name || '',
      logo: brand.attributes?.logo || ''
    }));
  } catch (error) {
    console.error('خطأ في جلب العلامات التجارية:', error);
    return [];
  }
};

// دالة لجلب السيارات مع إمكانية التصفية حسب العلامة التجارية
export const getCars = async (brandId?: number): Promise<CarItem[]> => {
  try {
    const response = await apiClient.post('/api/user/Home');
    
    if (!response.data?.data) {
      throw new Error('لا توجد بيانات للسيارات');
    }

    return response.data.data.map((item: any) => ({
      id: Number(item.id) || 0,
      image: item.attributes?.image || '',
      name: item.relationship?.model_name,
      price: Number(item.attributes?.price) || 0,
      year: item.attributes?.year,
      engine_type: item.attributes?.engine_type,
      brand_id: Number(item.relationship?.Brand?.brand_id) || 0,
      brand_name: item.relationship?.Brand?.brand_name,
      type_name: item.relationship?.Types?.type_name
    })).filter((car: CarItem) => 
      brandId ? car.brand_id === brandId : true
    );
  } catch (error) {
    console.error('خطأ في جلب السيارات:', error);
    return [];
  }
};