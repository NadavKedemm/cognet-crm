'use client';

import { useEffect } from 'react';
import { trackSectionView, trackSectionLeave } from '@/lib/analytics';

export default function Instructor() {
  useEffect(() => {
    trackSectionView('מרצה');
    return () => trackSectionLeave('מרצה');
  }, []);

  return (
    <section
      data-section="מרצה"
      className="py-24 bg-gradient-to-br from-violet-950 to-indigo-900 text-white"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-7xl shadow-2xl">
              👨‍💻
            </div>
            <div className="absolute -bottom-3 -left-3 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
              ✓ מומחה מאומת
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 text-violet-200 text-sm font-medium px-4 py-2 rounded-full mb-6">
              👨‍🏫 המרצה
            </div>
            <h2 className="text-4xl font-extrabold mb-4">נדב קדם</h2>
            <p className="text-violet-200 text-lg leading-relaxed mb-6">
              מומחה Web3 ומפתח Solidity עם ניסיון של 5+ שנים בתעשייה.
              בנה פרויקטים ב-DeFi ו-NFT עבור חברות מובילות, ולימד מאות סטודנטים
              את עולם הבלוקצ&#39;יין.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: '5+ שנות ניסיון', icon: '⏱' },
                { label: '500+ סטודנטים', icon: '👥' },
                { label: '12 פרויקטי DeFi', icon: '🏗' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-xl"
                >
                  <span>{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
