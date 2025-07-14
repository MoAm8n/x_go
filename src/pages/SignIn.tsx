import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا منطق تسجيل الدخول
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFB347] via-[#FFE0B2] to-white px-2 sm:px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl bg-transparent overflow-hidden md:h-[500px] ">
        {/* Left Side (Welcome Section) */}
        <div className="w-full  flex flex-col justify-between p-6 md:pl-12 md:pr-8 bg-transparent">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 leading-tight text-center md:text-left">
              Login to unlock the road{" "}
            </h2>
            <p className="text-gray-600 mb-10 max-w-md md:max-w-xs text-center md:text-left">
              Lorem ipsum dolor sit amet consectetur. A tellus enim orci a eget
              porttitor et.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row items-center gap-4 mt-4">
            {/* زر تغيير اللغة Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="px-4 py-2 rounded-md font-medium text-[14px] border shadow-lg"
                type="button"
              >
                🌐 Language
              </button>
              {open && (
                <ul className="absolute left-0 bottom-full mb-2 bg-white border rounded-md shadow-md w-40 z-50">
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
                    English
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
                    العربية
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">
                    Français
                  </li>
                </ul>
              )}
            </div>
            <nav className="flex gap-4">
              <Link to="#" className="text-[14px] text-[#E6911E]">
                Terms
              </Link>
              <Link to="#" className="text-[14px] text-[#E6911E]">
                Plans
              </Link>
              <Link to="#" className="text-[14px] text-[#E6911E]">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
        {/* Right Side (Form) */}
        <div className="w-full flex flex-col justify-center items-center p-6 bg-white rounded-lg">
          <form className="w-full max-w-xs mx-auto" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-extrabold text-gray-900 my-3">
              Sign In
            </h3>
            <p className="mb-6">Enter your email and password to sign in</p>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input py-1 px-4 block w-full rounded-lg border border-gray-300 focus:ring-[#E6911E] focus:border-[#E6911E] text-base"
                placeholder="name@email.com"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // أيقونة عين مفتوحة
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    // أيقونة عين مغلقة
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.872A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <Link
                  to="/forgotpassword"
                  className="text-xs text-[#E6911E] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between pt-10 gap-4 sm:gap-0">
              <button
                type="submit"
                className="w-full sm:w-[45%] text-white bg-[#E6911E] hover:bg-[#cc7f15] font-bold rounded-lg text-base px-5 py-2 text-center transition-colors shadow-lg"
              >
                Sign In
              </button>
              <Link
                to="/signup"
                className="w-full sm:w-[45%] text-black hover:bg-[#cc7f15] font-bold rounded-lg text-base px-5 py-2 text-center transition-colors shadow-lg flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
