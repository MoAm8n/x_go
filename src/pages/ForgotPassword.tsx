import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا منطق إرسال الإيميل لإعادة تعيين كلمة المرور
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFB347] via-[#FFE0B2] to-[#fdf9f2] px-2 md:px-8">
      <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl bg-transparent  overflow-hidden md:h-[500px]">
        {/* Left Side (Welcome Section) */}
        <div className="w-full md:w-[50%] flex flex-col justify-between p-6 md:p-10">
          <div className="flex-1 flex flex-col justify-center md:items-start text-left bg-transparent">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
              Let’s get you back behind the wheel
            </h2>
            <p className="text-gray-600 mb-10 max-w-md md:max-w-xs">
              Lorem ipsum dolor sit amet consectetur. A tellus enim orci a eget porttitor et.
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
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">English</li>
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">العربية</li>
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-[14px]">Français</li>
                </ul>
              )}
            </div>
            <nav className="flex gap-4">
              <Link to="#" className="text-[14px] text-[#E6911E]">Terms</Link>
              <Link to="#" className="text-[14px] text-[#E6911E]">Plans</Link>
              <Link to="#" className="text-[14px] text-[#E6911E]">Contact Us</Link>
            </nav>
          </div>
        </div>
        {/* Right Side (Forgot Password Form) */}
        <div className="w-full md:w-[50%] flex items-center justify-center bg-white rounded-lg shadow-2xl p-4 md:p-0">
          <form className="w-full max-w-xs sm:max-w-sm space-y-8 my-12" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-extrabold text-gray-900 my-3">Forgot Password</h3>
            <p className="mb-6">Enter your email to reset your password</p>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
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
            <div className="flex justify-between pt-10 gap-6">
              <button
                type="submit"
                className="w-full text-white bg-[#E6911E] hover:bg-[#cc7f15] rounded-lg px-5 py-2 text-center transition-colors shadow-lg"
              >
                Submit
              </button>
              <button
                type="submit"
                className="w-full  rounded-lg  px-5 py-2 text-center transition-colors shadow-lg"
              >
                Cancle
              </button>
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;