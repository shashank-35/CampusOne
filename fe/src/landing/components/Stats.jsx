import { useRef, useEffect, useState } from 'react';

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Counter({ target, suffix = '', duration = 1800, started }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const STATS = [
  { target: 500,  suffix: '+', label: 'Students Managed',     desc: 'Active students in the system' },
  { target: 50,   suffix: '+', label: 'Courses Offered',       desc: 'Across various departments' },
  { target: 200,  suffix: '+', label: 'Events Organized',      desc: 'Seminars, workshops & more' },
  { target: 1000, suffix: '+', label: 'Inquiries Handled',     desc: 'Successfully converted leads' },
];

export default function Stats() {
  const [ref, inView] = useInView();

  return (
    <section id="stats" className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Trusted by campuses across the country
          </h2>
          <p className="text-indigo-200 text-lg">
            Real numbers from real institutions using OmniHub every day.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ target, suffix, label, desc }, i) => (
            <div
              key={label}
              className={`text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/15 hover:bg-white/15 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2 tabular-nums">
                <Counter target={target} suffix={suffix} started={inView} duration={1600 + i * 100} />
              </p>
              <p className="text-white font-semibold text-base mb-1">{label}</p>
              <p className="text-indigo-200 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
