'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import type { SectionStats } from '@/types';

interface SectionHeatmapProps {
  data: SectionStats[];
}

export default function SectionHeatmap({ data }: SectionHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="font-bold text-slate-700 mb-4">עומק גלילה ממוצע לפי סקשן</h3>
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
          אין נתונים זמינים
        </div>
      </Card>
    );
  }

  const formatted = data.map((d) => ({
    name: d.section,
    צפיות: d.views,
    'זמן ממוצע (שנ)': d.avg_time,
    'גלילה (%)': d.scroll_depth || 0,
  }));

  return (
    <Card>
      <h3 className="font-bold text-slate-700 mb-6">ביצועים לפי סקשן</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} layout="vertical" margin={{ right: 20, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} width={80} />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="צפיות" fill="#7c3aed" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['סקשן', 'צפיות ייחודיות', 'זמן ממוצע', 'גלילה ממוצעת'].map((h) => (
                <th key={h} className="py-2 px-3 text-right text-xs text-slate-500 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row) => (
              <tr key={row.section} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-800">{row.section}</td>
                <td className="py-2 px-3 text-slate-600">{row.views}</td>
                <td className="py-2 px-3 text-slate-600">{row.avg_time}s</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-violet-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(row.scroll_depth || 0, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{row.scroll_depth || 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
