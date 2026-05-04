'use client';

import { useState, useEffect, useCallback } from 'react';
import SectionHeatmap from '@/components/crm/SectionHeatmap';
import AIInsights from '@/components/crm/AIInsights';
import Card from '@/components/ui/Card';
import { useCrmAuth } from '@/contexts/CrmAuth';
import type { SectionStats } from '@/types';

export default function AnalyticsPage() {
  const { password } = useCrmAuth();
  const [stats, setStats] = useState<{
    section_stats: SectionStats[];
    funnel: { visitors: number; viewed_form: number; registered: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!password) return;
    const res = await fetch('/api/crm/stats', { headers: { 'x-crm-password': password } });
    if (res.ok) {
      const data = await res.json();
      setStats({
        section_stats: data['סטטיסטיקות_סקשנים'] || [],
        funnel: {
          visitors: data['משפך_המרה']?.מבקרים || 0,
          viewed_form: data['משפך_המרה']?.['צפו_בטופס'] || 0,
          registered: data['משפך_המרה']?.נרשמו || 0,
        },
      });
    }
    setLoading(false);
  }, [password]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">ביצועי דף הנחיתה</h2>
        <p className="text-slate-500 text-sm mt-1">ניתוח מקיף של התנהגות המבקרים</p>
      </div>

      {loading ? (
        <div className="grid gap-6">{[1, 2].map((i) => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)}</div>
      ) : stats ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionHeatmap data={stats.section_stats} />
            <Card>
              <h3 className="font-bold text-slate-700 mb-6">משפך המרה</h3>
              <div className="flex items-center gap-3 justify-center flex-wrap">
                {[
                  { label: 'מבקרים', value: stats.funnel.visitors, icon: '👀', color: 'bg-blue-50 text-blue-700' },
                  { label: 'צפו בטופס', value: stats.funnel.viewed_form, icon: '📋', color: 'bg-yellow-50 text-yellow-700' },
                  { label: 'נרשמו', value: stats.funnel.registered, icon: '✅', color: 'bg-green-50 text-green-700' },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`text-center p-4 rounded-2xl ${step.color} min-w-[100px]`}>
                      <div className="text-2xl mb-1">{step.icon}</div>
                      <div className="text-2xl font-extrabold">{step.value}</div>
                      <div className="text-xs font-semibold mt-1">{step.label}</div>
                    </div>
                    {i < arr.length - 1 && <div className="text-slate-300 text-2xl">←</div>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-slate-700">תובנות</h3>
            <AIInsights sectionStats={stats.section_stats} funnel={stats.funnel} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
