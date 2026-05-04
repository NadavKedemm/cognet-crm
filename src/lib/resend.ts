import { Resend } from 'resend';
import type { Lead } from '@/types';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.RESEND_FROM_EMAIL || 'קוגנט <noreply@cognet.ai>';
const ADMIN = () => process.env.ADMIN_EMAIL || 'nadav@cognet.ai';

export async function sendLeadConfirmation(lead: Lead) {
  return getResend().emails.send({
    from: FROM(),
    to: lead.email,
    subject: `${lead.name}, שמרנו לך מקום בקורס הבלוקצ'יין! 🎉`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #7c3aed; font-size: 28px; margin: 0;">🎉 נרשמת בהצלחה!</h1>
          </div>
          <p style="font-size: 18px; color: #0f172a;">שלום ${lead.name},</p>
          <p style="color: #475569; line-height: 1.6;">
            תודה רבה על ההרשמה לקורס הבלוקצ'יין של קוגנט! שמרנו לך מקום.
          </p>
          <div style="background: #f0fdf4; border-right: 4px solid #10b981; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #065f46; font-weight: 600;">מה קורה עכשיו?</p>
            <ul style="color: #047857; margin: 8px 0 0; padding-right: 20px;">
              <li>ניצור איתך קשר בקרוב עם פרטים נוספים</li>
              <li>תקבל/י גישה לחומרי הכנה לפני הקורס</li>
              <li>נודיע לך על מועד ההתחלה הסופי</li>
            </ul>
          </div>
          <div style="background: #faf5ff; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #6d28d9; font-size: 14px;">
              <strong>פרטי ההרשמה שלך:</strong><br/>
              שם: ${lead.name}<br/>
              אימייל: ${lead.email}<br/>
              ${lead.phone ? `טלפון: ${lead.phone}<br/>` : ''}
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-top: 32px;">
            © 2024 קוגנט — למידה חכמה יותר עם AI
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminNotification(lead: Lead) {
  return getResend().emails.send({
    from: FROM(),
    to: ADMIN(),
    subject: `ליד חדש: ${lead.name} נרשם לקורס הבלוקצ'יין`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #7c3aed; margin-top: 0;">🔔 ליד חדש נרשם!</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">שם</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">אימייל</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">טלפון</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.phone || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">מקור</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.utm_source || 'ישיר'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b; font-weight: 600;">זמן הרשמה</td>
              <td style="padding: 8px;">${new Date(lead.created_at).toLocaleString('he-IL')}</td>
            </tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/crm"
             style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #7c3aed; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
            פתח במערכת CRM ←
          </a>
        </div>
      </div>
    `,
  });
}
