"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const sections = [
  "Users",
  "Courses",
  "Grades",
  "Plugins",
  "Appearance",
  "Server",
  "Reports",
  "Development",
];

export default function SiteAdministrationPage() {
  const [activeSection, setActiveSection] = useState("Users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState({
    users: [],
    courses: [],
    categories: [],
    orders: [],
    env: null,
  });

  const fetchSnapshot = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, coursesRes, categoriesRes, ordersRes, envRes] = await Promise.all([
        fetch("/api/students", { cache: "no-store" }),
        fetch("/api/courses", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/orders", { cache: "no-store" }),
        fetch("/api/check-env", { cache: "no-store" }),
      ]);

      const users = await usersRes.json();
      const courses = await coursesRes.json();
      const categories = await categoriesRes.json();
      const orders = await ordersRes.json();
      const env = await envRes.json();

      setSnapshot({
        users: Array.isArray(users.data) ? users.data : [],
        courses: Array.isArray(courses.data) ? courses.data : [],
        categories: Array.isArray(categories.data) ? categories.data : [],
        orders: Array.isArray(orders.data) ? orders.data : [],
        env,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch administration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const metrics = useMemo(() => {
    const paidOrders = snapshot.orders.filter((order) => order.paymentStatus === "Paid");
    const revenue = paidOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return {
      totalUsers: snapshot.users.length,
      totalCourses: snapshot.courses.length,
      totalCategories: snapshot.categories.length,
      totalRevenue: revenue,
      totalOrders: snapshot.orders.length,
      paidOrders: paidOrders.length,
    };
  }, [snapshot]);

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Site Administration</h1>
              <p className="mt-1 text-sm text-gray-500">API-driven Moodle administration (no embedded Moodle UI).</p>
            </div>
            <button onClick={fetchSnapshot} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium">Refresh Data</button>
          </div>
        </div>

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard title="Users" value={metrics.totalUsers} />
          <MetricCard title="Courses" value={metrics.totalCourses} />
          <MetricCard title="Categories" value={metrics.totalCategories} />
          <MetricCard title="Orders" value={metrics.totalOrders} />
          <MetricCard title="Paid Orders" value={metrics.paidOrders} />
          <MetricCard title="Revenue" value={`₹${metrics.totalRevenue.toFixed(2)}`} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeSection === section ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {loading ? (
            <p className="text-sm text-gray-500">Loading section data...</p>
          ) : (
            <SectionView activeSection={activeSection} snapshot={snapshot} />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SectionView({ activeSection, snapshot }) {
  if (activeSection === "Users") {
    return <SimpleTable title="Users" headers={["Name", "Email", "Status"]} rows={snapshot.users.slice(0, 10).map((user) => [user.name, user.email, user.status])} />;
  }

  if (activeSection === "Courses") {
    return <SimpleTable title="Courses" headers={["Course", "Category", "Status"]} rows={snapshot.courses.slice(0, 10).map((course) => [course.title || `Course #${course.id}`, course.category || "General", course.status || "Draft"])} />;
  }

  if (activeSection === "Grades") {
    const paid = snapshot.orders.filter((order) => order.paymentStatus === "Paid").length;
    return (
      <div className="space-y-2 text-sm text-gray-700">
        <p>Grades are managed via Moodle grading APIs. Current commerce-linked activity can be used to trigger grading workflows.</p>
        <p className="font-medium">Paid learning transactions: {paid}</p>
      </div>
    );
  }

  if (activeSection === "Plugins") {
    return (
      <div className="space-y-2 text-sm text-gray-700">
        <p>Plugin administration should be exposed via custom Moodle web service endpoints.</p>
        <p>Recommended: create Moodle external service functions for plugin list, enable/disable, and settings update.</p>
      </div>
    );
  }

  if (activeSection === "Appearance") {
    return <CmsManager />;
  }

  if (activeSection === "Server") {
    const env = snapshot.env?.envLoaded || {};
    return <SimpleTable title="Server Environment" headers={["Variable", "Status"]} rows={Object.entries(env).filter(([key]) => !key.endsWith("_value") && !key.endsWith("_length")).map(([key, value]) => [key, String(value)])} />;
  }

  if (activeSection === "Reports") {
    return <SimpleTable title="Recent Orders" headers={["Order ID", "Student", "Amount", "Status"]} rows={snapshot.orders.slice(0, 10).map((order) => [order.orderId || order.id, order.studentName || "N/A", `₹${Number(order.amount || 0).toFixed(2)}`, order.paymentStatus])} />;
  }

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <p>Development section provides diagnostics for API integration.</p>
      <p>Connected resources: users, courses, categories, orders, environment checks.</p>
    </div>
  );
}

function CmsManager() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("slides");

  useEffect(() => {
    const fetchCmsConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/cms");
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to load config");
        setConfig(data.config);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCmsConfig();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMsg("");
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save configuration");
      setSuccessMsg("Site configuration saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSlideField = (index, field, value) => {
    const newSlides = [...config.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setConfig({ ...config, slides: newSlides });
  };

  const updateSlideStat = (slideIndex, statIndex, field, value) => {
    const newSlides = [...config.slides];
    const newStats = [...newSlides[slideIndex].stats];
    newStats[statIndex] = { ...newStats[statIndex], [field]: value };
    newSlides[slideIndex] = { ...newSlides[slideIndex], stats: newStats };
    setConfig({ ...config, slides: newSlides });
  };

  const addSlide = () => {
    const newSlide = {
      title: "New Highlight Slide",
      stats: [
        { value: "0+", label: "Metric label" },
        { value: "0+", label: "Metric label" }
      ],
      bg: "./images/college.jpeg",
      cta: "Register Now"
    };
    setConfig({ ...config, slides: [...config.slides, newSlide] });
  };

  const removeSlide = (index) => {
    const newSlides = config.slides.filter((_, i) => i !== index);
    setConfig({ ...config, slides: newSlides });
  };

  const updateProgramField = (index, field, value) => {
    const newPrograms = [...config.programs];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    setConfig({ ...config, programs: newPrograms });
  };

  const updateProgramHighlight = (progIndex, highlightIndex, value) => {
    const newPrograms = [...config.programs];
    const newHighlights = [...newPrograms[progIndex].highlights];
    newHighlights[highlightIndex] = value;
    newPrograms[progIndex] = { ...newPrograms[progIndex], highlights: newHighlights };
    setConfig({ ...config, programs: newPrograms });
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...config.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setConfig({ ...config, faqs: newFaqs });
  };

  const addFaq = () => {
    setConfig({ ...config, faqs: [...config.faqs, { q: "New Question", a: "Answer text" }] });
  };

  const removeFaq = (index) => {
    setConfig({ ...config, faqs: config.faqs.filter((_, i) => i !== index) });
  };

  if (loading) return <p className="text-sm text-gray-500">Loading CMS editor...</p>;
  if (error && !config) return <div className="text-red-600 text-sm">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Homepage Content Management (CMS)</h2>
          <p className="text-xs text-gray-500 font-sans">Configure slides, program information cards, and landing page FAQs</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Configuration 💾"}
        </button>
      </div>

      {successMsg && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">{successMsg}</div>}
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>}

      <div className="flex border-b">
        {["slides", "programs", "faqs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 capitalize transition-colors ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "slides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Hero Slider Slides ({config.slides?.length || 0})</h3>
            <button onClick={addSlide} className="px-3 py-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold">+ Add Slide</button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {(config.slides || []).map((slide, index) => (
              <div key={index} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeSlide(index)}
                  className="absolute top-4 right-4 text-xs font-bold text-red-600 hover:text-red-800"
                >
                  Delete Slide
                </button>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Slide #{index + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">Slide Title</label>
                    <input
                      className="px-3 py-1.5 rounded-lg border bg-white text-sm font-sans"
                      value={slide.title}
                      onChange={(e) => updateSlideField(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">Background Image Path</label>
                    <input
                      className="px-3 py-1.5 rounded-lg border bg-white text-sm font-sans"
                      value={slide.bg}
                      onChange={(e) => updateSlideField(index, "bg", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">CTA Button Text</label>
                    <input
                      className="px-3 py-1.5 rounded-lg border bg-white text-sm font-sans"
                      value={slide.cta}
                      onChange={(e) => updateSlideField(index, "cta", e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="text-xs font-bold text-gray-600">Slide Stat Badges</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slide.stats?.map((stat, statIndex) => (
                      <div key={statIndex} className="p-2 border rounded-lg bg-white grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-gray-500">Value</label>
                          <input
                            className="px-2 py-1 border text-xs rounded font-sans"
                            value={stat.value}
                            onChange={(e) => updateSlideStat(index, statIndex, "value", e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-gray-500">Label</label>
                          <input
                            className="px-2 py-1 border text-xs rounded font-sans"
                            value={stat.label}
                            onChange={(e) => updateSlideStat(index, statIndex, "label", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "programs" && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-700 font-sans">Course / Program Description Cards</h3>
          <div className="grid grid-cols-1 gap-6">
            {(config.programs || []).map((program, index) => (
              <div key={index} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Program #{index + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 font-sans">Program Title</label>
                    <input
                      className="px-3 py-1.5 rounded-lg border bg-white text-sm font-sans"
                      value={program.title}
                      onChange={(e) => updateProgramField(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 font-sans">Tag / Label</label>
                    <input
                      className="px-3 py-1.5 rounded-lg border bg-white text-sm font-sans"
                      value={program.tag}
                      onChange={(e) => updateProgramField(index, "tag", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 font-sans">Icon Emoji</label>
                    <input
                      className="px-3 py-1.5 rounded-lg border bg-white text-sm font-sans"
                      value={program.icon}
                      onChange={(e) => updateProgramField(index, "icon", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2 font-sans">
                    <label className="text-xs font-semibold text-gray-600">Description</label>
                    <textarea
                      className="px-3 py-1.5 rounded-lg border bg-white text-sm"
                      rows={2}
                      value={program.description}
                      onChange={(e) => updateProgramField(index, "description", e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="text-xs font-bold text-gray-600 font-sans">Highlights</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {program.highlights?.map((hl, hlIndex) => (
                      <div key={hlIndex} className="flex flex-col gap-1 font-sans">
                        <label className="text-[10px] font-semibold text-gray-500">Highlight #{hlIndex + 1}</label>
                        <input
                          className="px-2 py-1 border text-xs rounded bg-white"
                          value={hl}
                          onChange={(e) => updateProgramHighlight(index, hlIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 font-sans">Frequently Asked Questions ({config.faqs?.length || 0})</h3>
            <button onClick={addFaq} className="px-3 py-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold">+ Add FAQ</button>
          </div>
          <div className="space-y-4">
            {(config.faqs || []).map((faq, index) => (
              <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="absolute top-4 right-4 text-xs font-bold text-red-600 hover:text-red-800"
                >
                  Delete FAQ
                </button>
                <div className="flex flex-col gap-1 pr-16 font-sans">
                  <label className="text-xs font-semibold text-gray-600 font-sans">Question</label>
                  <input
                    className="px-3 py-1.5 rounded-lg border bg-white text-sm font-bold"
                    value={faq.q}
                    onChange={(e) => updateFaq(index, "q", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 font-sans">
                  <label className="text-xs font-semibold text-gray-600">Answer</label>
                  <textarea
                    className="px-3 py-1.5 rounded-lg border bg-white text-sm"
                    rows={2}
                    value={faq.a}
                    onChange={(e) => updateFaq(index, "a", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleTable({ title, headers, rows }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="overflow-x-auto font-sans">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
            <tr>{headers.map((header) => <th key={header} className="px-3 py-2 text-left">{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr><td colSpan={headers.length} className="px-3 py-6 text-sm text-gray-500 text-center">No records found.</td></tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2 text-sm text-gray-700">{cell}</td>)}</tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
