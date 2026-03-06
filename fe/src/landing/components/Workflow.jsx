import { useRef, useEffect, useState } from 'react';
import { QrCode, PhoneCall, UserCheck, ClipboardCheck, GraduationCap, ArrowDown } from 'lucide-react';

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

const STEPS = [
  {
    num: '01',
    icon: QrCode,
    title: 'Student Submits Inquiry',
    desc: 'Student scans a QR code or fills the public inquiry form online. Instantly captured in OmniHub.',
    color: 'indigo',
  },
  {
    num: '02',
    icon: PhoneCall,
    title: 'Receptionist Receives',
    desc: 'Receptionist sees the new inquiry on the dashboard and assigns it to the right counselor.',
    color: 'violet',
  },
  {
    num: '03',
    icon: UserCheck,
    title: 'Counselor Follows Up',
    desc: 'Counselor contacts the student, adds notes, updates status, and schedules follow-ups.',
    color: 'blue',
  },
  {
    num: '04',
    icon: ClipboardCheck,
    title: 'Admission Processed',
    desc: 'One-click converts the inquiry to an admission with documents, fees, and course selection.',
    color: 'emerald',
  },
  {
    num: '05',
    icon: GraduationCap,
    title: 'Student Enrolled',
    desc: 'Student receives login credentials and accesses their personal portal to track everything.',
    color: 'purple',
  },
];

const COLOR_MAP = {
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200',  num: 'text-indigo-500',  line: 'bg-indigo-200' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  num: 'text-violet-500',  line: 'bg-violet-200' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    num: 'text-blue-500',    line: 'bg-blue-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', num: 'text-emerald-500', line: 'bg-emerald-200' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200',  num: 'text-purple-500',  line: 'bg-purple-200' },
};

export default function Workflow() {
  const [ref, inView] = useInView();

  return (
    <section id="workflow" className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-4 border border-indigo-100">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            From inquiry to enrollment
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            OmniHub handles the entire student journey — from the first inquiry all the way to active enrollment.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map(({ num, icon: Icon, title, desc, color }, i) => {
            const c = COLOR_MAP[color];
            return (
              <div
                key={num}
                className={`flex gap-5 transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Left — number + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center shadow-sm`}>
                    <Icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-2 mb-0 ${c.line} min-h-4`} />
                  )}
                </div>

                {/* Right — content */}
                <div className={`bg-white border border-gray-100 rounded-2xl p-5 flex-1 shadow-sm hover:shadow-md transition-shadow mb-4 group`}>
                  <div className="flex items-start gap-4">
                    <div>
                      <div className={`text-xs font-bold ${c.num} mb-1`}>Step {num}</div>
                      <h3 className="font-semibold text-gray-900 text-base mb-1.5">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <ArrowDown className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1 sm:hidden" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
