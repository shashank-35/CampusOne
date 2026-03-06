import { Link } from 'react-router';
import { ArrowRight, GraduationCap, Users } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Ready to get started?
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Experience
          <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            OmniHub?
          </span>
        </h2>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Start managing your campus smarter today. Students and staff get powerful tools built for modern education.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/student-login"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            <GraduationCap className="h-5 w-5" />
            Student Portal
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-white/15 text-white hover:bg-white/5 font-medium rounded-xl transition-all hover:-translate-y-0.5"
          >
            <Users className="h-5 w-5" />
            Admin / Staff Login
          </Link>
        </div>

        <p className="mt-8 text-slate-600 text-sm">
          No setup required · Instant access · Role-based permissions
        </p>
      </div>
    </section>
  );
}
