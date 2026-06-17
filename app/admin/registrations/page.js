"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const PAGE_SIZE = 10;

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [bootcampType, setBootcampType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchRegistrations = useCallback(async (query = search, type = bootcampType) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      if (type !== "all") params.set("bootcampType", type);

      const response = await fetch(`/api/admin/registrations?${params.toString()}`, { 
        cache: "no-store" 
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch registrations");
      }
      setRegistrations(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch registrations");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [search, bootcampType]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const totalPages = Math.max(1, Math.ceil(registrations.length / PAGE_SIZE));
  const paginated = registrations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Registrations</h1>
            <p className="text-sm text-gray-600 mt-1">Users registered directly from the website registration form (MySQL DB)</p>
          </div>
          <button 
            onClick={() => fetchRegistrations()} 
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Registrations</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{registrations.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Online Bootcamp</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {registrations.filter(r => r.bootcampType === 'online').length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Offline Bootcamp</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {registrations.filter(r => r.bootcampType === 'offline').length}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, mobile, or state"
              className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <select 
              value={bootcampType} 
              onChange={(e) => setBootcampType(e.target.value)} 
              className="px-3 py-2 rounded-lg border border-gray-300 w-full md:w-56 text-black"
            >
              <option value="all">All Bootcamp Types</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <button 
              onClick={() => { setPage(1); fetchRegistrations(); }} 
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition"
            >
              Apply Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Contact Info</th>
                  <th className="px-4 py-3 text-left">Location (State / District)</th>
                  <th className="px-4 py-3 text-left">Bootcamp Type</th>
                  <th className="px-4 py-3 text-left">Class & AI Domain</th>
                  <th className="px-4 py-3 text-left">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-black">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                      Loading registrations...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                      No registrations found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{reg.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div>Email: {reg.email}</div>
                        <div className="text-xs text-gray-500">Mobile: {reg.mobile}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div>{reg.district}, {reg.state}</div>
                        <div className="text-xs text-gray-500 font-mono">{reg.address}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          reg.bootcampType === 'online' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {reg.bootcampType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div>Class: {reg.class}</div>
                        <div className="text-xs text-gray-500">Domain: {reg.aiDomain}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(reg.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <div className="space-x-2">
              <button 
                className="px-3 py-1.5 border rounded-md disabled:opacity-50 text-black hover:bg-gray-50" 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page === 1}
              >
                Previous
              </button>
              <button 
                className="px-3 py-1.5 border rounded-md disabled:opacity-50 text-black hover:bg-gray-50" 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
