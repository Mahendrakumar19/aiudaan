'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  MdAccountCircle, 
  MdSettings, 
  MdLogout,
  MdKeyboardArrowDown 
} from 'react-icons/md';
import axios from 'axios';

const AdminProfileDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Administrator',
    avatar: null
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch admin profile data
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAdminData(response.data);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        // Keep default data if fetch fails
      }
    };

    fetchAdminProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleViewProfile = () => {
    setIsOpen(false);
    router.push('/profile');
  };

  const handleSettings = () => {
    setIsOpen(false);
    router.push('/settings');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 pl-3 border-l border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
      >
        {/* Avatar */}
        <div className="relative">
          {adminData.avatar ? (
            <Image
              src={adminData.avatar}
              alt={adminData.name}
              width={40}
              height={40}
              unoptimized
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
              {getInitials(adminData.name)}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Name and Role */}
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-800">{adminData.name}</p>
          <p className="text-xs text-gray-500">{adminData.role}</p>
        </div>

        {/* Dropdown Arrow */}
        <MdKeyboardArrowDown 
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Profile Info Section */}
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <div className="flex items-center space-x-3">
              {adminData.avatar ? (
                <Image
                  src={adminData.avatar}
                  alt={adminData.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                  {getInitials(adminData.name)}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm">{adminData.name}</p>
                <p className="text-xs opacity-90">{adminData.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleViewProfile}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
            >
              <MdAccountCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium">View Profile</span>
            </button>

            <button
              onClick={handleSettings}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
            >
              <MdSettings className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Settings</span>
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
            >
              <MdLogout className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfileDropdown;
