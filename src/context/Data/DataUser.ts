import axios from 'axios';
import { API_URL } from '../api/Api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tokenUser');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleUnauthorized = () => {
  if (localStorage.getItem('tokenUser')) {
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('user');
    apiClient.defaults.headers.common['Authorization'] = '';
    window.location.href = '/signin';
  }
};

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
  carCount?: number;
}

export interface Type {
  name: string;
  id: number;
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

export interface BookingData {
  start_date: string;
  end_date: string;
  carmodel_id: string;
  user_id?: string;
  additional_driver: number;
  location: string;
  location_id?: number;
  final_price?: string;
}

export interface BookingItem {
  id: number;
  user_id: number;
  carmodel_id: number;
  start_date: string;
  end_date: string;
  final_price: string;
  status: string;
  additional_driver: number;
  car_model: {
    id: number;
    attributes: {
      year: string;
      price: string;
      engine_type: string;
      transmission_type: string;
      seats_count: number;
      image?: string;
    };
    relationship: {
      Brand?: {
        brand_id: number;
        brand_name: string;
      };
      Types?: {
        type_id: number;
        type_name: string;
      };
      Model_Names?: {
        model_name_id: number;
        model_name: string;
      };
    };
  };
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transaction_id?: string;
  iframe_url?: string;
  payment_token?: string;
}

export interface Location {
  id?: number;
  user_id?: number;
  location: string;
  latitude: string;
  longitude: string;
  is_active: number;
}

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    console.log("جارٍ التحقق من البريد الإلكتروني:", email);
    const response = await axios.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data?.exists || false;
  } catch (error) {
    console.error('خطأ في التحقق من البريد الإلكتروني:', error);
    return false;
  }
};

export const signupUser = async (userData: SignUpData): Promise<AuthResponse> => {
  try {
    if (userData.password !== userData.password_confirmation) {
      throw new Error('كلمة المرور غير متطابقة');
    }

    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
    }

    console.log("جارٍ تسجيل مستخدم جديد:", userData.email);
    const response = await apiClient.post('/api/user/register', {
      name: userData.name,
      last_name: userData.last_name || 'user',
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      password_confirmation: userData.password_confirmation,
    });

    if (response.status === 409) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
    }

    if (!response.data?.token || !response.data?.user) {
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }

    localStorage.setItem('tokenUser', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      console.error("خطأ أثناء التسجيل:", errorMessage);
      if (error.response?.status === 400) {
        throw new Error('بيانات التسجيل غير صالحة');
      }
      if (error.response?.status === 401) {
        handleUnauthorized();
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      }
      if (error.response?.status === 409) {
        throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
      }
      throw new Error(errorMessage);
    }
    throw new Error('حدث خطأ غير متوقع أثناء التسجيل');
  }
};

export const authUsers = async (credentials: SignInData): Promise<AuthResponse> => {
  try {
    console.log("جارٍ تسجيل الدخول:", credentials.email);
    const response = await apiClient.post('/api/user/login', {
      email: credentials.email,
      password: credentials.password,
    });

    if (!response.data?.token || !response.data?.user) {
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }

    localStorage.setItem('tokenUser', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      console.error("خطأ أثناء تسجيل الدخول:", errorMessage);
      if (error.response?.status === 401) {
        throw new Error('هل نسيت كلمة السر');
      }
      throw new Error(errorMessage);
    }
    throw new Error('حدث خطأ غير متوقع أثناء تسجيل الدخول');
  }
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    console.log("جارٍ إرسال طلب إعادة تعيين كلمة المرور:", email);
    const response = await apiClient.post('/api/user/forgot-password', { email });
    if (!response.data?.message) {
      throw new Error('لم يتم استلام رسالة من الخادم');
    }
    return { message: response.data.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور:", error);
      if (error.response?.status === 401) {
        handleUnauthorized();
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      }
      throw new Error(error.response?.data?.message || 'حدث خطأ أثناء إرسال البريد الإلكتروني');
    }
    throw new Error('حدث خطأ غير متوقع أثناء إرسال البريد الإلكتروني');
  }
};

export const logoutUser = async (): Promise<{ message: string }> => {
  try {
    console.log("جارٍ تسجيل الخروج");
    const response = await apiClient.post('/api/user/logout');
    handleUnauthorized();
    return { message: response.data?.message || 'تم تسجيل الخروج بنجاح' };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
      return { message: 'تم تسجيل الخروج (بسبب انتهاء صلاحية الجلسة)' };
    }
    console.error('خطأ أثناء تسجيل الخروج:', error);
    throw new Error('حدث خطأ غير متوقع أثناء تسجيل الخروج');
  }
};

export const getBrands = async (): Promise<Brand[]> => {
  try {
    console.log("جارٍ جلب العلامات التجارية");
    const response = await apiClient.get('/api/user/filter-Info');
    if (!response.data?.brands) {
      throw new Error('لا توجد بيانات للعلامات التجارية');
    }
    return response.data.brands.map((brand: { id: number; attributes: { name: string; logo: string } }) => ({
      id: Number(brand.id) || 0,
      name: brand.attributes?.name || '',
      logo: brand.attributes?.logo || '',
      carCount: brand.attributes?.carCount || 0,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
      throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
    }
    console.error('خطأ في جلب العلامات التجارية:', error);
    return [];
  }
};

export const getTypes = async (): Promise<Type[]> => {
  try {
    console.log("جارٍ جلب أنواع السيارات");
    const response = await apiClient.get('/api/user/filter-Info');
    if (!response.data?.types) {
      throw new Error('لا توجد بيانات لأنواع السيارات');
    }
    return response.data.types.map((type: { name: string; id: number }) => ({
      name: type.name || '',
      id: type.id || 0,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
      throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
    }
    console.error('خطأ في جلب أنواع السيارات:', error);
    return [];
  }
};

export const getPriceRange = async (): Promise<PriceRange> => {
  try {
    console.log("جارٍ جلب نطاق الأسعار");
    const response = await apiClient.get('/api/user/filter-Info');
    return {
      min: Number(response.data?.min_price) || 0,
      max: Number(response.data?.max_price) || 0,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
      throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
    }
    console.error('خطأ في جلب نطاق الأسعار:', error);
    return { min: 0, max: 0 };
  }
};

export const getCars = async (
  brandId?: number,
  type?: string,
  priceRange?: [number, number]
): Promise<CarItem[]> => {
  try {
    console.log("جارٍ جلب قائمة السيارات", { brandId, type, priceRange });
    const response = await apiClient.post('/api/user/Home', {});
    if (!response.data?.data) {
      throw new Error('لا توجد بيانات للسيارات');
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
        year: item.attributes?.year || '2020'
      }))
      .filter((car: CarItem) => {
        const brandMatch = !brandId || car.brandId === brandId;
        const typeMatch = !type || car.type === type;
        const priceMatch =
          !priceRange ||
          (typeof car.price === 'number' && car.price >= priceRange[0] && car.price <= priceRange[1]);
        return brandMatch && typeMatch && priceMatch;
      });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
      throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
    }
    console.error('خطأ في جلب السيارات:', error);
    return [];
  }
};

export const showCarId = async (id: string): Promise<CarItem> => {
  try {
    console.log("جارٍ جلب تفاصيل السيارة:", id);
    const response = await apiClient.get(`/api/user/Model/${id}`);
    if (!response.data?.data) {
      throw new Error('لم يتم العثور على بيانات السيارة');
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
      type: item.relationship?.Types?.type_name || '',
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
      throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
    }
    console.error('خطأ في جلب السيارة:', error);
    throw error;
  }
};

export const saveBooking = async (id: string, bookingData: BookingData): Promise<any> => {
  try {
    if (!bookingData.start_date || !bookingData.end_date || !bookingData.carmodel_id) {
      throw new Error('Missing required booking data');
    }

    if (bookingData.additional_driver === 1) {
      if (!bookingData.location_id || typeof bookingData.location_id !== 'number') {
        throw new Error('Invalid dropoff location for additional driver');
      }
    }

    const payload = {
      ...bookingData,
      status: 'pending',
      payment_status: 'unpaid'
    };

    const response = await apiClient.post(`/api/user/Model/${id}/car-booking`, payload);

    if (!response.data) {
      throw new Error('No response data received');
    }

    if (response.data.message !== 'Booking created successfully') {
      throw new Error(response.data.message || 'Booking creation failed');
    }

    return {
      bookingId: response.data.data?.id,
      ...response.data.data
    };
  } catch (error) {
    console.error('Booking error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors || {};
        throw new Error(Object.values(errors).flat().join(', '));
      }
      throw new Error(error.response?.data?.message || 'Booking failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getBookingList = async (): Promise<BookingItem[]> => {
  try {
    console.log("جارٍ جلب قائمة الحجوزات");
    const response = await apiClient.get('/api/user/booking-list');
    if (!response.data?.data) {
      throw new Error('لا توجد بيانات للحجوزات');
    }

    return response.data.data.map((booking: any) => ({
      id: booking.id || 0,
      user_id: booking.user_id || 0,
      carmodel_id: booking.carmodel_id || 0,
      start_date: booking.start_date || '',
      end_date: booking.end_date || '',
      final_price: booking.final_price || '0',
      status: booking.status || 'unknown',
      additional_driver: booking.additional_driver ? 1 : 0,
      car_model: {
        id: booking.car_model?.id || 0,
        attributes: {
          year: booking.car_model?.attributes?.year || 'غير معروف',
          price: booking.car_model?.attributes?.price || '0',
          engine_type: booking.car_model?.attributes?.engine_type || 'غير معروف',
          transmission_type: booking.car_model?.attributes?.transmission_type || 'تلقائي',
          seat_type: booking.car_model?.attributes?.seat_type || 'غير معروف',
          seats_count: booking.car_model?.attributes?.seats_count || 4,
          image: booking.car_model?.attributes?.image || '/default-car.jpg',
        },
        relationship: {
          Brand: {
            brand_id: booking.car_model?.relationship?.Brand?.brand_id || 0,
            brand_name: booking.car_model?.relationship?.Brand?.brand_name || 'غير معروف',
          },
          Types: {
            type_id: booking.car_model?.relationship?.Types?.type_id || 0,
            type_name: booking.car_model?.relationship?.Types?.type_name || 'غير معروف',
          },
          Model_Names: {
            model_name_id: booking.car_model?.relationship?.Model_Names?.model_name_id || 0,
            model_name: booking.car_model?.relationship?.Model_Names?.model_name || 'غير معروف',
          },
        },
      },
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
      throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
    }
    console.error('You have no bookings', error);
    throw new Error('You have no bookings');
  }
};

export const locationService = {
  async getActiveLocations(): Promise<Location[]> {
    try {
      const response = await apiClient.get('/api/user/user-locations');
      if (!response.data?.data) {
        throw new Error('No locations data received');
      }
      return response.data.data.map((loc: any) => ({
        id: loc.id,
        user_id: loc.user_id,
        location: loc.location,
        latitude: loc.latitude,
        longitude: loc.longitude,
        is_active: loc.is_active,
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw new Error('Failed to load locations');
    }
  },

  async addLocation(newLocation: Omit<Location, 'id' | 'user_id' | 'is_active'>): Promise<Location> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id) {
        throw new Error('يجب تسجيل الدخول لإضافة موقع جديد');
      }

      const response = await apiClient.post('/api/user/user-locations', {
        location: newLocation.location,
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        is_active: 1
      });

      console.log('استجابة إضافة الموقع:', response.data);

      if (response.data?.message === 'Location added successfully') {
        const locationsResponse = await apiClient.get('/api/user/user-locations');
        console.log('استجابة جلب المواقع:', locationsResponse.data);
        
        if (!locationsResponse.data?.data || !Array.isArray(locationsResponse.data.data)) {
          throw new Error('لا توجد بيانات مواقع في استجابة الخادم');
        }
        
        const addedLocation = locationsResponse.data.data.find((loc: any) => 
          loc.location === newLocation.location && 
          loc.latitude === newLocation.latitude && 
          loc.longitude === newLocation.longitude
        );
        
        if (addedLocation && addedLocation.id) {
          return {
            id: addedLocation.id,
            user_id: user.id,
            location: addedLocation.location || newLocation.location,
            latitude: addedLocation.latitude || newLocation.latitude,
            longitude: addedLocation.longitude || newLocation.longitude,
            is_active: addedLocation.is_active || 1
          };
        }
        
        if (locationsResponse.data.data.length > 0) {
          const latestLocation = locationsResponse.data.data[locationsResponse.data.data.length - 1];
          return {
            id: latestLocation.id,
            user_id: user.id,
            location: latestLocation.location,
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
            is_active: latestLocation.is_active || 1
          };
        }
      }

      if (!response.data) {
        throw new Error('لا توجد بيانات في استجابة الخادم');
      }

      if (response.data.id) {
        return {
          id: response.data.id,
          user_id: user.id,
          location: response.data.location || newLocation.location,
          latitude: response.data.latitude || newLocation.latitude,
          longitude: response.data.longitude || newLocation.longitude,
          is_active: response.data.is_active || 1
        };
      }

      if (response.data.data?.id) {
        return {
          id: response.data.data.id,
          user_id: user.id,
          location: response.data.data.location || newLocation.location,
          latitude: response.data.data.latitude || newLocation.latitude,
          longitude: response.data.data.longitude || newLocation.longitude,
          is_active: response.data.data.is_active || 1
        };
      }

      throw new Error('تعذر الحصول على معرف الموقع من الخادم');
    } catch (error) {
      console.error('Error adding location:', error);
      throw new Error('تعذر حفظ الموقع. الرجاء المحاولة لاحقاً');
    }
  }
};