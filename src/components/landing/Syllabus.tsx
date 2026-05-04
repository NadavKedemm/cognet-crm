'use client';

import { useEffect } from 'react';
import { trackSectionView, trackSectionLeave } from '@/lib/analytics';
import Card from '@/components/ui/Card';

const modules = [
  {
    icon: '🔗',
    title: 'יסודות הבלוקצ\'יין',
    description: 'הבנת מנגנון ה-hash, מבנה הבלוקים, ושרשרת הבלוקים — איך הכל עובד מתחת למכסה',
    topics: ['Cryptographic hashing', 'מבנה הבלוק', 'Consensus mechanisms'],
  },
  {
    icon: '₿',
    title: 'ביטקוין ואת\'ריום',
    description: 'ההבדלים המהותיים בין שתי הרשתות הגדולות ומה הופך כל אחת לייחודית',
    topics: ['Bitcoin UTXO model', 'Ethereum accounts', 'Gas ועלויות'],
  },
  {
    icon: '🔐',
    title: 'ארנקים וכתובות',
    description: 'כיצד לשמור על הנכסים הדיגיטליים שלך — Private keys, seed phrases ואבטחה',
    topics: ['HD Wallets', 'Hardware wallets', 'Private vs Public keys'],
  },
  {
    icon: '📄',
    title: 'חוזים חכמים',
    description: 'הטכנולוגיה שמשנה הכל — כתיבה ופריסה של Smart Contracts ב-Solidity',
    topics: ['Solidity basics', 'ERC standards', 'Deployment & testing'],
  },
  {
    icon: '🏦',
    title: 'DeFi ו-NFTs',
    description: 'הפיננסים החדשים — Uniswap, Aave, OpenSea ומה שמאחורי הקלעים',
    topics: ['AMM & Liquidity', 'Lending protocols', 'NFT standards'],
  },
  {
    icon: '💼',
    title: 'כניסה לתעשייה',
    description: 'תנאי שוק העבודה בבלוקצ\'יין, כלים מקצועיים ואיך לבנות פורטפוליו מנצח',
    topics: ['Hardhat & Foundry', 'Portfolio projects', 'Job market 2024'],
  },
];

export default function Syllabus() {
  useEffect(() => {
    trackSectionView('סילבוס');
    return () => trackSectionLeave('סילבוס');
  }, []);

  return (
    <section
      id="syllabus"
      data-section="סילבוס"
      className="py-24 bg-slate-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            📚 תכנית הלימודים
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            מה תלמד בקורס?
          </h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            6 מודולים מקיפים שיובילו אותך מהבסיס ועד לרמה מקצועית
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <Card
              key={mod.title}
              hover
              className="group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-50 rounded-full -translate-y-10 translate-x-10 group-hover:bg-violet-100 transition-colors" />
              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{mod.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-violet-500 mb-1">מודול {i + 1}</div>
                    <h3 className="text-lg font-bold text-slate-900">{mod.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{mod.description}</p>
                <ul className="space-y-1">
                  {mod.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
