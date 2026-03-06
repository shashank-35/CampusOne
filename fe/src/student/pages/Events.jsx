import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Clock, Search, Filter } from 'lucide-react';
import studentPortalService from '@/services/studentPortalService';

const TYPE_COLORS = {
  seminar:  'bg-blue-50 text-blue-700 border-blue-200',
  workshop: 'bg-violet-50 text-violet-700 border-violet-200',
  webinar:  'bg-cyan-50 text-cyan-700 border-cyan-200',
  cultural: 'bg-rose-50 text-rose-700 border-rose-200',
  sports:   'bg-green-50 text-green-700 border-green-200',
  other:    'bg-gray-50 text-gray-600 border-gray-200',
};

function EventCard({ event }) {
  const typeCls = TYPE_COLORS[event.eventType] || TYPE_COLORS.other;
  const date = event.eventDate ? new Date(event.eventDate) : null;
  const isPast = date && date < new Date();

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden ${isPast ? 'opacity-70' : ''}`}>
      {/* Date band */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 pt-5 pb-4 flex items-start justify-between">
        {date ? (
          <div className="text-white">
            <p className="text-3xl font-bold leading-none">{date.getDate()}</p>
            <p className="text-indigo-200 text-sm mt-0.5">
              {date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        ) : (
          <div className="text-white text-sm">Date TBD</div>
        )}
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${typeCls}`}>
          {event.eventType || 'Event'}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>

        <div className="space-y-2 text-xs text-gray-500">
          {(event.startTime || event.endTime) && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span>{event.startTime}{event.endTime ? ` — ${event.endTime}` : ''}</span>
            </div>
          )}
          {event.place && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-1">{event.place}</span>
            </div>
          )}
          {event.host && (
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span>{event.host}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="mt-3 text-xs text-gray-400 line-clamp-2">{event.description}</p>
        )}

        {isPast && (
          <div className="mt-3">
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
              Event ended
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-20 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

const EVENT_TYPES = ['all', 'seminar', 'workshop', 'webinar', 'cultural', 'sports', 'other'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    studentPortalService.getEvents()
      .then((res) => setEvents(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || e.eventType === typeFilter;
    return matchSearch && matchType;
  });

  // Sort: upcoming first
  const sorted = [...filtered].sort((a, b) => {
    const da = a.eventDate ? new Date(a.eventDate) : 0;
    const db = b.eventDate ? new Date(b.eventDate) : 0;
    return db - da;
  });

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Campus Events</h2>
        <p className="text-sm text-gray-500 mt-0.5">Stay updated with upcoming events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white capitalize appearance-none"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t === 'all' ? 'All Types' : t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Type pills */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              typeFilter === t
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? [1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)
          : sorted.length > 0
            ? sorted.map((e) => <EventCard key={e._id} event={e} />)
            : (
              <div className="col-span-full py-16 text-center">
                <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No events found</p>
              </div>
            )
        }
      </div>
    </div>
  );
}
