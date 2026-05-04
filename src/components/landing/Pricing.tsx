'use client';

import { useEffect } from 'react';
import { trackSectionView, trackSectionLeave, trackClick } from '@/lib/analytics';
import Button from '@/components/ui/Button';

export default function Pricing() {
  useEffect(() => {
    trackSectionView('מחיר');
    return () => trackSectionLeave('מחיר');
  }, []);

  const scrollToForm = () => {
    trackClick('כפתור-מחיר', 'מחיר');
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      data-section="מחיר"
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            💳 תמחור שקוף
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            השקעה בעתיד שלך
          </h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            מחיר אחד, גישה לכל התכנים לצמיתות
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-violet-900/30">
            <div className="absolute top-0 right-8 -translate-y-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                🔥 מחיר השקה
              </span>
            </div>

            <div className="text-center mb-8 pt-4">
              <div className="text-6xl font-extrabold">₪997</div>
              <div className="text-violet-200 text-sm mt-1 line-through">₪1,997</div>
              <div className="text-green-300 font-semibold mt-2">חסכת ₪1,000!</div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                '12 שעות תוכן וידאו HD',
                'גישה לצמיתות + עדכונים',
                'פרויקטים פרקטיים עם קוד',
                'קהילת Discord פעילה',
                'מענה אישי מהמרצה',
                'תעודת סיום מוכרת',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-300 text-xs">✓</span>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              onClick={scrollToForm}
              className="w-full bg-white text-violet-700 hover:bg-violet-50 border-0 shadow-lg font-extrabold"
            >
              שמור לי מקום בקורס ←
            </Button>

            <p className="text-center text-violet-200 text-xs mt-4">
              ✓ ללא סיכון — החזר כספי מלא תוך 30 יום
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
