import { useRef, useEffect, useState } from 'react';
import { Star } from 'lucide-react';

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const REVIEWS = [
  {
    name: 'Priya Sharma',
    role: 'Student, Computer Science',
    review: "OmniHub made tracking my admission journey so simple. I could see exactly where my inquiry stood, who my counselor was, and even get updates about events — all from my phone.",
    stars: 5,
    initials: 'PS',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Head Counselor',
    review: "Before OmniHub, we'd lose track of inquiries in spreadsheets. Now every lead is captured, assigned, and tracked. Our conversion rate improved by over 40% in the first quarter.",
    stars: 5,
    initials: 'RK',
    gradient: 'from-emerald-500 to-cyan-600',
  },
  {
    name: 'Meera Patel',
    role: 'Campus Administrator',
    review: "The dashboard gives me a complete picture of the entire campus at a glance — students, payments, events, and more. It's replaced at least 4 different tools we were using before.",
    stars: 5,
    initials: 'MP',
    gradient: 'from-orange-500 to-rose-600',
  },
  {
    name: 'Arjun Singh',
    role: 'Student, Business Administration',
    review: "I love that I can check my course details, upcoming events, and inquiry status from one app. The interface is clean and works perfectly on mobile too.",
    stars: 5,
    initials: 'AS',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Sunita Rao',
    role: 'Receptionist',
    review: "Managing walk-in inquiries used to be chaotic. With OmniHub I can enter a new inquiry in seconds and immediately assign it. The whole team is on the same page now.",
    stars: 5,
    initials: 'SR',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Dhruv Mehta',
    role: 'IT Head',
    review: "OmniHub has solid role-based access control. Each staff member sees only what they need. Deployment was smooth and the API is well-documented.",
    stars: 5,
    initials: 'DM',
    gradient: 'from-slate-500 to-slate-700',
  },
];

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-4 border border-indigo-100">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by students and staff alike
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Hear from the people who use OmniHub every day to manage and grow their campus.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {REVIEWS.map(({ name, role, review, stars, initials, gradient }, i) => (
            <div
              key={name}
              className={`break-inside-avoid bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">"{review}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-gray-400 text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
