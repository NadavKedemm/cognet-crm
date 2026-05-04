'use client';

import { useEffect } from 'react';
import { trackSectionView, trackSectionLeave } from '@/lib/analytics';

const testimonials = [
  {
    name: 'רועי לוי',
    role: 'מפתח Full Stack',
    text: 'הקורס הזה שינה את הקריירה שלי. תוך 3 חודשים קיבלתי הצעה לעבודה ב-Web3 עם שכר כפול ממה שהרווחתי קודם.',
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    name: 'מיה שפירא',
    role: 'מנהלת מוצר',
    text: 'סוף סוף הבנתי מה זה בלוקצ\'יין באמת! ההסברים ברורים, התרגילים פרקטיים, והמרצה זמין ומסביר פנים.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    name: 'דניאל ברזילי',
    role: 'יזם טכנולוגיה',
    text: 'השתמשתי בידע מהקורס לבנות את ה-dApp הראשון שלי. הקורס נותן את הבסיס האמיתי שצריך.',
    rating: 5,
    avatar: '🧑‍🚀',
  },
];

export default function Testimonials() {
  useEffect(() => {
    trackSectionView('המלצות');
    return () => trackSectionLeave('המלצות');
  }, []);

  return (
    <section
      data-section="המלצות"
      className="py-24 bg-slate-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ⭐ מה אומרים הסטודנטים
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            סטודנטים מספרים
          </h2>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <span className="text-yellow-400 text-2xl">★★★★★</span>
            <span className="font-bold text-slate-700 text-lg">4.9</span>
            <span>מתוך 1,200+ ביקורות</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
                <div className="text-yellow-400 text-sm">
                  {'★'.repeat(t.rating)}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
