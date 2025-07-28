import axios from 'axios';
import { API_URL } from '../api/Api';

// إعداد عميل Axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// إضافة Interceptor لطلبات API لإرفاق التوكن
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

// دالة لمعالجة انتهاء صلاحية التوكن
const handleUnauthorized = () => {
  if(localStorage.getItem('tokenUser')){
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('user');
    apiClient.defaults.headers.common['Authorization'] = '';
    window.location.href = '/signin';
  }
};

// واجهات البيانات
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
  user_id: string;
  additional_driver: string;
  pickup_location: string;
  dropoff_location: string;
  location_id: string;
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

// التحقق من وجود بريد إلكتروني
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

// تسجيل مستخدم جديد
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

// تسجيل دخول المستخدم
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

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      console.error("خطأ أثناء تسجيل الدخول:", errorMessage);
      if (error.response?.status === 401) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
      throw new Error(errorMessage);
    }
    throw new Error('حدث خطأ غير متوقع أثناء تسجيل الدخول');
  }
};

// إعادة تعيين كلمة المرور
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

// تسجيل الخروج
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

// جلب العلامات التجارية
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

// جلب أنواع السيارات
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

// جلب نطاق الأسعار
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

// جلب قائمة السيارات
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

// جلب تفاصيل سيارة محددة
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

// حفظ حجز
// export const saveBooking = async (id: string, bookingData: BookingData): Promise<any> => {
//   try {
//     console.log("جارٍ حفظ الحجز:", { id, bookingData });
//     if (!bookingData.user_id || !bookingData.location_id) {
//       throw new Error('المصادقة ومعلومات الموقع مطلوبة');
//     }

//     const payload = {
//       ...bookingData,
//       status: 'pending',
//       payment_status: 'unpaid',
//     };

//     const response = await apiClient.post(`/api/user/Model/${id}/car-booking`, payload, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('tokenUser')}`,
//       },
//     });

//     if (!response.data?.data?.booking) {
//       throw new Error('استجابة الحجز غير صالحة من الخادم');
//     }

//     console.log("تم حفظ الحجز بنجاح:", response.data.data.booking);
//     return {
//       bookingId: response.data.data.booking.id,
//       ...response.data.data.booking,
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("خطأ أثناء حفظ الحجز:", error.response?.data);
//       if (error.response?.status === 401) {
//         handleUnauthorized();
//         throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
//       }
//       if (error.response?.status === 422) {
//         const serverErrors = error.response.data?.errors || {};
//         throw new Error(
//           Object.entries(serverErrors)
//             .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//             .join('\n')
//         );
//       }
//       if (error.response?.status === 404) {
//         throw new Error('الوجهة المطلوبة للحجز غير موجودة');
//       }
//       throw new Error(error.response?.data?.message || 'فشل الحجز');
//     }
//     console.error("خطأ غير متوقع أثناء حفظ الحجز:", error);
//     throw new Error('خطأ في الشبكة، يرجى المحاولة مرة أخرى');
//   }
// };
export const saveBooking = async (id: string, bookingData: BookingData): Promise<any> => {
  try {
    console.log("جارٍ حفظ الحجز:", { id, bookingData });
    
    // التحقق من البيانات المطلوبة
    if (!bookingData.start_date || !bookingData.end_date || !bookingData.carmodel_id) {
      throw new Error('بيانات الحجز غير مكتملة');
    }

    if (bookingData.additional_driver === "1") {
      if (!bookingData.pickup_location || !bookingData.dropoff_location) {
        throw new Error('يجب تحديد مواقع الالتقاط والتسليم عند اختيار سائق إضافي');
      }
    }

    const payload = {
      ...bookingData,
      status: 'pending',
      payment_status: 'unpaid',
      car_id: id,
      user_id: bookingData.user_id,
      pickup_location_id: bookingData.pickup_location,
      dropoff_location_id: bookingData.dropoff_location
    };

    const response = await apiClient.post(`/api/user/Model/${id}/car-booking`, payload);
    
    console.log("استجابة الحجز:", response.data);

    if (!response.data?.data) {
      throw new Error('استجابة غير صالحة من الخادم');
    }

    return {
      bookingId: response.data.data.id || response.data.data.booking_id,
      ...response.data.data
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("تفاصيل الخطأ:", error.response?.data);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        throw new Error(`بيانات غير صالحة:\n${errorMessages}`);
      }
      
      if (error.response?.status === 401) {
        handleUnauthorized();
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      }
      
      throw new Error(error.response?.data?.message || 'فشل في حفظ الحجز');
    }
    throw new Error('حدث خطأ غير متوقع أثناء حفظ الحجز');
  }
};
// جلب قائمة الحجوزات
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
    console.error('خطأ في جلب قائمة الحجوزات:', error);
    throw new Error('فشل جلب الحجوزات، يرجى المحاولة لاحقًا');
  }
};

// خدمة إدارة المواقع
export const locationService = {
  async getActiveLocations(): Promise<Location[]> {
    try {
      console.log("جارٍ جلب المواقع النشطة");
      const response = await apiClient.get('/api/user/user-locations');
      if (!response.data?.data) {
        throw new Error('لا توجد بيانات للمواقع');
      }

      return response.data.data
        .filter((loc: any) => loc.is_active === 1)
        .map((loc: any) => ({
          id: loc.id || 0,
          user_id: loc.user_id || 0,
          location: loc.location || '',
          latitude: loc.latitude || '',
          longitude: loc.longitude || '',
          is_active: loc.is_active || 0,
        }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized();
        return [];
      }
      console.error("خطأ في جلب المواقع:", error);
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'فشل جلب المواقع'
          : 'حدث خطأ غير متوقع'
      );
    }
  },

  async addLocation(newLocation: Omit<Location, 'id' | 'user_id'>): Promise<Location> {
    try {
      console.log("جارٍ حفظ الموقع الجديد:", newLocation);
      const response = await apiClient.post('/api/user/user-locations', {
        ...newLocation,
        is_active: 1
      });

      if (!response.data?.data?.id) {
        console.error("استجابة غير متوقعة:", response.data);
        throw new Error('فشل في إضافة الموقع: معرف الموقع غير موجود');
      }

      const savedLocation: Location = {
        id: response.data.data.id,
        user_id: response.data.data.user_id || 0,
        location: response.data.data.location || newLocation.location,
        latitude: response.data.data.latitude || newLocation.latitude,
        longitude: response.data.data.longitude || newLocation.longitude,
        is_active: response.data.data.is_active || 1
      };

      console.log("تم حفظ الموقع بنجاح:", savedLocation);
      return savedLocation;
    } catch (error) {
      console.error("خطأ في إضافة الموقع:", error);
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || 
                            error.response?.data?.error ||
                            'فشل في إضافة الموقع';
        throw new Error(serverMessage);
      }
      throw new Error('حدث خطأ غير متوقع أثناء إضافة الموقع');
    }
  }
};