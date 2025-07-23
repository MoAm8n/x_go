import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../../public/images/logo.png";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import Sidebar from "./Sidebar";
import { logoutUser } from "../context/Data/DataUser";

// زر اللغة
const LanguageDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("English");
  const user = localStorage.getItem('user');
  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "ru", label: "Русский" },
  ];

  const handleSelect = (lang) => {
    setSelected(lang.label);
    setOpen(false);
  };
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md font-medium text-[14px]  flex items-center gap-2"
        type="button"
      >
        {selected}
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="absolute -left-5 top-11 bottom-full mb-2 bg-white border w-28 z-50 text-center">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`px-4 py-2 cursor-pointer text-[14px] transition bg-white
                `}
              onClick={() => handleSelect(lang)}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = () => setSidebar(!sidebar);

  const links = [
    { name: "Home", path: "/#home" },
    { name: "Vehicles", path: "/#vehicles" },
    { name: "About", path: "/#about" },
    { name: "How it works", path: "/#how-it-work" },
  ];

  const location = useLocation();
  const isHashActive = (path) => {
    if (path.includes("#")) {
      const [pathname, hash] = path.split("#");
      return (
        location.pathname === (pathname || "/") &&
        location.hash === `#${hash}`
      );
    }
    return location.pathname === path;
  };

  const tokenUser = localStorage.getItem('tokenUser');
  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/loading";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="container mx-auto px-6 lg:px-8 py-4 ">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <button
                className="text-2xl text-[#83744d] hover:text-[#E6911E] transition duration-300"
                aria-label="Toggle Sidebar"
                type="button"
                onClick={toggleSidebar}
              >
                <HiMiniBars3CenterLeft />
              </button>
            </div>
            <Link to="loading" className="text-2xl font-bold text-gray-800">
              <img src={logo} alt="الشعار" className="h-10" loading="lazy" />
            </Link>
            <div className="space-x-4 max-md:hidden flex items-center">
              {links.map((link) => (
                <div key={link.name} className="inline-block lg:pe-4">
                  {link.path.includes("#") ? (
                    <HashLink
                      to={link.path}
                      className={
                        isHashActive(link.path)
                          ? "text-[#E6911E] pb-1 border-b-2 border-[#E6911E] font-semibold text-base "
                          : "text-[#7B7B7B] hover:text-[#E6911E] transition duration-300 text-base "
                      }
                    >
                      {link.name}
                    </HashLink>
                  ) : (
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#E6911E] pb-1 border-b-2 border-[#E6911E] font-bold text-base "
                          : "text-[#7B7B7B] hover:text-[#E6911E] transition duration-300 text-base "
                      }
                    >
                      {link.name}
                    </NavLink>
                  )}
                </div>
              ))}
              <LanguageDropdown />
            </div>
            <div>
              {tokenUser? (
                <button
                  className="bg-[#E53935CC] w-32 md:w-48 h-11 md:rounded-3xl rounded-xl text-white"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              ): (
                <Link to={'/signin'}>
                  <button className="bg-[#E6911E] md:rounded-3xl h-12 w-32 md:w-48 rounded-xl text-white">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Sidebar isOpen={sidebar} closeSidebar={() => setSidebar(false)} />
    </>
  );
};

export default Header;