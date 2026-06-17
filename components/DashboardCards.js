import React from 'react';
import DashboardCard from './DashboardCard';

const defaultAnalytics = {
  totalStudents: 0,
  totalCourses: 0,
  totalRevenue: 0,
  totalOrders: 0,
  monthlyGrowthPercentage: 0,
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
};

const DashboardCards = ({ analytics = defaultAnalytics }) => {
  const data = { ...defaultAnalytics, ...analytics };
  const growth = Number(data.monthlyGrowthPercentage || 0);

  const cardsData = [
    {
      id: 1,
      title: 'LMS Students (Moodle)',
      value: (data.totalStudents || 0).toLocaleString(),
      bgColor: 'bg-blue-600',
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      trend: data.totalStudents > 0 ? 'up' : null,
      trendValue: data.totalStudents > 0 ? 'Moodle Connected' : null,
    },
    {
      id: 1.5,
      title: 'Main Site Registrations',
      value: (data.totalLocalUsers || 0).toLocaleString(),
      bgColor: 'bg-indigo-600',
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
      trend: (data.totalLocalUsers || 0) > 0 ? 'up' : null,
      trendValue: (data.totalLocalUsers || 0) > 0 ? 'Hostinger DB' : null,
    },
    {
      id: 2,
      title: 'LMS Courses',
      value: (data.totalCourses || 0).toLocaleString(),
      bgColor: 'bg-emerald-600',
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      trend: data.totalCourses > 0 ? 'up' : null,
      trendValue: data.totalCourses > 0 ? 'Moodle Connected' : null,
    },
    {
      id: 3,
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      bgColor: 'bg-purple-600',
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      trend: growth >= 0 ? 'up' : 'down',
      trendValue: `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%`,
    },
    {
      id: 4,
      title: 'Total Orders',
      value: (data.totalOrders || 0).toLocaleString(),
      bgColor: 'bg-orange-600',
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      trend: data.totalOrders > 0 ? 'up' : null,
      trendValue: data.totalOrders > 0 ? 'Live' : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardsData.map((card) => (
        <DashboardCard
          key={card.id}
          title={card.title}
          value={card.value}
          icon={card.icon}
          bgColor={card.bgColor}
          trend={card.trend}
          trendValue={card.trendValue}
        />
      ))}
    </div>
  );
};

export default DashboardCards;
