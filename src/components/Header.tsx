import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from 'react-i18next';
import logo from "../../public/images/logo.png";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import Sidebar from "./Sidebar";
import { logoutUser } from "../context/Data/DataUser";
import { useNavigate } from "react-router-dom";

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const languages = [
    { code: "ar", label: "العربية" },
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
  ];

  const currentLang = i18n.language || "en";
  const defaultLang = languages.find((l) => l.code === currentLang)?.label || "English";
  const [selected, setSelected] = useState(defaultLang);

  const handleSelect = (lang: { code: string; label: string }) => {
    setSelected(lang.label);
    i18n.changeLanguage(lang.code);
    setOpen(false);
  };


  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md font-medium text-[14px] flex items-center gap-2"
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
        <ul className="absolute h-fit -left-5 top-11 bottom-full mb-2 bg-white border w-28 z-50 text-center">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className="px-4 py-2 cursor-pointer text-[14px] hover:bg-gray-100"
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
  const { t } = useTranslation(); 
  const navigate = useNavigate()
  const links = [
    { name: t("header.home"), path: "/#home" },
    { name: t("header.vehicles"), path: "/#vehicles" },
    { name: t("header.about"), path: "/#about" },
    { name: t("header.how_it_works"), path: "/#how-it-work" },
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
    navigate("/loading");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="container mx-auto max-sm:px-8 lg:px-8 py-4 ">
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
            <div className="space-x-2 lg:space-x-4 max-md:hidden flex items-center">
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
                <div className="flex items-center gap-2">
                <button
                  className="bg-[#E53935CC] w-28 lg:w-44 h-11 max-md:text-sm md:rounded-3xl rounded-xl text-white"
                  onClick={handleLogout}
                  type="button"
                >
                  {t("header.logout")}
                </button>
                <button
                  className="bg-[#E6911E] w-28 lg:w-44 h-11 max-md:text-sm md:rounded-3xl rounded-xl text-white"
                  onClick={() => navigate('/bookings')}
                  type="button"
                >
                  {t("header.Bookings")}
                </button>
                </div>
              ): (
                <Link to={'/signin'}>
                  <button 
                    className="bg-[#E6911E] md:rounded-3xl h-12 w-28 lg:w-44 rounded-xl text-white">
                    {t("header.login")}
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