'use client';

import Card from '@/components/ui/Card';
import { Users, TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    'סהכ_לידים': number;
    'חדשים_היום': number;
    'הומרו': number;
    'בטיפול': number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'סה"כ לידים',
      value: stats['סהכ_לידים'] ?? 0,
      icon: Users,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      change: null,
    },
    {
      label: 'חדשים היום',
      value: stats['חדשים_היום'] ?? 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'הומרו',
      value: stats['הומרו'] ?? 0,
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'בטיפול',
      value: stats['בטיפול'] ?? 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{card.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{card.label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
