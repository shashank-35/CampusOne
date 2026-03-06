import { useRef, useEffect, useState } from 'react';
import { GraduationCap, BookOpen, Calendar, MessageSquare, Package, Shield, ClipboardList, CreditCard, Activity } from 'lucide-react';

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Student Management',
    desc: 'Complete student profiles, academic history, and enrollment tracking in one centralized system.',
    gradient: 'from-indigo-500 to-indigo-600',
    glow: 'group-hover:shadow-indigo-500/20',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  {
    icon: BookOpen,
    title: 'Course Management',
    desc: 'Create, manage, and organize courses with detailed curricula, scheduling, and fee structures.',
    gradient: 'from-violet-500 to-violet-600',
    glow: 'group-hover:shadow-violet-500/20',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    icon: Calendar,
    title: 'Event Management',
    desc: 'Schedule seminars, workshops, and events. Keep students and staff informed automatically.',
    gradient: 'from-blue-500 to-blue-600',
    glow: 'group-hover:shadow-blue-500/20',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: MessageSquare,
    title: 'Inquiry Tracking',
    desc: 'From first contact to admission — track every inquiry, assign counselors, and never miss a follow-up.',
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'group-hover:shadow-emerald-500/20',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: ClipboardList,
    title: 'Admission Management',
    desc: 'Streamline the admission process with document uploads, approval workflows, and fee tracking.',
    gradient: 'from-orange-500 to-orange-600',
    glow: 'group-hover:shadow-orange-500/20',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  {
    icon: CreditCard,
    title: 'Fee & Payments',
    desc: 'Record payments, track dues, generate PDF receipts, and monitor revenue analytics.',
    gradient: 'from-rose-500 to-rose-600',
    glow: 'group-hover:shadow-rose-500/20',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    desc: 'Manage campus products and inventory with stock tracking and product catalog.',
    gradient: 'from-amber-500 to-amber-600',
    glow: 'group-hover:shadow-amber-500/20',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    icon: Shield,
    title: 'Roles & Permissions',
    desc: 'Granular access control with Admin, Counselor, and Receptionist roles — each with tailored permissions.',
    gradient: 'from-cyan-500 to-cyan-600',
    glow: 'group-hover:shadow-cyan-500/20',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
  },
  {
    icon: Activity,
    title: 'Activity Logs',
    desc: 'Full audit trail of every action. Know exactly who did what and when across your entire campus system.',
    gradient: 'from-slate-500 to-slate-600',
    glow: 'group-hover:shadow-slate-500/20',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
  },
];

export default function Features() {
  const [ref, inView] = useInView();

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-4 border border-indigo-100">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything your campus needs
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            OmniHub brings together all the tools for running a modern educational institution — in one unified platform.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, gradient, glow, bg, text }, i) => (
            <div
              key={title}
              className={`group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl ${glow} hover:-translate-y-1 transition-all duration-300 cursor-default`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5`}>
                <Icon className={`h-6 w-6 ${text}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              {/* Gradient bottom accent */}
              <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
