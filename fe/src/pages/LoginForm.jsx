import { useNavigate, Link } from 'react-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Enter email and password'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex-col justify-between p-12 relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">OmniHub</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Admin &<br />Staff Portal
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Manage students, inquiries, admissions, and the entire campus from one place.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Student Management', 'Inquiry Tracking', 'Fee Collection', 'Event Management'].map((f) => (
              <div key={f} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <p className="text-white text-sm font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-sm">
          © {new Date().getFullYear()} OmniHub. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">OmniHub</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-slate-400 text-sm mb-8">Access your admin or staff account</p>

          <form onSubmit={submitHandler} noValidate className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@omnihub.app"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 mt-2"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                : <>Sign In <ArrowRight className="h-4 w-4" /></>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-center">
            <Link to="/student-login" className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Student? Sign in to your portal →
            </Link>
            <Link to="/inquiry-form" className="block text-xs text-slate-500 hover:text-slate-400 transition-colors">
              Submit a public inquiry →
            </Link>
            <Link to="/" className="block text-xs text-slate-600 hover:text-slate-500 transition-colors">
              ← Back to home
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-5 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Demo credentials (run `npm run seed` first):</p>
            <p>Admin: admin@campusone.com / admin123</p>
            <p>Counselor: counselor@campusone.com / counselor123</p>
            <p>Receptionist: receptionist@campusone.com / receptionist123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
