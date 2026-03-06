import { Link } from 'react-router';
import { GraduationCap, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Features',    href: '#features' },
  { label: 'Platform',    href: '#platform' },
  { label: 'How it Works',href: '#workflow' },
  { label: 'About',       href: '#stats' },
];

const PORTAL_LINKS = [
  { label: 'Admin Login',   to: '/login' },
  { label: 'Student Portal',to: '/student-login' },
  { label: 'Submit Inquiry',to: '/inquiry-form' },
];

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">OmniHub</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The smart platform for campus management. Built for modern educational institutions.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Portal</h4>
            <ul className="space-y-2.5">
              {PORTAL_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-slate-400 text-sm">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-400" />
                support@omnihub.app
              </li>
              <li className="flex items-start gap-2.5 text-slate-400 text-sm">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-400" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2.5 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-400" />
                Campus Road, Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} OmniHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((label) => (
              <a key={label} href="#" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
