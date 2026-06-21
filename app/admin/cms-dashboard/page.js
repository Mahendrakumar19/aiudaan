"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  MdSlideshow, 
  MdLayers, 
  MdHelpOutline, 
  MdPeople, 
  MdSearch, 
  MdFilterList, 
  MdAdd, 
  MdDelete, 
  MdSave,
  MdCheckCircle,
  MdErrorOutline
} from "react-icons/md";

export default function SiteAdministrationPage() {
  const [config, setConfig] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [regsLoading, setRegsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Registrations search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [bootcampFilter, setBootcampFilter] = useState("all");
  
  // Tab states for editor from search params
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";

  const setActiveTab = (tab) => {
    if (tab === "overview") {
      router.push("/admin/cms-dashboard");
    } else {
      router.push(`/admin/cms-dashboard?tab=${tab}`);
    }
  };

  // Fetch CMS config
  useEffect(() => {
    const fetchCmsConfig = async () => {
      try {
        setCmsLoading(true);
        const res = await fetch("/api/admin/cms");
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to load config");
        setConfig(data.config);
      } catch (err) {
        setError(err.message);
      } finally {
        setCmsLoading(false);
      }
    };
    fetchCmsConfig();
  }, []);

  // Fetch Website registrations
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setRegsLoading(true);
        const res = await fetch("/api/admin/registrations");
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to load registrations");
        setRegistrations(data.data || []);
      } catch (err) {
        console.error("Error fetching registrations:", err);
      } finally {
        setRegsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  // Save CMS Config
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
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // CMS configuration helpers
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

  // Filter registrations list
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = 
        (reg.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.mobile || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.state || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.district || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBootcamp = 
        bootcampFilter === "all" || 
        (reg.bootcampType || "online").toLowerCase() === bootcampFilter.toLowerCase();
      
      return matchesSearch && matchesBootcamp;
    });
  }, [registrations, searchQuery, bootcampFilter]);

  // Shared registrations list element
  const registrationsTableElement = (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-syne">Website Registrations</h2>
          <p className="text-xs text-slate-500 mt-0.5">Students who signed up directly on aiudaanbootcamp.com</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search registrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-56 px-3 py-1.5 pl-8 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all placeholder:text-slate-400"
            />
            <MdSearch className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="relative flex items-center">
            <select
              value={bootcampFilter}
              onChange={(e) => setBootcampFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-800 cursor-pointer"
            >
              <option value="all">All Bootcamp Types</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <MdFilterList className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Registrations Table Container */}
      <div className="mt-4 overflow-x-auto min-h-[300px]">
        {regsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-950 mb-3"></div>
            <span className="text-sm font-medium">Fetching registrations...</span>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <MdPeople className="w-12 h-12 mb-2 text-slate-300" />
            <span className="text-sm font-medium">No registrations match your search.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-2">Name / Email</th>
                <th className="py-3 px-2">Mobile</th>
                <th className="py-3 px-2">State / District</th>
                <th className="py-3 px-2">Class / Domain</th>
                <th className="py-3 px-2">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-2 max-w-[200px]">
                    <div className="font-semibold text-slate-950 truncate">{reg.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{reg.email}</div>
                  </td>
                  <td className="py-3 px-2 font-medium text-slate-600">{reg.mobile}</td>
                  <td className="py-3 px-2">
                    <div className="text-slate-700">{reg.state}</div>
                    <div className="text-[10px] text-slate-400">{reg.district}</div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-slate-700">Class: {reg.class}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{reg.aiDomain}</div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                      (reg.bootcampType || 'online').toLowerCase() === 'online' 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {reg.bootcampType || 'online'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F9FAFB] text-slate-800 font-sans pb-12">
        {/* Header Block */}
        <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 font-syne tracking-tight">CMS Dashboard</h1>
              <p className="mt-1.5 text-sm text-slate-500 font-medium">
                Manage the main website hero sliders, program cards, dynamic FAQ items, and view portal registrations.
              </p>
            </div>
            <div>
              <button
                onClick={handleSave}
                disabled={saving || !config}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Config Changes"}
              </button>
            </div>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="mt-4 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium animate-fadeIn">
              <MdCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm font-medium animate-fadeIn">
              <MdErrorOutline className="w-5 h-5 text-rose-600 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Website Sign-Ups" 
            value={regsLoading ? "..." : registrations.length} 
            subtitle="Local registrations"
            icon={<MdPeople className="w-6 h-6 text-indigo-600" />}
            iconBg="bg-indigo-50 border border-indigo-100"
            onClick={() => setActiveTab("registrations")}
          />
          <StatCard 
            title="Carousel Slides" 
            value={cmsLoading || !config ? "..." : config.slides?.length || 0} 
            subtitle="Hero banners"
            icon={<MdSlideshow className="w-6 h-6 text-emerald-600" />}
            iconBg="bg-emerald-50 border border-emerald-100"
            onClick={() => setActiveTab("slides")}
          />
          <StatCard 
            title="Active Programs" 
            value={cmsLoading || !config ? "..." : config.programs?.length || 0} 
            subtitle="Landing page grids"
            icon={<MdLayers className="w-6 h-6 text-amber-600" />}
            iconBg="bg-amber-50 border border-amber-100"
            onClick={() => setActiveTab("programs")}
          />
          <StatCard 
            title="Faq Questions" 
            value={cmsLoading || !config ? "..." : config.faqs?.length || 0} 
            subtitle="Help topics"
            icon={<MdHelpOutline className="w-6 h-6 text-rose-600" />}
            iconBg="bg-rose-50 border border-rose-100"
            onClick={() => setActiveTab("faqs")}
          />
        </div>

        {/* Main Section */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-12">
              {registrationsTableElement}
            </div>
          </div>
        )}

        {activeTab === "registrations" && (
          <div className="grid grid-cols-1 gap-8">
            {registrationsTableElement}
          </div>
        )}

        {(activeTab === "slides" || activeTab === "programs" || activeTab === "faqs") && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-syne capitalize">{activeTab} Manager</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize layouts on the home landing page instantly</p>
              </div>
              <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100">
                {["slides", "programs", "faqs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 capitalize ${
                      activeTab === tab 
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {cmsLoading || !config ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-950 mb-2"></div>
                  <span className="text-xs">Loading CMS Fields...</span>
                </div>
              ) : (
                <>
                  {/* Slides Tab */}
                  {activeTab === "slides" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Carousel Slides ({config.slides?.length || 0})</h3>
                        <button
                          onClick={addSlide}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <MdAdd className="w-4 h-4" /> Add Slide
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.slides?.map((slide, idx) => (
                          <div key={idx} className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all space-y-4 relative group">
                            <button
                              onClick={() => removeSlide(idx)}
                              className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Delete Slide"
                            >
                              <MdDelete className="w-4 h-4" />
                            </button>
                            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Slide #{idx + 1}</div>
                            
                            <div className="space-y-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500">Title</label>
                                <input
                                  type="text"
                                  value={slide.title}
                                  onChange={(e) => updateSlideField(idx, "title", e.target.value)}
                                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500">Background Image Path / URL</label>
                                <input
                                  type="text"
                                  value={slide.bg}
                                  onChange={(e) => updateSlideField(idx, "bg", e.target.value)}
                                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500">CTA Text</label>
                                <input
                                  type="text"
                                  value={slide.cta}
                                  onChange={(e) => updateSlideField(idx, "cta", e.target.value)}
                                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                />
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200/60">
                              <div className="text-[10px] font-bold text-slate-400 mb-2.5 uppercase tracking-wide">Slide Stat Badges</div>
                              <div className="grid grid-cols-2 gap-3">
                                {slide.stats?.map((stat, sIdx) => (
                                  <div key={sIdx} className="p-3 border border-slate-200/60 rounded-lg bg-white space-y-2">
                                    <input
                                      type="text"
                                      placeholder="Value (e.g. 50+)"
                                      value={stat.value}
                                      onChange={(e) => updateSlideStat(idx, sIdx, "value", e.target.value)}
                                      className="w-full px-1.5 py-0.5 border-b border-transparent focus:border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Label"
                                      value={stat.label}
                                      onChange={(e) => updateSlideStat(idx, sIdx, "label", e.target.value)}
                                      className="w-full px-1.5 py-0.5 border-b border-transparent focus:border-slate-300 text-[10px] text-slate-500 focus:outline-none"
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

                  {/* Programs Tab */}
                  {activeTab === "programs" && (
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Course / Program Description Cards</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.programs?.map((prog, idx) => (
                          <div key={idx} className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all space-y-4">
                            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Program Card #{idx + 1}</div>
                            
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500">Title</label>
                                  <input
                                    type="text"
                                    value={prog.title}
                                    onChange={(e) => updateProgramField(idx, "title", e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500">Tag / Label</label>
                                  <input
                                    type="text"
                                    value={prog.tag}
                                    onChange={(e) => updateProgramField(idx, "tag", e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500">Emoji / Icon Symbol</label>
                                <input
                                  type="text"
                                  value={prog.icon}
                                  onChange={(e) => updateProgramField(idx, "icon", e.target.value)}
                                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500">Description</label>
                                <textarea
                                  value={prog.description}
                                  onChange={(e) => updateProgramField(idx, "description", e.target.value)}
                                  rows={3}
                                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                />
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200/60">
                              <div className="text-[10px] font-bold text-slate-400 mb-2.5 uppercase tracking-wide">Card Highlights</div>
                              <div className="grid grid-cols-3 gap-2">
                                {prog.highlights?.map((hl, hlIdx) => (
                                  <div key={hlIdx} className="flex flex-col gap-1">
                                    <span className="text-[9px] text-slate-400 font-semibold">Highlight #{hlIdx + 1}</span>
                                    <input
                                      type="text"
                                      value={hl}
                                      onChange={(e) => updateProgramHighlight(idx, hlIdx, e.target.value)}
                                      className="px-2 py-1.5 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
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

                  {/* FAQs Tab */}
                  {activeTab === "faqs" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Frequently Asked Questions ({config.faqs?.length || 0})</h3>
                        <button
                          onClick={addFaq}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <MdAdd className="w-4 h-4" /> Add FAQ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.faqs?.map((faq, idx) => (
                          <div key={idx} className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all space-y-4 relative group">
                            <button
                              onClick={() => removeFaq(idx)}
                              className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Delete FAQ"
                            >
                              <MdDelete className="w-4 h-4" />
                            </button>
                            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">FAQ #{idx + 1}</div>

                            <div className="space-y-3">
                              <div className="flex flex-col gap-1 pr-8">
                                <label className="text-[10px] font-bold text-slate-500">Question</label>
                                <input
                                  type="text"
                                  value={faq.q}
                                  onChange={(e) => updateFaq(idx, "q", e.target.value)}
                                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white font-bold"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500">Answer</label>
                                <textarea
                                  value={faq.a}
                                  onChange={(e) => updateFaq(idx, "a", e.target.value)}
                                  rows={3}
                                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, subtitle, icon, iconBg, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
      </div>
      <div className={`p-3.5 rounded-xl ${iconBg} shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
