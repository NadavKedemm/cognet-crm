'use client';

import { useCrmAuth } from '@/contexts/CrmAuth';
import LiveVisitors from '@/components/crm/LiveVisitors';

export default function LivePage() {
  const { password } = useCrmAuth();

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">מבקרים באתר עכשיו</h2>
        <p className="text-slate-500 text-sm mt-1">מתרענן אוטומטית כל 10 שניות</p>
      </div>
      <LiveVisitors password={password} />
    </div>
  );
}
