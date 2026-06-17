'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MdAdminPanelSettings,
  MdDashboard, 
  MdBook, 
  MdPeople, 
  MdSchool, 
  MdShoppingCart, 
  MdCategory, 
  MdLogout,
  MdMenu,
  MdAssignment
} from 'react-icons/md';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <MdDashboard className="w-6 h-6" />,
      path: '/admin/dashboard',
    },
    {
      name: 'Courses',
      icon: <MdBook className="w-6 h-6" />,
      path: '/admin/courses',
    },
    {
      name: 'Students',
      icon: <MdPeople className="w-6 h-6" />,
      path: '/admin/students',
    },
    {
      name: 'Registrations',
      icon: <MdAssignment className="w-6 h-6" />,
      path: '/admin/registrations',
    },
    {
      name: 'Enrollments',
      icon: <MdSchool className="w-6 h-6" />,
      path: '/admin/enrollments',
    },
    {
      name: 'Orders',
      icon: <MdShoppingCart className="w-6 h-6" />,
      path: '/admin/orders',
    },
    {
      name: 'Categories',
      icon: <MdCategory className="w-6 h-6" />,
      path: '/admin/categories',
    },
    {
      name: 'Site Administration',
      icon: <MdAdminPanelSettings className="w-6 h-6" />,
      path: '/admin/site-administration',
    },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminPassword');
      const Cookies = (await import('js-cookie')).default;
      Cookies.remove('token');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/admin');
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
      >
        <MdMenu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            LMS Admin
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === item.path
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-8 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full hover:bg-red-600 transition-all duration-200 text-gray-300 hover:text-white"
          >
            <MdLogout className="w-6 h-6" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
