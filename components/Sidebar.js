'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  MdAssignment,
  MdLayers,
  MdHelpOutline,
  MdSlideshow
} from 'react-icons/md';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'slides';
  const [isOpen, setIsOpen] = useState(true);

  const isCmsRoute = pathname && pathname.startsWith('/admin/cms-dashboard');

  const handleLogout = async () => {
    try {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminPassword');
      localStorage.removeItem('moodleToken');
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-900 text-white"
      >
        <MdMenu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200/80 text-slate-800 transform transition-transform duration-300 ease-in-out z-40 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-lg">
              {isCmsRoute ? 'N' : 'L'}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                {isCmsRoute ? 'Aiudaan CMS' : 'Aiudaan LMS'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">Pimjo Workspace</span>
            </div>
          </div>

          {/* Navigation Categories */}
          <div className="mt-6 px-4 space-y-6">
            {isCmsRoute ? (
              // CMS Navigation
              <>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4">Main</span>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <Link
                        href="/admin/cms-dashboard"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          pathname === '/admin/cms-dashboard' && !searchParams.get('tab')
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <MdDashboard className="w-5 h-5" />
                        <span>Dashboard Overview</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4">Content</span>
                  <ul className="mt-2 space-y-1">
                    {[
                      { name: 'Hero Slides', tab: 'slides', icon: <MdSlideshow className="w-5 h-5" /> },
                      { name: 'Course Programs', tab: 'programs', icon: <MdLayers className="w-5 h-5" /> },
                      { name: 'FAQ Items', tab: 'faqs', icon: <MdHelpOutline className="w-5 h-5" /> },
                    ].map((item) => (
                      <li key={item.tab}>
                        <Link
                          href={`/admin/cms-dashboard?tab=${item.tab}`}
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            currentTab === item.tab
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4">Growth</span>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <Link
                        href="/admin/cms-dashboard?tab=registrations"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          currentTab === 'registrations'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <MdPeople className="w-5 h-5" />
                        <span>Local Registrations</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              // LMS Navigation
              <>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4">Main</span>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <Link
                        href="/admin/dashboard"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          pathname === '/admin/dashboard'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <MdDashboard className="w-5 h-5" />
                        <span>LMS Overview</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4">Courses & Learning</span>
                  <ul className="mt-2 space-y-1">
                    {[
                      { name: 'Courses', path: '/admin/courses', icon: <MdBook className="w-5 h-5" /> },
                      { name: 'Enrollments', path: '/admin/enrollments', icon: <MdSchool className="w-5 h-5" /> },
                      { name: 'Categories', path: '/admin/categories', icon: <MdCategory className="w-5 h-5" /> },
                    ].map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            pathname === item.path
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4">Students & Sales</span>
                  <ul className="mt-2 space-y-1">
                    {[
                      { name: 'Moodle Students', path: '/admin/students', icon: <MdPeople className="w-5 h-5" /> },
                      { name: 'Website Registrations', path: '/admin/registrations', icon: <MdAssignment className="w-5 h-5" /> },
                      { name: 'Transactions', path: '/admin/orders', icon: <MdShoppingCart className="w-5 h-5" /> },
                    ].map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            pathname === item.path
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom elements */}
        <div className="p-4 space-y-4">
          {/* Storage Usage Component */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>System Storage</span>
              <span>80%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">8.0 GB of 10 GB used</span>
            <a href="#" className="text-xs text-indigo-600 font-bold block mt-2 hover:underline">Upgrade Plan</a>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg w-full hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all duration-200 text-xs font-semibold"
          >
            <MdLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
