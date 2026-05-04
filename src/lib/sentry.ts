import * as Sentry from '@sentry/nextjs';

export function captureException(error: unknown, context?: Record<string, unknown>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

export function trackLeadCreated(lead: { id: string; name: string; source?: string }) {
  Sentry.addBreadcrumb({
    message: 'ליד-נוצר',
    category: 'crm',
    data: lead,
    level: 'info',
  });
}

export function trackEmailSent(to: string, type: 'confirmation' | 'admin') {
  Sentry.addBreadcrumb({
    message: 'אימייל-נשלח',
    category: 'email',
    data: { to, type },
    level: 'info',
  });
}

export function trackEmailFailed(to: string, error: unknown) {
  Sentry.addBreadcrumb({
    message: 'אימייל-נכשל',
    category: 'email',
    data: { to, error: String(error) },
    level: 'warning',
  });
}

export function trackCrmLogin() {
  Sentry.addBreadcrumb({
    message: 'כניסה-לcrm',
    category: 'auth',
    level: 'info',
  });
}
