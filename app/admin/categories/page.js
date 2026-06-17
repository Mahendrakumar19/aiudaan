"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const PAGE_SIZE = 10;
const emptyForm = { name: "", description: "", parent: 0 };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchCategories = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError("");
      const trimmedQuery = query.trim();
      const response = await fetch(`/api/categories${trimmedQuery ? `?search=${encodeURIComponent(trimmedQuery)}` : ""}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to fetch categories");
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((category) =>
      (category.name || "").toLowerCase().includes(q) ||
      String(category.id || "").includes(q)
    );
  }, [categories, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name || "",
      description: category.description ? String(category.description).replace(/<[^>]*>/g, "") : "",
      parent: Number(category.parent || 0),
    });
    setOpenModal(true);
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(editing ? `/api/categories/${editing.id}` : "/api/categories", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to save category");
      setOpenModal(false);
      await fetchCategories(search);
    } catch (err) {
      alert(err.message || "Save failed");
    }
  };

  const deleteCategory = async (category) => {
    if (!confirm(`Delete category ${category.name}?`)) return;
    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to delete category");
      await fetchCategories(search);
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage Moodle course categories</p>
          </div>
          <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Create Category</button>
        </div>

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search category by name or ID"
              className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-300"
            />
            <button onClick={() => fetchCategories(search)} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Search</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Courses</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">Loading categories...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">No categories found.</td></tr>
                ) : (
                  paginated.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{category.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{category.description ? String(category.description).replace(/<[^>]*>/g, "").slice(0, 100) : "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{category.coursecount ?? 0}</td>
                      <td className="px-4 py-3 text-sm space-x-3">
                        <button onClick={() => openEdit(category)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                        <button onClick={() => deleteCategory(category)} className="text-red-600 hover:text-red-800">Delete</button>
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
          <form onSubmit={saveCategory} className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900">{editing ? "Edit Category" : "Create Category"}</h3>
            <input className="w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="Category name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
            <textarea className="w-full px-3 py-2 rounded-lg border border-gray-300" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setOpenModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">{editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
