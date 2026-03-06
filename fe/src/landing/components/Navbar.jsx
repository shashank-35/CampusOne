import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';

const LINKS = [
  { label: 'Features',    href: '#features' },
  { label: 'Platform',    href: '#platform' },
  { label: 'How it Works',href: '#workflow' },
  { label: 'About',       href: '#stats' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-4.5 w-4.5 text-white h-5 w-5" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">OmniHub</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            Admin Login
          </Link>
          <Link
            to="/student-login"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/25"
          >
            Student Login <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-1">
          {LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              {label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              Admin Login
            </Link>
            <Link to="/student-login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg">
              Student Login <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
