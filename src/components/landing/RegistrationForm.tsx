'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trackSectionView, trackSectionLeave, trackClick } from '@/lib/analytics';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z.object({
  name: z.string().min(2, 'נא להזין שם מלא'),
  email: z.string().email('נא להזין כתובת אימייל תקינה'),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegistrationForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    trackSectionView('הרשמה');
    return () => trackSectionLeave('הרשמה');
  }, []);

  const onSubmit = async (data: FormData) => {
    setServerError('');
    trackClick('כפתור-שלח-טופס', 'הרשמה');

    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          utm_source: params.get('utm_source') || undefined,
          utm_medium: params.get('utm_medium') || undefined,
          utm_campaign: params.get('utm_campaign') || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || 'אירעה שגיאה. נסה שוב.');
        return;
      }

      setSuccess(true);
    } catch {
      setServerError('אירעה שגיאה. בדוק את החיבור לאינטרנט ונסה שוב.');
    }
  };

  if (success) {
    return (
      <section
        id="registration-form"
        data-section="הרשמה"
        className="py-24 bg-gradient-to-br from-violet-950 to-indigo-900"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-extrabold text-white mb-4">נרשמת בהצלחה!</h2>
            <p className="text-violet-200 text-lg leading-relaxed">
              תודה! שמרנו לך מקום. נחזור אליך בקרוב עם כל הפרטים על הקורס.
            </p>
            <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-violet-100 text-sm">
              בדוק/י את תיבת המייל שלך — שלחנו לך אישור הרשמה!
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="registration-form"
      data-section="הרשמה"
      className="py-24 bg-gradient-to-br from-violet-950 to-indigo-900"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 text-violet-200 text-sm font-medium px-4 py-2 rounded-full mb-6">
              🎯 הרשמה לקורס
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-3">
              שמור לי מקום בקורס
            </h2>
            <p className="text-violet-200">
              מלא/י את הפרטים ונחזור אליך בקרוב עם כל הפרטים
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="שם מלא *"
                placeholder="ישראל ישראלי"
                {...register('name')}
                error={errors.name?.message}
                className="bg-white/90 backdrop-blur"
              />
              <Input
                label="כתובת אימייל *"
                type="email"
                placeholder="israel@example.com"
                {...register('email')}
                error={errors.email?.message}
                className="bg-white/90 backdrop-blur"
              />
              <Input
                label="טלפון (אופציונלי)"
                type="tel"
                placeholder="050-0000000"
                {...register('phone')}
                className="bg-white/90 backdrop-blur"
              />

              {serverError && (
                <div className="bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl p-3 text-sm">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                className="w-full bg-gradient-to-l from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-2xl border-0 mt-2"
              >
                שמור לי מקום בקורס ←
              </Button>
            </form>

            <p className="text-center text-violet-300 text-xs mt-4">
              🔒 אנחנו לא שולחים ספאם — רק פרטים על הקורס
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
