import axios from 'axios';
import { API_URL } from '../api/Api';

const apiClient = axios.create({
  baseURL: API_URL
});

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface SignUpData {
  name: string;
  last_name?: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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
export const signupUser = async (userData: SignUpData): Promise<AuthResponse> => {
  try {
    if (userData.password !== userData.password_confirmation) {
      throw new Error('كلمة المرور غير متطابقة');
    }

    const response = await apiClient.post(
      '/api/user/register',
      {
        name: userData.name,
        last_name: userData.last_name || "user",
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.data.token || !response.data.user) {
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }

    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      
      if (error.response?.status === 400) {
        throw new Error('هذا البريد الإلكتروني مستخدم بالفعل');
      }
      if (error.response?.status === 401) {
        throw new Error('بيانات التسجيل غير صحيحة');
      }
      
      throw new Error(errorMessage);
    }
    throw new Error('حدث خطأ غير متوقع أثناء التسجيل');
  }
};

export const authUsers = async (credentials: SignInData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post(
      '/api/user/login',
      {
        email: credentials.email,
        password: credentials.password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.data.token || !response.data.user) {
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }

    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      
      if (error.response?.status === 401) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
      
      throw new Error(errorMessage);
    }
    throw new Error('حدث خطأ غير متوقع أثناء تسجيل الدخول');
  }
};

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  try{
    const response = await apiClient.post('/api/user/forgot-password', {email});
    if(!response.data?.message){
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }
    return response.data;
  }catch(error){
    console.error('Error sending email:', error);
    throw new Error('حدث خطأ غير متوقع أثناء إرسال البريد الإلكتروني');
  }
};  

export const logoutUser = async (): Promise<AuthResponse> => {
  try{
    const response = await apiClient.post('/api/user/logout', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if(!response.data?.message){
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    apiClient.defaults.headers.common['Authorization'] = '';
    window.location.href = '/';
    return response.data;
  }catch(error){
    console.error('Error sending email:', error);
    throw new Error('حدث خطأ غير متوقع أثناء إرسال البريد الإلكتروني');
  }
};

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    if (!response.data?.brands) {
        throw new Error('No brands data available');
    }

    return response.data.brands.map((brand: { id: number; attributes: { name: string; logo: string } }) => ({
      id: Number(brand.id) || 0,
      name: brand.attributes?.name || '',
      logo: brand.attributes?.logo || ''
    }));
  } catch (error) {
    console.error('خطأ في جلب العلامات التجارية:', error);
    return [];
  }
};

export const getTypes = async (): Promise<Type[]> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    if (!response.data?.types) {
      throw new Error('No types data available');
    }
    
    return response.data.types.map((type: { name: string }) => ({
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
      .map((item: {
        id: string;
        relationship?: {
          Brand?: { brand_name?: string; brand_id?: number };
          Types?: { type_name?: string };
          ['Model Names']?: { model_name?: string };
        };
        attributes?: {
          image?: string;
          seats_count?: number;
          seat_type?: string;
          transmission_type?: string;
          engine_type?: string;
          price?: number;
          year?: number;
        };
      }) => ({
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
        type: item.relationship?.Types?.type_name || '',
        year: Number(item.attributes?.year) || 0
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
    console.error('Error fetching cars:', error);    return [];
  }
};
export const showCarId = async (id: string): Promise<CarItem> => {
  try {
    const response = await apiClient.get(`/api/user/Model/${id}`);
    if(!response.data?.data){
      throw new Error('Car data not found in response');
    }
    const item: {
      id: string;
      relationship?: {
        Brand?: { brand_name?: string; brand_id?: number };
        Types?: { type_name?: string };
        ['Model Names']?: { model_name?: string };
      };
      attributes?: {
        image?: string;
        seats_count?: number;
        seat_type?: string;
        transmission_type?: string;
        engine_type?: string;
        price?: number;
        year?: number;
      };
    } = response.data.data;
    return {
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
    };
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
};