import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import studentPortalService from '@/services/studentPortalService';

const TYPE_BADGE = {
  seminar:  'bg-blue-100 text-blue-700',
  workshop: 'bg-purple-100 text-purple-700',
  webinar:  'bg-cyan-100 text-cyan-700',
  cultural: 'bg-pink-100 text-pink-700',
  sports:   'bg-green-100 text-green-700',
};

const STATUS_BADGE = {
  upcoming: 'bg-yellow-100 text-yellow-700',
  ongoing:  'bg-green-100 text-green-700',
};

export default function StudentEvents() {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    studentPortalService
      .getEvents()
      .then((res) => setEvents(res.data.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const types = ['all', ...new Set(events.map((e) => e.type).filter(Boolean))];

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <p className="text-gray-500 text-sm mt-0.5">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === t
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">No events found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                    {event.type && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_BADGE[event.type] || 'bg-gray-100 text-gray-600'}`}>
                        {event.type}
                      </span>
                    )}
                    {event.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[event.status] || 'bg-gray-100 text-gray-600'}`}>
                        {event.status}
                      </span>
                    )}
                  </div>

                  {event.detail && (
                    <p className="text-gray-500 text-sm leading-relaxed mt-1">{event.detail}</p>
                  )}

                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-gray-600">
                    {event.date && (
                      <span className="flex items-center gap-1.5">
                        <span>📅</span>
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    )}
                    {event.timing && (
                      <span className="flex items-center gap-1.5">
                        <span>⏰</span>
                        {event.timing}
                      </span>
                    )}
                    {event.place && (
                      <span className="flex items-center gap-1.5">
                        <span>📍</span>
                        {event.place}
                      </span>
                    )}
                    {event.host && (
                      <span className="flex items-center gap-1.5">
                        <span>🎤</span>
                        {event.host}
                      </span>
                    )}
                  </div>
                </div>

                {event.locationLink && (
                  <a
                    href={event.locationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 px-4 py-2 border border-slate-800 text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    View Location
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
