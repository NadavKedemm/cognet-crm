'use client';

import { useState } from 'react';
import { formatDate, getStatusColor } from '@/lib/utils';
import type { Lead, LeadStatus } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onNotesUpdate: (id: string, notes: string) => void;
}

const statusOptions: LeadStatus[] = ['חדש', 'בטיפול', 'הומר', 'אבוד'];

const statusBadgeVariant: Record<LeadStatus, 'info' | 'warning' | 'success' | 'error'> = {
  'חדש': 'info',
  'בטיפול': 'warning',
  'הומר': 'success',
  'אבוד': 'error',
};

export default function LeadsTable({ leads, onStatusChange, onNotesUpdate }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesValues, setNotesValues] = useState<Record<string, string>>({});

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="text-5xl mb-4">📭</div>
        <div className="text-lg font-semibold">אין לידים להצגה</div>
        <div className="text-sm mt-1">נסה לשנות את הפילטרים</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {['שם', 'אימייל', 'טלפון', 'סטטוס', 'מקור', 'תאריך', 'פעולות'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {leads.map((lead) => (
            <>
              <tr
                key={lead.id}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm flex-shrink-0">
                      {lead.name[0]}
                    </div>
                    {lead.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                <td className="px-4 py-3 text-slate-600 dir-ltr">{lead.phone || '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadgeVariant[lead.status as LeadStatus]}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{lead.utm_source || 'ישיר'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(lead.created_at)}</td>
                <td className="px-4 py-3">
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`}
                  />
                </td>
              </tr>

              {expandedId === lead.id && (
                <tr key={`${lead.id}-expanded`} className="bg-slate-50/50">
                  <td colSpan={7} className="px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Status selector */}
                      <div className="flex-shrink-0">
                        <div className="text-xs font-bold text-slate-500 mb-2">שנה סטטוס:</div>
                        <div className="flex gap-2 flex-wrap">
                          {statusOptions.map((s) => (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(lead.id, s);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                lead.status === s
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-500 mb-2">הערות:</div>
                        <div className="flex gap-2">
                          <textarea
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            rows={2}
                            defaultValue={lead.notes || ''}
                            onChange={(e) => setNotesValues({ ...notesValues, [lead.id]: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="הוסף הערה..."
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNotesUpdate(lead.id, notesValues[lead.id] ?? lead.notes ?? '');
                            }}
                          >
                            שמור
                          </Button>
                        </div>
                      </div>

                      {/* Meta info */}
                      {(lead.utm_source || lead.utm_campaign) && (
                        <div className="flex-shrink-0">
                          <div className="text-xs font-bold text-slate-500 mb-2">UTM:</div>
                          <div className="text-xs text-slate-500 space-y-1">
                            {lead.utm_source && <div>מקור: {lead.utm_source}</div>}
                            {lead.utm_medium && <div>מדיום: {lead.utm_medium}</div>}
                            {lead.utm_campaign && <div>קמפיין: {lead.utm_campaign}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
