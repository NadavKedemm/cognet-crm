import Card from '@/components/ui/Card';
import type { SectionStats } from '@/types';

interface AIInsightsProps {
  sectionStats: SectionStats[];
  funnel: {
    visitors: number;
    viewed_form: number;
    registered: number;
  };
}

export default function AIInsights({ sectionStats, funnel }: AIInsightsProps) {
  const sorted = [...(sectionStats || [])].sort((a, b) => b.bounce_rate - a.bounce_rate);
  const highestBounce = sorted[0];

  const formSection = sectionStats?.find((s) => s.section === 'הרשמה');
  const topSection = [...(sectionStats || [])].sort((a, b) => b.views - a.views)[0];

  const conversionRate = funnel.visitors > 0
    ? ((funnel.registered / funnel.visitors) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-4">
      {highestBounce && (
        <Card className="border-r-4 border-orange-400">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-bold text-slate-800 mb-1">סקשן עם נטישה גבוהה</div>
              <p className="text-sm text-slate-600">
                הסקשן <span className="font-bold text-orange-600">&quot;{highestBounce.section}&quot;</span> מציג
                נטישה גבוהה — כדאי לבחון את התוכן ולשפר.
              </p>
            </div>
          </div>
        </Card>
      )}

      {topSection && (
        <Card className="border-r-4 border-green-400">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-bold text-slate-800 mb-1">הסקשן הנצפה ביותר</div>
              <p className="text-sm text-slate-600">
                הסקשן <span className="font-bold text-green-600">&quot;{topSection.section}&quot;</span> מקבל
                הכי הרבה תשומת לב עם {topSection.views} צפיות.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="border-r-4 border-violet-400">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <div className="font-bold text-slate-800 mb-1">שיעור המרה</div>
            <p className="text-sm text-slate-600">
              {funnel.visitors} מבקרים →{' '}
              {funnel.viewed_form} צפו בטופס →{' '}
              <span className="font-bold text-violet-600">{funnel.registered} נרשמו</span>
              {' '}({conversionRate}%)
            </p>
          </div>
        </div>
      </Card>

      {formSection && formSection.avg_time > 0 && (
        <Card className="border-r-4 border-blue-400">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-bold text-slate-800 mb-1">תובנה על טופס הרשמה</div>
              <p className="text-sm text-slate-600">
                מבקרים מבלים בממוצע <span className="font-bold text-blue-600">{formSection.avg_time} שניות</span>{' '}
                בטופס ההרשמה — ממוצע טוב!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
