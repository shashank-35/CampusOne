import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import studentPortalService from '@/services/studentPortalService';

const STATUS_BADGE = {
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  draft:    'bg-yellow-100 text-yellow-700',
};

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    studentPortalService
      .getCourses()
      .then((res) => setCourses(res.data.data))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-medium">No courses found</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-slate-800 text-sm hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-900 leading-snug">{course.title}</h3>
                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    STATUS_BADGE[course.status] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {course.status}
                </span>
              </div>

              {course.description && (
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                  {course.description}
                </p>
              )}

              <div className="mt-auto space-y-1.5 text-sm">
                {course.duration && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>⏱</span>
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.fees && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>💰</span>
                    <span>{course.fees}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
