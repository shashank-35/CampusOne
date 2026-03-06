import { useRef, useEffect, useState } from 'react';
import {
  GraduationCap, BookOpen, Calendar, MessageSquare, Package,
  Users, ClipboardList, CreditCard, BarChart3, QrCode,
} from 'lucide-react';

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

const MODULES = [
  { icon: LayoutDashboard2, label: 'Dashboard Analytics',  desc: 'Real-time stats, charts, and campus overview' },
  { icon: MessageSquare,    label: 'Inquiry System',        desc: 'Lead capture from QR code to counselor assignment' },
  { icon: ClipboardList,    label: 'Admissions',            desc: 'Full admission workflow with document management' },
  { icon: CreditCard,       label: 'Fee Management',        desc: 'Payments, dues, and PDF receipt generation' },
  { icon: GraduationCap,    label: 'Student Portal',        desc: 'Dedicated portal for students to track everything' },
  { icon: BookOpen,         label: 'Courses',               desc: 'Course catalog with fees, duration, and enrollment' },
  { icon: Calendar,         label: 'Events',                desc: 'Campus events, workshops, and seminars' },
  { icon: Package,          label: 'Inventory',             desc: 'Product catalog and stock management' },
  { icon: Users,            label: 'User Management',       desc: 'Staff roles — Admin, Counselor, Receptionist' },
  { icon: BarChart3,        label: 'Reports & Logs',        desc: 'Complete audit trail and activity logging' },
  { icon: QrCode,           label: 'QR Code Forms',         desc: 'Shareable QR code that captures public inquiries' },
];

function LayoutDashboard2(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

export default function Overview() {
  const [ref, inView] = useInView();

  return (
    <section id="platform" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full mb-4 border border-indigo-500/20">
            Platform Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            All modules. One platform.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            OmniHub is a fully integrated suite of tools designed for modern campuses. No more juggling multiple apps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MODULES.map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              className={`group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-default ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 50}ms`, transitionDuration: '600ms' }}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <Icon className="h-5 w-5 text-indigo-400" />
              </div>
              <p className="text-white font-semibold text-sm mb-1">{label}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Two benefit sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
          {/* Students */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-8">
            <GraduationCap className="h-8 w-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Built for Students</h3>
            <ul className="space-y-2.5">
              {[
                'Track inquiry and admission status in real-time',
                'Browse all available courses and their details',
                'Stay updated with upcoming campus events',
                'Connect with assigned counselor easily',
                'Manage profile and account in one place',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Staff */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8">
            <Users className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Powerful for Staff</h3>
            <ul className="space-y-2.5">
              {[
                'Centralized campus management from one dashboard',
                'Automated inquiry assignment to counselors',
                'Complete student lifecycle from inquiry to graduation',
                'PDF receipts and payment tracking built-in',
                'Role-based access so each staff sees only what they need',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
