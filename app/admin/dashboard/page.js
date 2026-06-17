"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCards from "@/components/DashboardCards";
import StudentsTable from "@/components/StudentsTable";
import RecentEnrollmentsTable from "@/components/RecentEnrollmentsTable";

const initialDashboardData = {
  totalStudents: 0,
  totalCourses: 0,
  totalRevenue: 0,
  totalOrders: 0,
  monthlyGrowthPercentage: 0,
  recentStudents: [],
  recentEnrollments: [],
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/dashboard", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load dashboard analytics");
        }

        setDashboardData({ ...initialDashboardData, ...result });
      } catch (fetchError) {
        console.error("Dashboard fetch error:", fetchError);
        setError(fetchError.message || "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      {/* Dashboard Cards Grid */}
      <DashboardCards analytics={dashboardData} />

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Recent Students + Enrollments */}
      <div className="mt-8 grid grid-cols-1 gap-8">
        <StudentsTable students={dashboardData.recentStudents} />
        <RecentEnrollmentsTable enrollments={dashboardData.recentEnrollments} />
      </div>

      {loading && (
        <div className="mt-6 text-sm text-gray-500">Refreshing dashboard data...</div>
      )}
    </DashboardLayout>
  );
}
