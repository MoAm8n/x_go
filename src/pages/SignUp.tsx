// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { signupUser } from '../context/Data/DataUser';

// const SignUp: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRepeatPassword, setShowRepeatPassword] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     password_confirmation: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     const token = localStorage.getItem('tokenUser');
//     if (user && token) {
//       navigate('/booking-list'); 
//     }
//   }, [navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     if (form.password !== form.password_confirmation) {
//       setError('كلمة السر غير مطابقة');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await signupUser({
//         name: form.name,
//         last_name: 'user',
//         email: form.email,
//         phone: form.phone,
//         password: form.password,
//         password_confirmation: form.password_confirmation,
//       });
//       localStorage.setItem('user', JSON.stringify(response.user));
//       localStorage.setItem('tokenUser', response.token);
//       navigate('/booking/:bookingId');
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء التسجيل');
//       console.error('Signup error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFB347] via-[#FFE0B2] to-[#fdf9f2] sm:px-4 md:px-32 py-8">
//       <div className="flex flex-col lg:flex-row justify-between item-center w-full bg-transparent overflow-hidden ">
//         <div className="w-full flex flex-col justify-evenly max-lg:pt-16">
//           <div className="w-full max-lg:text-center">
//             <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 lg:w-3/4 max-lg:px-10 max-lg:py-2">
//               Welcome, Your next drive is waiting
//             </h2>
//             <p className="text-gray-600 lg:w-3/4 text-lg max-lg:px-6">
//               Lorem ipsum dolor sit amet consectetur. A tellus enim orci a eget porttitor et.
//             </p>
//           </div>
//           <div className="relative flex flex-col sm:flex-row items-center gap-4 max-lg:py-8">
//             <div className="relative">
//               <button
//                 onClick={() => setOpen((prev) => !prev)}
//                 className="px-4 py-2 rounded-lg font-medium text-[14px] bg-inherit border border-gray-300 lg:mr-10"
//                 type="button"
//               >
//                 🌐 Language
//               </button>
//               {open && (
//                 <ul className="absolute left-0 bottom-full my-2 bg-white border shadow-md w-40 z-50 rounded-lg">
//                   <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
//                     العربية
//                   </li>
//                   <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
//                     English
//                   </li>
//                   <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
//                     Russian
//                   </li>
//                 </ul>
//               )}
//             </div>
//             <nav className="flex gap-4">
//               <a href="#" className="text-[14px] text-[#E6911E]">
//                 Terms
//               </a>
//               <a href="#" className="text-[14px] text-[#E6911E]">
//                 Plans
//               </a>
//               <a href="#" className="text-[14px] text-[#E6911E]">
//                 Contact Us
//               </a>
//             </nav>
//           </div>
//         </div>
//         <div className="w-full flex flex-col justify-center items-center bg-white shadow-lg rounded-lg">
//           <form className="w-full px-8 py-2 mx-auto" onSubmit={handleSubmit}>
//             {error && (
//               <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
//                 {error}
//               </div>
//             )}
//             <h3 className="text-2xl font-extrabold text-gray-900 my-3">
//               Sign Up
//             </h3>
//             <p className="mb-4">Enter your email to create your account</p>
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block my-2 text-sm font-semibold text-gray-700"
//               >
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
//                 placeholder="name"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block my-2 text-sm font-semibold text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
//                 placeholder="name@email.com"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="phone"
//                 className="block my-2 text-sm font-semibold text-gray-700"
//               >
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
//                 placeholder="01000000000"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block my-2 text-sm font-semibold text-gray-700">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   tabIndex={-1}
//                 >
//                   {showPassword ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.872A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 3l18 18"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               <p className="text-xs text-gray-400 mt-1">
//                 Use 8 or more characters with a mix of letters, numbers & symbols.
//               </p>
//             </div>
//             <div>
//               <label className="block my-2 text-sm font-semibold text-gray-700">
//                 Repeat Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showRepeatPassword ? 'text' : 'password'}
//                   name="password_confirmation"
//                   value={form.password_confirmation}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   onClick={() => setShowRepeatPassword((prev) => !prev)}
//                   tabIndex={-1}
//                 >
//                   {showRepeatPassword ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.872A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 3l18 18"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               <p className="text-xs text-gray-400 mt-1">
//                 Use 8 or more characters with a mix of letters, numbers & symbols.
//               </p>
//             </div>
//             <div className="flex justify-between pt-4">
//               <button
//                 type="submit"
//                 className="w-full text-white bg-[#E6911E] hover:bg-[#cc7f15] font-bold rounded-lg text-base px-5 py-2 text-center transition-colors shadow-lg"
//                 disabled={loading}
//               >
//                 {loading ? 'Signing Up...' : 'Sign Up'}
//               </button>
//             </div>
//           </form>
//           <div className="text-sm text-center mt-4">
//             لديك حساب بالفعل؟{' '}
//             <Link to="/signin" className="text-[#E6911E] hover:underline">
//               تسجيل الدخول
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signupUser, checkEmailExists } from '../context/Data/DataUser';
import { saveBooking } from '../context/Data/DataUser';

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (location.state?.email) {
      setForm(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.email || !form.phone || !form.password || !form.password_confirmation) {
      setError('الرجاء تعبئة جميع الحقول');
      setLoading(false);
      return;
    }

    if (form.password !== form.password_confirmation) {
      setError('كلمة السر غير مطابقة');
      setLoading(false);
      return;
    }

    try {
      const response = await signupUser({
        name: form.name,
        last_name: 'user',
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('tokenUser', response.token);

      // استعادة بيانات الحجز المؤقتة
      const tempBookingData = location.state?.tempBookingData || 
        JSON.parse(localStorage.getItem('tempBookingData') || null);

      if (tempBookingData) {
        try {
          const bookingData = {
            start_date: tempBookingData.start_date,
            end_date: tempBookingData.end_date,
            carmodel_id: tempBookingData.carmodel_id,
            user_id: response.user.id,
            additional_driver: tempBookingData.additional_driver,
            pickup_location: tempBookingData.pickup_location,
            dropoff_location: tempBookingData.dropoff_location
          };

          const res = await saveBooking(tempBookingData.carmodel_id, bookingData);
          localStorage.removeItem('tempBookingData');
          
          navigate(`/bookings/${res.bookingId}`, {
            state: {
              carDetails: tempBookingData.carDetails,
              bookingDetails: {
                ...bookingData,
                extras: tempBookingData.extras,
                totalPrice: tempBookingData.totalPrice
              }
            }
          });
          return;
        } catch (bookingError) {
          console.error('Failed to complete booking:', bookingError);
        }
      }

      navigate('/bookings');
    } catch (error) {
      let errorMessage = 'حدث خطأ غير متوقع أثناء التسجيل';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFB347] via-[#FFE0B2] to-[#fdf9f2] sm:px-4 md:px-32 -mt-[70px]">
      <div className="flex flex-col lg:flex-row justify-between item-center w-full bg-transparent overflow-hidden">
        <div className="w-full flex flex-col justify-evenly max-lg:pt-16">
           <div className="w-full max-lg:text-center">
             <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 lg:w-3/4 max-lg:px-10 max-lg:py-2">
               Welcome, Your next drive is waiting
             </h2>
             <p className="text-gray-600 lg:w-3/4 text-lg max-lg:px-6">
               Lorem ipsum dolor sit amet consectetur. A tellus enim orci a eget porttitor et.
             </p>
           </div>
           <div className="relative flex flex-col sm:flex-row items-center gap-4 max-lg:py-8">
             <div className="relative">
               <button
                 onClick={() => setOpen((prev) => !prev)}
                 className="px-4 py-2 rounded-lg font-medium text-[14px] bg-inherit border border-gray-300 lg:mr-10"
                 type="button"
               >
                 🌐 Language
               </button>
               {open && (
                 <ul className="absolute left-0 bottom-full my-2 bg-white border shadow-md w-40 z-50 rounded-lg">
                   <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
                     العربية
                   </li>
                   <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
                     English
                   </li>
                   <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
                     Russian
                   </li>
                 </ul>
               )}
             </div>
             <nav className="flex gap-4">
               <a href="#" className="text-[14px] text-[#E6911E]">
                 Terms
               </a>
               <a href="#" className="text-[14px] text-[#E6911E]">
                 Plans
               </a>
               <a href="#" className="text-[14px] text-[#E6911E]">
                 Contact Us
               </a>
             </nav>
           </div>
         </div>
        <div className="w-full flex flex-col justify-center items-center bg-white shadow-lg rounded-lg">
          <form className="w-full px-8 py-2 mx-auto" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
                {error.includes('مسجل بالفعل') && (
                  <div className="mt-2">
                    <Link 
                      to="/signin" 
                      state={{ email: form.email }}
                      className="text-blue-600 hover:underline"
                    >
                      الانتقال إلى تسجيل الدخول
                    </Link>
                  </div>
                )}
              </div>
            )}

            <h3 className="text-2xl font-extrabold text-gray-900 my-3">Sign Up</h3>
            <p className="mb-4">Enter your details to create your account</p>

            {/* حقول التسجيل */}
            <div>
              <label htmlFor="name" className="block my-2 text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block my-2 text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                placeholder="name@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block my-2 text-sm font-semibold text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                placeholder="01000000000"
                required
              />
            </div>

            <div>
              <label className="block my-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {/* أيقونة إظهار/إخفاء كلمة السر */}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Use 8 or more characters with a mix of letters, numbers & symbols.
              </p>
            </div>

            <div>
              <label className="block my-2 text-sm font-semibold text-gray-700">
                Repeat Password
              </label>
              <div className="relative">
                <input
                  type={showRepeatPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowRepeatPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {/* أيقونة إظهار/إخفاء كلمة السر */}
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="submit"
                className="w-full text-white bg-[#E6911E] hover:bg-[#cc7f15] font-bold rounded-lg text-base px-5 py-2 text-center transition-colors shadow-lg"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="text-sm text-center mt-4 mb-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#E6911E] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;