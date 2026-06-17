'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MdSearch, 
  MdNotifications
} from 'react-icons/md';
import AdminProfileDropdown from './AdminProfileDropdown';
import { getFaculty, getOrders } from '@/service/api';
import { getMoodleCourses, getMoodleUsers } from '@/service/moodleService';

const TopNavbar = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState({
    students: [],
    courses: [],
    orders: [],
    faculty: [],
  });
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    // Update time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [studentsResult, coursesResult, ordersResult, facultyResult] = await Promise.allSettled([
          getMoodleUsers().catch(e => {
            console.warn('Failed to fetch Moodle users:', e.message);
            return { data: [] };
          }),
          getMoodleCourses().catch(e => {
            console.warn('Failed to fetch Moodle courses:', e.message);
            return { data: [] };
          }),
          getOrders().catch(e => {
            console.warn('Failed to fetch orders:', e.message);
            return { data: [] };
          }),
          getFaculty().catch(e => {
            console.warn('Failed to fetch faculty:', e.message);
            return { data: [] };
          }),
        ]);

        const students = studentsResult.status === 'fulfilled'
          ? (studentsResult.value?.data?.users || studentsResult.value?.data || [])
          : [];

        const courses = coursesResult.status === 'fulfilled'
          ? (Array.isArray(coursesResult.value?.data) ? coursesResult.value.data : [])
          : [];

        const orders = ordersResult.status === 'fulfilled'
          ? (ordersResult.value?.data?.data || ordersResult.value?.data || [])
          : [];

        const faculty = facultyResult.status === 'fulfilled'
          ? (facultyResult.value?.data?.data || facultyResult.value?.data || [])
          : [];

        setSearchData({
          students: Array.isArray(students) ? students : [],
          courses: Array.isArray(courses) ? courses : [],
          orders: Array.isArray(orders) ? orders : [],
          faculty: Array.isArray(faculty) ? faculty : [],
        });
      } catch (error) {
        console.error('Error fetching search data:', error);
        // Keep default empty state
      }
    };

    fetchSearchData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const studentSuggestions = searchData.students
      .filter((student) => {
        const fullName = `${student.firstname || ''} ${student.lastname || ''}`.trim();
        return (
          fullName.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student.username?.toLowerCase().includes(query)
        );
      })
      .map((student) => ({
        id: `student-${student.id}`,
        name: `${student.firstname || ''} ${student.lastname || ''}`.trim() || student.username || 'Unknown Student',
        type: 'Student',
        path: `/admin/students?search=${encodeURIComponent(searchQuery.trim())}`,
      }));

    const courseSuggestions = searchData.courses
      .filter((course) => (
        course.fullname?.toLowerCase().includes(query) ||
        course.shortname?.toLowerCase().includes(query) ||
        course.id?.toString().includes(query)
      ))
      .map((course) => ({
        id: `course-${course.id}`,
        name: course.fullname || course.shortname || `Course #${course.id}`,
        type: 'Course',
        path: `/admin/courses?search=${encodeURIComponent(searchQuery.trim())}`,
      }));

    const orderSuggestions = searchData.orders
      .filter((order) => (
        order.studentName?.toLowerCase().includes(query) ||
        order.studentEmail?.toLowerCase().includes(query) ||
        order.courseName?.toLowerCase().includes(query) ||
        order.id?.toString().includes(query)
      ))
      .map((order) => ({
        id: `order-${order.id}`,
        name: order.studentName || `Order #${order.id}`,
        type: 'Order',
        path: `/admin/orders?search=${encodeURIComponent(searchQuery.trim())}`,
      }));

    const facultySuggestions = searchData.faculty
      .filter((facultyMember) => (
        facultyMember.name?.toLowerCase().includes(query) ||
        facultyMember.email?.toLowerCase().includes(query) ||
        facultyMember.expertise?.toLowerCase().includes(query)
      ))
      .map((facultyMember) => ({
        id: `faculty-${facultyMember.id}`,
        name: facultyMember.name || 'Unknown Faculty',
        type: 'Faculty',
        path: `/dashboard/faculty?search=${encodeURIComponent(searchQuery.trim())}`,
      }));

    return [...studentSuggestions, ...courseSuggestions, ...orderSuggestions, ...facultySuggestions].slice(0, 8);
  }, [searchData, searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    setShowSearchSuggestions(false);
    setSearchQuery('');
    router.push(suggestion.path);
  };

  return (
    <div className="bg-white shadow-md h-20 flex items-center justify-between px-4 md:px-8">
      {/* Left Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-xs md:text-sm text-gray-500">{currentTime}</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Search Bar */}
        <div ref={searchContainerRef} className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onFocus={() => setShowSearchSuggestions(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchSuggestions(true);
            }}
            className="w-48 lg:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <MdSearch className="w-5 h-5 text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />

          {showSearchSuggestions && searchQuery.trim() && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 border-gray-100 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">{suggestion.name}</p>
                    <p className="text-xs text-gray-500">{suggestion.type}</p>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">No matching results found</div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MdNotifications className="w-6 h-6 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                  <p className="text-sm font-semibold text-gray-800">New student enrolled</p>
                  <p className="text-xs text-gray-500 mt-1">John Doe enrolled in Web Development</p>
                  <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                </div>
                <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                  <p className="text-sm font-semibold text-gray-800">Course completed</p>
                  <p className="text-xs text-gray-500 mt-1">Sarah completed React Fundamentals</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-semibold text-gray-800">New order received</p>
                  <p className="text-xs text-gray-500 mt-1">Order #1234 - $299.99</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <AdminProfileDropdown />
      </div>
    </div>
  );
};

export default TopNavbar;
