"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const PAGE_SIZE = 10;

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ userid: "", courseid: "", roleid: 5 });

  const fetchData = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError("");
      const trimmedQuery = query.trim();
      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        fetch(`/api/enrollments${trimmedQuery ? `?search=${encodeURIComponent(trimmedQuery)}` : ""}`, { cache: "no-store" }),
        fetch("/api/students", { cache: "no-store" }),
        fetch("/api/courses", { cache: "no-store" }),
      ]);

      const enrollmentsData = await enrollmentsRes.json();
      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();

      if (!enrollmentsRes.ok || !enrollmentsData.success) throw new Error(enrollmentsData.error || "Failed to fetch enrollments");

      setEnrollments(Array.isArray(enrollmentsData.data) ? enrollmentsData.data : []);
      setStudents(Array.isArray(studentsData.data) ? studentsData.data : []);
      setCourses(Array.isArray(coursesData.data) ? coursesData.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch enrollment data");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addEnrollment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: Number(form.userid),
          courseid: Number(form.courseid),
          roleid: Number(form.roleid || 5),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to enroll student");
      setForm({ userid: "", courseid: "", roleid: 5 });
      await fetchData(search);
    } catch (err) {
      alert(err.message || "Enrollment failed");
    }
  };

  const removeEnrollment = async (row) => {
    if (!confirm(`Remove enrollment for ${row.studentName} from ${row.courseName}?`)) return;
    try {
      const response = await fetch("/api/enrollments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: row.studentId, courseid: row.courseId, roleid: 5 }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to remove enrollment");
      await fetchData(search);
    } catch (err) {
      alert(err.message || "Unenrollment failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil(enrollments.length / PAGE_SIZE));
  const paginated = useMemo(() => enrollments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [enrollments, page]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enrollment System</h1>
          <p className="text-sm text-gray-600 mt-1">Enroll students to courses and remove enrollments</p>
        </div>

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <form onSubmit={addEnrollment} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <select className="px-3 py-2 rounded-lg border border-gray-300 md:col-span-2" value={form.userid} onChange={(e) => setForm((s) => ({ ...s, userid: e.target.value }))} required>
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
            ))}
          </select>
          <select className="px-3 py-2 rounded-lg border border-gray-300 md:col-span-2" value={form.courseid} onChange={(e) => setForm((s) => ({ ...s, courseid: e.target.value }))} required>
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title || course.shortname || `Course #${course.id}`}</option>
            ))}
          </select>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Enroll</button>
        </form>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-3 md:items-center">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enrollments" className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-300" />
            <button onClick={() => { setPage(1); fetchData(search); }} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Search</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Student name</th>
                  <th className="px-4 py-3 text-left">Course name</th>
                  <th className="px-4 py-3 text-left">Enrollment date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">Loading enrollments...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">No enrollments found.</td></tr>
                ) : (
                  paginated.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.studentName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.courseName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.enrollmentDate ? new Date(row.enrollmentDate).toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${row.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button onClick={() => removeEnrollment(row)} className="text-red-600 hover:text-red-800">Remove</button>
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
              <button className="px-3 py-1.5 border rounded-md disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
              <button className="px-3 py-1.5 border rounded-md disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
