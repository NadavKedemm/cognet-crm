'use client';

import { useState, useEffect } from 'react';
import { trackSectionView, trackSectionLeave, trackClick } from '@/lib/analytics';

const faqs = [
  {
    q: 'האם צריך ניסיון בתכנות קודם?',
    a: 'לא בהכרח. הקורס מיועד גם למי שמגיע ללא ניסיון, אם כי ידע בסיסי בתכנות יסייע. יש מודול מבוא שמכסה את כל מה שצריך.',
  },
  {
    q: 'כמה זמן לוקח להשלים את הקורס?',
    a: 'הקורס מכיל 12 שעות תוכן. בקצב של 2 שעות בשבוע תסיים תוך 6 שבועות. יש גישה לצמיתות, אז אפשר ללמוד בקצב שלך.',
  },
  {
    q: 'האם הקורס רלוונטי לשוק העבודה?',
    a: 'בהחלט. הקורס מכסה טכנולוגיות שנדרשות כיום בתעשייה: Solidity, Hardhat, DeFi protocols. כולל פרויקט GitHub שתוכל לשים בפורטפוליו.',
  },
  {
    q: 'מה הפלטפורמה בה מתקיים הקורס?',
    a: 'הקורס מתנהל בפלטפורמת הלמידה של קוגנט — נגיש ממחשב, טאבלט וסלולר. כולל סרטוני וידאו HD, קבצי קוד להורדה ובחנים.',
  },
  {
    q: 'האם מקבלים תעודה בסיום?',
    a: 'כן! בסיום הקורס מקבלים תעודת הצטיינות דיגיטלית שניתן לשתף ב-LinkedIn ובפורטפוליו.',
  },
  {
    q: 'מה קורה אם הקורס לא מתאים לי?',
    a: 'מציעים החזר כספי מלא תוך 30 יום מיום הרכישה, ללא שאלות. שביעות הרצון שלך היא העדיפות שלנו.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    trackSectionView('שאלות');
    return () => trackSectionLeave('שאלות');
  }, []);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
    trackClick(`שאלה-${i + 1}`, 'שאלות');
  };

  return (
    <section
      data-section="שאלות"
      className="py-24 bg-slate-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ❓ שאלות נפוצות
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            יש שאלות?
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-6 text-right font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 transition-colors ${openIndex === i ? 'bg-violet-600 text-white rotate-45' : 'bg-slate-100 text-slate-500'}`}>
                  +
                </span>
                <span className="flex-1">{faq.q}</span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
