import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Sparkles, LayoutDashboard, Users, BookOpen, Calendar } from 'lucide-react';

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow */}
      <div className="absolute -inset-4 bg-indigo-500/20 rounded-3xl blur-2xl" />

      {/* Browser frame */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-slate-900">
        {/* Browser bar */}
        <div className="bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 bg-slate-700 rounded-md px-3 py-1 text-[11px] text-slate-400 text-center truncate">
            omnihub.app/dashboard
          </div>
        </div>

        {/* Dashboard layout */}
        <div className="flex h-64 sm:h-80">
          {/* Sidebar */}
          <div className="w-14 bg-slate-950 border-r border-white/5 flex flex-col items-center py-3 gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mb-1">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            {[Users, BookOpen, Calendar].map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-slate-500" />
              </div>
            ))}
            {[1,2,3].map((i) => (
              <div key={i} className="w-8 h-2 rounded bg-slate-800" />
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 bg-slate-900 space-y-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="h-3 bg-slate-700 rounded w-32" />
              <div className="h-6 bg-indigo-600/30 rounded-lg w-20" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { c: 'bg-indigo-500/10 border-indigo-500/20', b: 'bg-indigo-500/40' },
                { c: 'bg-violet-500/10 border-violet-500/20', b: 'bg-violet-500/40' },
                { c: 'bg-emerald-500/10 border-emerald-500/20', b: 'bg-emerald-500/40' },
                { c: 'bg-amber-500/10 border-amber-500/20', b: 'bg-amber-500/40' },
              ].map(({ c, b }, i) => (
                <div key={i} className={`rounded-xl border p-2.5 ${c}`}>
                  <div className={`h-2 rounded w-3/4 mb-2 ${b}`} />
                  <div className="h-4 bg-white/20 rounded w-1/2" />
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 bg-slate-800/60 rounded-xl p-3 border border-white/5 space-y-2">
                <div className="h-2 bg-slate-700 rounded w-24" />
                <div className="flex items-end gap-1 h-12">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 5
                          ? 'linear-gradient(to top, #6366f1, #8b5cf6)'
                          : 'rgba(99,102,241,0.25)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 border border-white/5 space-y-1.5">
                <div className="h-2 bg-slate-700 rounded w-16" />
                {[['Paid', 'bg-emerald-500', '60%'], ['Partial', 'bg-amber-500', '25%'], ['Pending', 'bg-red-500', '15%']].map(([l, c, w]) => (
                  <div key={l} className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-[9px] text-slate-500">{l}</span>
                      <span className="text-[9px] text-slate-400">{w}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${c} rounded-full`} style={{ width: w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table row */}
            <div className="bg-slate-800/40 rounded-xl border border-white/5 p-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 bg-slate-600 rounded w-20" />
                <div className="ml-auto h-4 bg-indigo-600/20 rounded w-12" />
              </div>
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center gap-2 py-1 border-t border-white/5">
                  <div className="w-5 h-5 rounded-full bg-slate-700 flex-shrink-0" />
                  <div className="h-1.5 bg-slate-700 rounded flex-1" />
                  <div className="h-3 bg-emerald-500/20 rounded w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen bg-slate-950 flex items-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
              <Sparkles className="h-3 w-3" />
              Smart Campus Management Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              The Smart Platform
              <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                for Campus Management
              </span>
            </h1>

            <p className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-8 max-w-lg">
              Manage students, courses, events, inquiries, and campus operations from a single intelligent platform. Built for modern educational institutions.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/student-login"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Student Portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-3 border border-white/15 text-white hover:bg-white/5 font-medium rounded-xl transition-all"
              >
                Admin Login
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
              {['500+ Students', '50+ Courses', '200+ Events'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — mockup */}
          <div className={`transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <DashboardMockup />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
