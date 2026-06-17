"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const PAGE_SIZE = 10;
const initialForm = {
  title: "",
  shortname: "",
  categoryid: 1,
  description: "",
  price: 0,
  status: "Published",
  instructor: "Admin",
  duration: "12 weeks",
  level: "Beginner",
  rating: 4.5,
  thumbnail: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesRes, categoriesRes] = await Promise.all([
        fetch("/api/courses", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);
      const coursesData = await coursesRes.json();
      const categoriesData = await categoriesRes.json();

      if (!coursesRes.ok || !coursesData.success) throw new Error(coursesData.error || "Failed to load courses");

      setCourses(Array.isArray(coursesData.data) ? coursesData.data : []);
      setCategories(Array.isArray(categoriesData.data) ? categoriesData.data : []);
    } catch (err) {
      setError(err.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerSync = async () => {
    try {
      setSyncing(true);
      setError("");
      const res = await fetch("/api/admin/courses/sync", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Sync failed");
      alert(data.message || "Courses synchronized successfully!");
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to sync courses");
    } finally {
      setSyncing(false);
    }
  };

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => map.set(Number(category.id), category.name));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((course) =>
      (course.title || "").toLowerCase().includes(q) ||
      (course.shortname || "").toLowerCase().includes(q) ||
      String(course.id || "").includes(q) ||
      String(course.moodleId || "").includes(q)
    );
  }, [courses, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setOpenModal(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      title: course.title || "",
      shortname: course.shortname || "",
      categoryid: Number(course.categoryid || 1),
      description: course.description || "",
      price: Number(course.price || 0),
      status: course.status || "Published",
      instructor: course.instructor || "Admin",
      duration: course.duration || "12 weeks",
      level: course.level || "Beginner",
      rating: Number(course.rating || 4.5),
      thumbnail: course.thumbnail || "",
    });
    setOpenModal(true);
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(editing ? `/api/courses/${editing.id}` : "/api/courses", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to save course");
      setOpenModal(false);
      await fetchData();
    } catch (err) {
      alert(err.message || "Save failed");
    }
  };

  const removeCourse = async (course) => {
    if (!confirm(`Delete course ${course.title}?`)) return;
    try {
      const response = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to delete course");
      await fetchData();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage Moodle details and Hostinger marketing customizations</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerSync}
              disabled={syncing}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "Sync from Moodle 🔄"}
            </button>
            <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Create Course</button>
          </div>
        </div>

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-3">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search courses by name, shortname, ID, Moodle ID"
              className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-500">{filtered.length} courses</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Moodle ID</th>
                  <th className="px-4 py-3 text-left">Course name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Instructor</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">Loading courses...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">No courses found.</td></tr>
                ) : (
                  paginated.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{course.moodleId || "Local Only"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        <div className="font-semibold">{course.title || `Course #${course.id}`}</div>
                        {course.duration && <div className="text-xs text-gray-500">{course.duration} • {course.level || "Beginner"}</div>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{categoryMap.get(Number(course.categoryid)) || course.category || "General"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{course.instructor || "Admin"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">₹{Number(course.price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${course.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {course.status || "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-3">
                        <button onClick={() => openEdit(course)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                        <button onClick={() => removeCourse(course)} className="text-red-600 hover:text-red-800">Delete</button>
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

      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setOpenModal(false)}>
          <form onSubmit={saveCourse} className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900">{editing ? "Edit Course Customizations" : "Create Course"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Course Title (Moodle Sync)</label>
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Course title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Shortname (Moodle Sync)</label>
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Shortname" value={form.shortname} onChange={(e) => setForm((s) => ({ ...s, shortname: e.target.value }))} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Category</label>
                <select className="px-3 py-2 rounded-lg border border-gray-300" value={form.categoryid} onChange={(e) => setForm((s) => ({ ...s, categoryid: Number(e.target.value) }))}>
                  {(categories.length ? categories : [{ id: 1, name: "General" }]).map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Price (Local Hostinger DB)</label>
                <input type="number" min="0" step="0.01" className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Price" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Instructor (Local Hostinger DB)</label>
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Instructor name" value={form.instructor} onChange={(e) => setForm((s) => ({ ...s, instructor: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Duration (Local Hostinger DB)</label>
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="e.g. 12 weeks" value={form.duration} onChange={(e) => setForm((s) => ({ ...s, duration: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Level (Local Hostinger DB)</label>
                <select className="px-3 py-2 rounded-lg border border-gray-300" value={form.level} onChange={(e) => setForm((s) => ({ ...s, level: e.target.value }))}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Rating (Local Hostinger DB)</label>
                <input type="number" min="1" max="5" step="0.1" className="px-3 py-2 rounded-lg border border-gray-300" placeholder="4.5" value={form.rating} onChange={(e) => setForm((s) => ({ ...s, rating: Number(e.target.value) }))} />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-semibold text-gray-600">Thumbnail / Cover Image URL (Local Hostinger DB)</label>
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="https://example.com/cover.png" value={form.thumbnail} onChange={(e) => setForm((s) => ({ ...s, thumbnail: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Status</label>
                <select className="px-3 py-2 rounded-lg border border-gray-300" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Description (Moodle Sync)</label>
              <textarea className="w-full px-3 py-2 rounded-lg border border-gray-300" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setOpenModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">{editing ? "Save Customizations" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
