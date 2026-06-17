const DashboardCard = ({ title, value, icon, trend, trendValue, bgColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          
          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trendValue}
              </span>
              <span className="text-gray-500 text-xs ml-1">vs last month</span>
            </div>
          )}
        </div>

        {/* Right Section - Icon */}
        <div
          className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
