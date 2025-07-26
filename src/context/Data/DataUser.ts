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
  user_id: string;
  additional_driver: string;
  pickup_location?: string;
  dropoff_location?: string;
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

export const checkEmailExists = async (email: string) => {
  try {
    const response = await axios.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data.exists;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};
export const signupUser = async (userData: SignUpData): Promise<AuthResponse> => {
  try {
    // التحقق من تطابق كلمات المرور
    if (userData.password !== userData.password_confirmation) {
      throw new Error('كلمة المرور غير متطابقة');
    }

    // التحقق من وجود البريد الإلكتروني مسبقاً
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
    }

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

    if (!response.data.token || !response.data.user) {
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      if (error.response?.status === 400) {
        throw new Error('بيانات التسجيل غير صالحة');
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
    const response = await apiClient.post('/api/user/login', {
      email: credentials.email,
      password: credentials.password,
    });

    if (!response.data.token || !response.data.user) {
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }

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


export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/forgot-password', { email });
    if (!response.data?.message) {
      throw new Error('لم يتم استلام بيانات المستخدم من الخادم');
    }
    return { message: response.data.message };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('حدث خطأ غير متوقع أثناء إرسال البريد الإلكتروني');
  }
};

export const logoutUser = async (): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/logout');
    
    // حتى لو السيرفر مردش بحاجة مهمة، نكمل عملية الخروج
    if (!response.data?.message) {
      console.warn('لم يتم استلام رسالة من الخادم، جاري تسجيل الخروج محليًا');
    }

    // تسجيل خروج محلي
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('user');
    apiClient.defaults.headers.common['Authorization'] = '';
    window.location.href = '/';

    return { message: response.data?.message || 'تم تسجيل الخروج بنجاح' };
  } catch (error: any) {
    // لو التوكن غير صالح أو انتهت صلاحيته
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('Token invalid or expired. Logging out anyway.');

      // تسجيل خروج محلي رغم الخطأ
      localStorage.removeItem('tokenUser');
      localStorage.removeItem('user');
      apiClient.defaults.headers.common['Authorization'] = '';
      window.location.href = '/';

      return { message: 'تم تسجيل الخروج (بسبب انتهاء صلاحية الجلسة)' };
    }

    // أي خطأ آخر غير متوقع
    console.error('Error logging out:', error);
    throw new Error('حدث خطأ غير متوقع أثناء تسجيل الخروج');
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
      logo: brand.attributes?.logo || '',
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
      name: type.name || '',
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
      max: Number(response.data?.max_price) || 0,
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
    console.error('Error fetching cars:', error);
    return [];
  }
};

export const showCarId = async (id: string): Promise<CarItem> => {
  try {
    const response = await apiClient.get(`/api/user/Model/${id}`);
    if (!response.data?.data) {
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
      type: item.relationship?.Types?.type_name || '',
    };
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
};

export const saveBooking = async (id: string, bookingData: BookingData): Promise<any> => {
  try {
    console.log('Sending booking data:', bookingData);
    const response = await apiClient.post(`/api/user/Model/${id}/car-booking`, bookingData); 
    console.log('Received response:', response.data);

    if (!response.data?.data?.booking) {
      throw new Error('لم يتم استلام بيانات الحجز من الخادم');
    }
    return {
      message: response.data.message,
      bookingId: response.data.data.booking.id,
      bookingData: response.data.data.booking,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء حفظ الحجز';
      if (error.response?.status === 404) {
        console.error('404 Error: Endpoint not found. Tried:', `/api/booking`);
        throw new Error('الوجهة المطلوبة للحجز غير موجودة. يرجى التحقق من عنوان الـ API.');
      }
      if (error.response?.status === 422) {
        throw new Error('بيانات الحجز غير صالحة: ' + errorMessage);
      }
      if (error.response?.status === 500) {
        throw new Error('فشل في حفظ الحجز بسبب مشكلة في الخادم');
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('Token invalid or expired. Logging out anyway.');
      localStorage.removeItem('tokenUser');
      localStorage.removeItem('user');
      apiClient.defaults.headers.common['Authorization'] = '';
      window.location.href = '/signin';

      return { message: 'تم تسجيل الخروج (بسبب انتهاء صلاحية الجلسة)' };
    }
      throw new Error(errorMessage);
    }
    console.error('Error saving booking:', error);
    throw new Error('حدث خطأ غير متوقع أثناء حفظ الحجز');
  }
};
export const getBookingList = async (): Promise<BookingItem[]> => {
  try {
    const response = await apiClient.get('/api/user/booking-list');
    
    if (!response.data?.data) {
      throw new Error('No booking data available');
    }

    return response.data.data.map((booking: any) => ({
      id: booking.id,
      user_id: booking.user_id || 0,
      carmodel_id: booking.carmodel_id || 0,
      start_date: booking.start_date,
      end_date: booking.end_date,
      final_price: booking.final_price,
      status: booking.status,
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
            brand_name: booking.car_model?.relationship?.Brand?.brand_name || 'غير معروف'
          },
          Types: {
            type_id: booking.car_model?.relationship?.Types?.type_id || 0,
            type_name: booking.car_model?.relationship?.Types?.type_name || 'غير معروف'
          },
          Model_Names: {
            model_name_id: booking.car_model?.relationship?.Model_Names?.model_name_id || 0,
            model_name: booking.car_model?.relationship?.Model_Names?.model_name || 'غير معروف'
          }
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching booking list:', error);
    throw new Error('Failed to fetch bookings. Please try again later.');
  }
};

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  paymentDetails?: any;
}

export const processPayment = async (
  modelId: string,
  bookingId: string,
  paymentData: {
    payment_method: string;
    card_details?: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardHolderName: string;
    };
    amount: string | number;
    save_payment_info?: boolean;
  }
): Promise<PaymentResponse> => {
  try {
    const response = await apiClient.post(
      `/api/user/Model/${modelId}/car-booking/${bookingId}/payment-method`,
      paymentData
    );

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return {
      success: true,
      message: response.data.message || 'Payment processed successfully',
      transactionId: response.data.transactionId,
      paymentDetails: response.data.paymentDetails
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Payment processing failed';
      if (error.response?.status === 401) {
        localStorage.removeItem('tokenUser');
        localStorage.removeItem('user');
        apiClient.defaults.headers.common['Authorization'] = '';
        return { success: false, message: 'Session expired. Please login again.' };
      }
      return { success: false, message: errorMessage };
    }
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export interface Location {
  id?: number;
  user_id?: number;
  location: string;
  latitude: string;
  longitude: string;
  is_active?: number;
}

export const locationService = {
  async addLocation(locationData: Omit<Location, 'id' | 'user_id' | 'is_active'>) {
    try {
      const response = await apiClient.post('/api/user/user-locations', locationData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  },

  async getLocations() {
    try {
      const response = await apiClient.get('/api/user/user-locations');
      return response.data.data as Location[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // إذا كان الخطأ 401، نقوم بتسجيل خروج المستخدم
        localStorage.removeItem('tokenUser');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        throw new Error('Session expired. Redirecting to login...');
      }
      throw error;
    }
  },

  async updateLocation(id: number, updates: Partial<Location>) {
    try {
      const response = await apiClient.put(`/api/user/user-locations/${id}`, updates);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  }
};