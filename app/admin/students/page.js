"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const PAGE_SIZE = 10;

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  
  // Create Student Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchStudents = useCallback(async (query = search) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());

      const response = await fetch(`/api/students?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      
      // The API returns { success: true/false, data: [...] }
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch students");
      }
      setStudents(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          password: formPassword || "StudentPass@123",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create student");
      }

      setFormSuccess("Student created successfully!");
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormPassword("");
      
      // Refresh list
      fetchStudents();
      
      // Close modal after brief delay
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
      }, 1500);

    } catch (err) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.username?.toLowerCase().includes(query) ||
      student.phone?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginated = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Directory</h1>
            <p className="text-sm text-gray-600 mt-1">Manage Moodle LMS enrolled students and platform users</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchStudents()} 
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition"
            >
              Refresh
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
            >
              + Add Student
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Directory Students</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredStudents.length}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search student name, email, username or mobile..."
              className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">ID / Username</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Email & Mobile</th>
                  <th className="px-4 py-3 text-left">Join Date</th>
                  <th className="px-4 py-3 text-left">Last Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-black">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      Loading student directory...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        <div>ID: {student.id}</div>
                        <div className="text-xs text-gray-400">User: {student.username}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          {student.profileImageUrl ? (
                            <img src={student.profileImageUrl} alt="" className="w-8 h-8 rounded-full border" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                              {student.firstname?.charAt(0) || student.name?.charAt(0) || "S"}
                            </div>
                          )}
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-gray-900">{student.email}</div>
                        <div className="text-xs text-gray-500">Mobile: {student.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.joinDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.lastAccess}</td>
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

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border text-black">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold font-syne">Create LMS Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black text-xl">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  LMS Password (Optional)
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Must contain upper, lower, digit & special"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  ⚠️ {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
                  ✓ {formSuccess}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  {formSubmitting ? "Creating..." : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
