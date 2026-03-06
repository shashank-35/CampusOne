import { useState, useEffect } from 'react';
import { BookOpen, Clock, Search, Users, Star, CalendarDays, BadgeCheck } from 'lucide-react';
import studentPortalService from '@/services/studentPortalService';

function CourseCard({ course }) {
  const colorMap = [
    'from-indigo-500 to-indigo-600',
    'from-violet-500 to-violet-600',
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-rose-500 to-rose-600',
    'from-amber-500 to-amber-600',
  ];
  const gradient = colorMap[Math.abs(course.title?.charCodeAt(0) || 0) % colorMap.length];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      {/* Header band */}
      <div className={`h-28 bg-gradient-to-br ${gradient} relative flex items-end p-4`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent)]" />
        <div className="relative w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
        )}

        <div className="space-y-2 text-xs text-gray-500">
          {course.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              {course.duration}
            </div>
          )}
          {course.batch && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              Batch: {course.batch}
            </div>
          )}
          {course.enrolledOn && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
              Enrolled: {new Date(course.enrolledOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
          {course.fees > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-gray-400" />
              ₹{Number(course.fees)?.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {course.admissionStatus && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
              course.admissionStatus === 'approved'
                ? 'bg-green-50 text-green-700'
                : course.admissionStatus === 'pending'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-red-50 text-red-600'
            }`}>
              <BadgeCheck className="h-3 w-3" />
              {course.admissionStatus}
            </span>
          )}
          {course.paymentStatus && (
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
              course.paymentStatus === 'paid'
                ? 'bg-blue-50 text-blue-700'
                : course.paymentStatus === 'partial'
                ? 'bg-orange-50 text-orange-600'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {course.paymentStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    studentPortalService.getCourses()
      .then((res) => setCourses(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <p className="text-sm text-gray-500 mt-0.5">Courses you are enrolled in</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? [1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)
          : filtered.length > 0
            ? filtered.map((c) => <CourseCard key={c._id} course={c} />)
            : (
              <div className="col-span-full py-16 text-center">
                <BookOpen className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  {search ? 'No matching courses' : 'No enrolled courses yet'}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="mt-2 text-indigo-600 text-sm hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )
        }
      </div>
    </div>
  );
}
