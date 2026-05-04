'use client';

import { useEffect, useState, useCallback } from 'react';
import type { LiveVisitor } from '@/types';
import Card from '@/components/ui/Card';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface LiveVisitorsProps {
  password: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}:${s.toString().padStart(2, '0')}`;
  return `${s} שנ'`;
}

function DeviceIcon({ type }: { type?: string }) {
  if (type === 'מובייל') return <Smartphone className="w-4 h-4" />;
  if (type === 'טאבלט') return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

export default function LiveVisitors({ password }: LiveVisitorsProps) {
  const [visitors, setVisitors] = useState<LiveVisitor[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/crm/live', {
        headers: { 'x-crm-password': password },
      });
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors || []);
        setCount(data.count || 0);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 10000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">מבקרים באתר עכשיו</h2>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full pulse-green" />
          <span className="text-sm font-bold text-green-600">{count} פעיל{count !== 1 ? 'ים' : ''}</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">👻</div>
          <div className="font-semibold">אין מבקרים פעילים כרגע</div>
          <div className="text-sm mt-1">הדף מתרענן אוטומטית כל 10 שניות</div>
        </div>
      ) : (
        <div className="space-y-2">
          {visitors.map((v) => (
            <div
              key={v.session_id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                  <DeviceIcon type={v.device_type} />
                </div>
                <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 text-sm truncate">
                  {v.session_id.slice(0, 14)}...
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                    {v.current_section}
                  </span>
                  <span>{v.device_type || 'מחשב'}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-slate-700">{formatTime(v.time_on_site)}</div>
                <div className="text-xs text-slate-400">באתר</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
