'use client';

import { useEffect } from 'react';
import { trackSectionView, trackSectionLeave } from '@/lib/analytics';

const personas = [
  {
    icon: '💻',
    title: 'מפתחים שרוצים להתרחב',
    description: 'אם אתה מפתח עם ניסיון בתכנות ורוצה להיכנס לעולם ה-Web3 — זה בדיוק בשבילך',
  },
  {
    icon: '📈',
    title: 'אנשי פיננסים וטכנולוגיה',
    description: 'מי שרוצה להבין את הטכנולוגיה שעומדת מאחורי ה-DeFi, NFTs ו-Crypto',
  },
  {
    icon: '🎓',
    title: 'סטודנטים וחסרי ניסיון',
    description: 'לא צריך רקע מוקדם — מתחילים מהבסיס ומגיעים לרמה מקצועית',
  },
  {
    icon: '🚀',
    title: 'יזמים שרוצים לבנות',
    description: 'אם יש לך רעיון ל-dApp או פרויקט Web3 — הקורס ייתן לך את הכלים לממש אותו',
  },
];

export default function Audience() {
  useEffect(() => {
    trackSectionView('קהל-יעד');
    return () => trackSectionLeave('קהל-יעד');
  }, []);

  return (
    <section
      data-section="קהל-יעד"
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            👥 קהל היעד
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            הקורס הזה בשבילך אם...
          </h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            הקורס מתאים למגוון רחב של לומדים עם רקעים שונים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {personas.map((persona) => (
            <div
              key={persona.title}
              className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-200 group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">{persona.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {persona.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{persona.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
