import React, { useState } from "react";

const ForgotPassword: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen -mt-20 flex items-center justify-center bg-gradient-to-b from-[#FFB347] via-[#FFE0B2] to-[#fdf9f2] sm:px-4 md:px-32">
      <div className="flex flex-col lg:flex-row justify-between item-center w-full bg-transparent overflow-hidden ">
        <div className="w-full flex flex-col justify-evenly max-lg:pt-16">
          <div className="w-full max-lg:text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 lg:w-4/5 max-lg:px-10 max-lg:py-2 mb-4">
            Let’s get you back behind the wheel
            </h2>
            <p className="text-gray-600 lg:w-3/4 text-lg max-lg:px-6">
            Lorem ipsum dolor sit amet consectetur. A tellus enim orci a eget porttitor et.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row w-full max-lg:justify-center items-center gap-4 max-lg:py-8">
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
                    Russian{" "}
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
          <form className="w-full px-8 py-10 mx-auto" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-extrabold text-gray-900 my-3">Forgot Password</h3>
            <p className="mb-6">Enter your email to reset your password</p>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
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