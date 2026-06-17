"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async (query = search, paymentStatus = status) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      if (paymentStatus !== "all") params.set("paymentStatus", paymentStatus);

      const response = await fetch(`/api/orders?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to fetch orders");
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.paymentStatus === "Paid").reduce((sum, order) => sum + Number(order.amount || 0), 0),
    [orders]
  );

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments & Orders</h1>
            <p className="text-sm text-gray-600 mt-1">Razorpay payment transactions and revenue insights</p>
          </div>
          <button onClick={fetchOrders} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Refresh</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order/student/course"
              className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-300"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 w-full md:w-56">
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button onClick={() => { setPage(1); fetchOrders(); }} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Apply</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Payment status</th>
                  <th className="px-4 py-3 text-left">Payment date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">Loading orders...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No orders found.</td></tr>
                ) : (
                  paginated.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{order.orderId || order.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div>{order.studentName || "N/A"}</div>
                        <div className="text-xs text-gray-500">{order.studentEmail || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.courseName || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">₹{Number(order.amount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : order.paymentStatus === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.paymentDate ? new Date(order.paymentDate).toLocaleString() : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <div className="space-x-2">
              <button className="px-3 py-1.5 border rounded-md disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
              <button className="px-3 py-1.5 border rounded-md disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
