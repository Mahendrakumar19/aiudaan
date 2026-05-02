"use client";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  LightBulbIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

const features = [
  {
    icon: <AcademicCapIcon className="h-8 w-8 text-brand-cyan" />,
    title: "AI-Powered Training",
    desc: "Learn the latest AI tools and techniques with hands-on, project-based curriculum.",
  },
  {
    icon: <LightBulbIcon className="h-8 w-8 text-brand-orange" />,
    title: "Practical Earning",
    desc: "Focus on real-world applications that can help you earn up to ₹1,00,000+.",
  },
  {
    icon: <SparklesIcon className="h-8 w-8 text-brand-blue" />,
    title: "Career Mentorship",
    desc: "Get guidance from industry experts and referral support for high-performing students.",
  },
];

const timeline = [
  {
    year: "2024",
    title: "The Vision",
    desc: "Concept of AI Udaan was born to empower the youth of Bihar with next-gen skills.",
  },
  {
    year: "2025",
    title: "Govt Recognition",
    desc: "Supported by Startup Bihar and recognized for its innovative approach to teaching AI.",
  },
  {
    year: "2026",
    title: "Scale Up",
    desc: "Launching specialized tracks for Election Campaigning and Digital Marketing.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen pb-20">
      <div className="bg-mesh" />
      <div className="grid-lines" />

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto pt-20 pb-12 text-center px-6"
      >
        <h1 className="font-syne text-5xl md:text-7xl font-bold mb-6 leading-tight">
          About <span className="brand-gradient-text">AI Udaan</span>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          AI Udaan Bootcamp is a premier platform dedicated to bridging the AI skill gap. 
          Based out of BIT Gaya, we empower students and professionals to lead the AI revolution.
        </p>
      </motion.section>

      {/* MISSION & VISION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 mb-16"
      >
        <div className="glass p-10 rounded-3xl text-center border-white/5 transition-all duration-500 hover:border-brand-cyan/30">
          <LightBulbIcon className="h-12 w-12 text-brand-cyan mx-auto mb-4" />
          <h2 className="font-syne text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed">
            To democratize high-end AI education by making it accessible, affordable, and practical for everyone, regardless of their coding background.
          </p>
        </div>
        <div className="glass p-10 rounded-3xl text-center border-white/5 transition-all duration-500 hover:border-brand-orange/30">
          <SparklesIcon className="h-12 w-12 text-brand-orange mx-auto mb-4" />
          <h2 className="font-syne text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-text-secondary leading-relaxed">
            To make Bihar a hub for digital innovation and AI excellence, creating thousands of high-earning experts by 2027.
          </p>
        </div>
      </motion.section>

      {/* TIMELINE */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 mb-20"
      >
        <h2 className="font-syne text-4xl font-bold mb-12 text-center">Our Journey</h2>
        <div className="relative border-l-2 border-glass-border pl-8 space-y-12">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-brand-cyan shadow-[0_0_15px_rgba(0,221,235,0.5)]" />
              <div className="glass p-6 rounded-2xl">
                <span className="text-sm font-bold text-brand-orange">{item.year}</span>
                <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* WHAT WE OFFER */}
      <motion.section className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="font-syne text-4xl font-bold mb-12 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass p-8 rounded-3xl text-center hover:bg-white/5 transition-all">
              <div className="mb-6 flex justify-center">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-text-secondary text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
