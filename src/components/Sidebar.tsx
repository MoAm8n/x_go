import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How it works ', path: '/how-it-work' },
    { name: 'Charging', path: '/charging' },
    { name: 'Vehicles', path: '/vehicles' },
    { name: 'Language', path: '/language' },
  ];

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
            className="fixed left-0 top-0 w-3/4 h-full bg-white p-3 pt-6 lg:hidden overflow-y-auto z-50 shadow-lg"
          >
            <button 
              className="text-2xl text-gray-800 hover:text-[#E6911E] transition duration-300"
              aria-label="Close Sidebar"
              type="button"
              onClick={closeSidebar}
            >
              <IoMdClose size={24} />
            </button>
            <div className="flex flex-col gap-1 mt-5">
              {links.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-[#E6911E] pb-1 border-b-2 border-[#E6911E] font-bold py-2'
                      : 'text-[#7B7B7B] hover:text-[#E6911E] transition duration-300 border-b border-slate-100 py-2'
                  }
                  onClick={closeSidebar}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;