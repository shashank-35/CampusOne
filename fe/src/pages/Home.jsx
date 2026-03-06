import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Users, GraduationCap, Calendar, MessageSquare, Package, BookOpen,
  TrendingUp, Clock, CheckCircle, ClipboardList, BarChart2, Star, CreditCard, Wallet, AlertCircle,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import dashboardService from '@/services/dashboardService';
import { useAuth } from '@/context/AuthContext';

const STATUS_COLORS = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  interested: '#8b5cf6',
  'admission-done': '#10b981',
  'not-interested': '#ef4444',
  closed: '#6b7280',
};

const StatCard = ({ label, value, icon: Icon, color, link }) => (
  <Link to={link || '#'}>
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  </Link>
);

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats]               = useState({});
  const [monthly, setMonthly]           = useState([]);
  const [statusData, setStatusData]     = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, m, st, r, ps, mr] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getMonthlyInquiries(),
          dashboardService.getInquiryStatus(),
          dashboardService.getRecentInquiries(),
          dashboardService.getPaymentStats(),
          dashboardService.getMonthlyRevenue(),
        ]);
        setStats(s.data.data || {});
        setMonthly(m.data.data || []);
        setStatusData(
          (st.data.data || []).map((d) => ({ name: d.status, value: d.count }))
        );
        setRecentInquiries(r.data.data || []);
        setPaymentStats(ps.data.data || {});
        setMonthlyRevenue(mr.data.data || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fmt = (n) => n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

  const adminCards = [
    { label: 'Total Students',        value: stats.totalStudents       ?? 0,  icon: GraduationCap, color: 'bg-blue-500',    link: '/student' },
    { label: 'Total Admissions',      value: stats.totalAdmissions     ?? 0,  icon: ClipboardList, color: 'bg-emerald-500', link: '/admission' },
    { label: 'Total Revenue',         value: fmt(paymentStats.totalRevenue    || 0), icon: Wallet,   color: 'bg-green-600',   link: '/payment' },
    { label: 'This Month Revenue',    value: fmt(paymentStats.thisMonthRevenue || 0), icon: CreditCard, color: 'bg-teal-500', link: '/payment' },
    { label: 'Pending Payments',      value: paymentStats.pendingCount ?? 0,  icon: AlertCircle,   color: 'bg-orange-500',  link: '/payment?status=pending' },
    { label: 'Total Pending Amount',  value: fmt(paymentStats.totalPending    || 0), icon: TrendingUp, color: 'bg-red-500',  link: '/payment' },
    { label: 'New Inquiries',         value: stats.newInquiries        ?? 0,  icon: MessageSquare, color: 'bg-orange-400',  link: '/inquiry' },
    { label: 'Admissions This Month', value: stats.admissionsThisMonth ?? 0,  icon: CheckCircle,   color: 'bg-purple-500',  link: '/admission' },
    { label: 'Conversion Rate',       value: `${stats.conversionRate   ?? 0}%`, icon: BarChart2,   color: 'bg-cyan-500',    link: '/admission' },
    { label: 'Total Courses',         value: stats.totalCourses        ?? 0,  icon: BookOpen,      color: 'bg-indigo-500',  link: '/course' },
    { label: 'Upcoming Events',       value: stats.upcomingEvents      ?? 0,  icon: Calendar,      color: 'bg-pink-500',    link: '/event' },
    { label: 'Total Users',           value: stats.totalUsers          ?? 0,  icon: Users,         color: 'bg-slate-500',   link: '/user' },
  ];

  const counselorCards = [
    { label: 'New Inquiries',         value: stats.newInquiries        ?? 0, icon: MessageSquare, color: 'bg-orange-500',  link: '/inquiry' },
    { label: 'Total Admissions',      value: stats.totalAdmissions     ?? 0, icon: ClipboardList, color: 'bg-emerald-500', link: '/admission' },
    { label: 'This Month Revenue',    value: fmt(paymentStats.thisMonthRevenue || 0), icon: CreditCard, color: 'bg-teal-500', link: '/payment' },
    { label: 'Pending Payments',      value: paymentStats.pendingCount ?? 0, icon: AlertCircle,   color: 'bg-orange-500',  link: '/payment' },
  ];

  const receptionistCards = [
    { label: 'New Inquiries',         value: stats.newInquiries    ?? 0, icon: MessageSquare, color: 'bg-orange-500',  link: '/inquiry' },
    { label: 'Total Admissions',      value: stats.totalAdmissions ?? 0, icon: ClipboardList, color: 'bg-emerald-500', link: '/admission' },
    { label: 'Pending Payments',      value: paymentStats.pendingCount ?? 0, icon: AlertCircle, color: 'bg-red-500',   link: '/payment' },
    { label: 'Total Students',        value: stats.totalStudents   ?? 0, icon: GraduationCap, color: 'bg-blue-500',    link: '/student' },
  ];

  const cards = user?.role === 'admin'
    ? adminCards
    : user?.role === 'counselor'
    ? counselorCards
    : receptionistCards;

  const recentStatusBadge = (status) => {
    const map = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-orange-100 text-orange-700',
      interested: 'bg-purple-100 text-purple-700',
      'admission-done': 'bg-green-100 text-green-700',
      'not-interested': 'bg-red-100 text-red-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-500 mt-1">Here's what's happening at OmniHub today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts (admin only) */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Inquiries Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Inquiries (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" name="Inquiries" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Inquiry Status Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inquiry Status</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm text-center mt-10">No data yet</p>
            )}
          </div>
        </div>
      )}

      {/* Payment Analytics (admin only) */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Monthly Revenue (Last 6 Months)</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">₹ INR</span>
            </div>
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyRevenue} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
                    tick={{ fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm text-center mt-16">No revenue data yet</p>
            )}
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h2>
            {paymentStats.methodBreakdown?.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={paymentStats.methodBreakdown}
                      dataKey="amount"
                      nameKey="method"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      labelLine={false}
                    >
                      {paymentStats.methodBreakdown.map((m, i) => (
                        <Cell key={m.method} fill={['#3b82f6','#10b981','#8b5cf6','#f59e0b'][i % 4]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {paymentStats.methodBreakdown.map((m, i) => (
                    <div key={m.method} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: ['#3b82f6','#10b981','#8b5cf6','#f59e0b'][i % 4] }}
                        />
                        <span className="text-gray-600 uppercase text-xs font-medium">{m.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-xs">₹{m.amount.toLocaleString('en-IN')}</p>
                        <p className="text-gray-400 text-xs">{m.count} txn{m.count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm text-center mt-10">No payment data yet</p>
            )}
          </div>
        </div>
      )}

      {/* Payment Summary Cards (all roles) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs text-gray-400 mb-1">Total Collected</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{(paymentStats.totalRevenue || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs text-gray-400 mb-1">This Month</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{(paymentStats.thisMonthRevenue || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-400 mt-1">Current month</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs text-gray-400 mb-1">Pending Amount</p>
          <p className="text-2xl font-bold text-red-500">
            ₹{(paymentStats.totalPending || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-400 mt-1">{paymentStats.pendingCount ?? 0} unpaid records</p>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Inquiries</h2>
          <Link to="/inquiry" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Mobile</th>
                <th className="p-4 text-left">Source</th>
                <th className="p-4 text-left">Assigned To</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left flex items-center gap-1"><Clock className="h-3 w-3" /> Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentInquiries.length === 0 ? (
                <tr><td colSpan="6" className="p-6 text-center text-gray-400">No recent inquiries</td></tr>
              ) : (
                recentInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">
                      {inq.firstName} {inq.lastName}
                    </td>
                    <td className="p-4 text-gray-600">{inq.mobile || '—'}</td>
                    <td className="p-4 text-gray-600 capitalize">{inq.sourceOfInquiry || '—'}</td>
                    <td className="p-4 text-gray-600">
                      {inq.assignedTo ? `${inq.assignedTo.firstName} ${inq.assignedTo.lastName}` : '—'}
                    </td>
                    <td className="p-4">{recentStatusBadge(inq.status)}</td>
                    <td className="p-4 text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
