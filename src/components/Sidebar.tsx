import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import logo from "../../public/images/logo.png";
import { logoutUser } from '../context/Data/DataUser';

interface LanguageDropdownProps {
  closeSidebar: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface Language {
  code: string;
  label: string;
  dir?: 'ltr' | 'rtl';
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ closeSidebar }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages: Language[] = [
    { code: "ar", label: "العربية", dir: 'rtl' },
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
  ];

  const currentLang = i18n.language || "en";
  const [selected, setSelected] = useState(
    languages.find((l) => l.code === currentLang) || languages[2]
  );

  const handleSelect = (lang: Language) => {
    setSelected(lang);
    i18n.changeLanguage(lang.code);
    if (lang.dir) {
      document.documentElement.dir = lang.dir;
    }
    setOpen(false);
    closeSidebar();
  };

  return (
    <div className="relative mt-4 mx-4">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full text-left py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition flex justify-between items-center"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{selected.label}</span>
        <span className="transform transition-transform duration-200">
          {open ? '↑' : '↓'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-10 border border-gray-200"
            role="listbox"
          >
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                  selected.code === lang.code ? 'bg-gray-100 font-medium' : ''
                }`}
                role="option"
                aria-selected={selected.code === lang.code}
              >
                {lang.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const linkKeys = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'how_it_works', path: '/how-it-work' },
    { key: 'charging', path: '/charging' },
    { key: 'vehicles', path: '/vehicles' },
  ];

  const isHashActive = (path: string) => {
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
    closeSidebar();
  };
  
  const handleCheckBookings = () => {
    if (tokenUser) {
      navigate('/bookings');
    }
    closeSidebar()
  };

  return (  
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 w-3/4 h-full bg-white p-4 lg:hidden overflow-y-auto z-50 shadow-lg flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div className='flex w-full'>
                <img 
                  src={logo} 
                  alt={t('logo_alt') || "Company Logo"} 
                  loading="lazy" 
                  className="h-10 object-contain" 
                />
              </div>
              <button 
                className="text-gray-800 hover:text-[#E6911E] transition duration-300 p-1"
                aria-label={t('close_sidebar') || "Close sidebar"}
                onClick={closeSidebar}
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <nav className="flex">
              <ul className="flex flex-col gap-1 w-full">
                {linkKeys.map((item) => (
                  <li key={item.key}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-md transition ${
                          isActive || isHashActive(item.path)
                            ? 'bg-orange-gradient text-white font-bold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      {t(`header.${item.key}`)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {tokenUser ? (
              <div className="grid grid-flow-col-1 gap-2 mt-4">
                <button
                  className="bg-[#E6911E] h-11 text-lg w-full rounded-md text-white font-bold"
                  onClick={handleCheckBookings}
                  type="button"
                >
                  {t("header.Bookings")}
                </button>
                <button
                  className="bg-[#E53935CC] h-11 text-lg w-full rounded-md text-white font-bold"
                  onClick={handleLogout}
                  type="button"
                >
                  {t("header.logout")}
                </button>
              </div>
            ) : (
              <Link to={'/signin'} className="mt-4">
                <button 
                  className="bg-[#E6911E] h-11 text-lg w-full rounded-md text-white">
                  {t("header.login")}
                </button>
              </Link>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <LanguageDropdown closeSidebar={closeSidebar} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
