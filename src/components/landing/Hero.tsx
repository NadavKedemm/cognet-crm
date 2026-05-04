'use client';

import { useEffect } from 'react';
import { trackSectionView, trackSectionLeave, trackClick } from '@/lib/analytics';
import Button from '@/components/ui/Button';

export default function Hero() {
  useEffect(() => {
    trackSectionView('כותרת');
    return () => trackSectionLeave('כותרת');
  }, []);

  const scrollToForm = () => {
    trackClick('כפתור-הרשם', 'כותרת');
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSyllabus = () => {
    trackClick('כפתור-סילבוס', 'כותרת');
    document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      data-section="כותרת"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-900"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 text-violet-200 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>ההרשמה פתוחה עכשיו — מקומות מוגבלים!</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          קורס
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-300 to-indigo-300">
            {' '}הבלוקצ&#39;יין{' '}
          </span>
          המקיף
        </h1>

        <p className="text-xl md:text-2xl text-violet-200 max-w-2xl mx-auto mb-12 leading-relaxed">
          הקורס הפרקטי שיקח אותך מאפס להבנה עמוקה של הטכנולוגיה שמשנה את העולם הפיננסי
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-gradient-to-l from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-2xl shadow-violet-900/50 border-0 w-full sm:w-auto"
          >
            הרשם עכשיו ←
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={scrollToSyllabus}
            className="border border-violet-400/40 text-violet-200 hover:bg-violet-500/20 hover:text-white w-full sm:w-auto"
          >
            צפה בסילבוס
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          {[
            { value: '1,200+', label: 'סטודנטים' },
            { value: '4.9/5', label: 'דירוג ממוצע' },
            { value: '12 שעות', label: 'תוכן מקצועי' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-violet-300 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-violet-400/60 animate-bounce">
        <span className="text-sm">גלול למטה</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
