import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../public/images/logo.png';
import { HiMiniBars3CenterLeft } from 'react-icons/hi2';
import Sidebar from './Sidebar'; 

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = () => setSidebar(!sidebar);
  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How it works ', path: '/how-it-work' },
    { name: 'Charging', path: '/charging' },
    { name: 'Vehicles', path: '/vehicles' },
    { name: 'Language', path: '/language' },
  ];

  return (
    <>
      <nav>
        <div className="container mx-auto px-6 lg:px-8 py-4">
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
            <Link to="/" className="text-2xl font-bold text-gray-800">
              <img src={logo} alt="الشعار" className="h-10" />
            </Link>
            <div className="space-x-4 max-md:hidden">
              {links.map((link) => (
                <div key={link.name} className="inline-block lg:pe-4">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-[#E6911E] pb-1 border-b-2 border-[#E6911E] font-bold'
                        : 'text-[#7B7B7B] hover:text-[#E6911E] transition duration-300'
                    }
                  >
                    {link.name}
                  </NavLink>
                </div>
              ))}
            </div>
            <div>
              <NavLink to="/">
                <button className="lg:font-bold text-sm lg:text-lg text-white bg-[#E6911E] hover:bg-opacity-70 w-[96px] h-[30px] lg:w-[192px] lg:h-[44px] rounded-full transition duration-300">
                  Get the app
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
      <Sidebar isOpen={sidebar} closeSidebar={() => setSidebar(false)} />
    </>
  );
};

export default Header;