'use client';

import { useState, useCallback } from 'react';
import type { Lead, LeadStatus } from '@/types';

export function useLeads(password: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeads = useCallback(
    async (search = '', status = 'הכל') => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (status !== 'הכל') params.set('status', status);
        if (search) params.set('search', search);

        const res = await fetch(`/api/crm/leads?${params}`, {
          headers: { 'x-crm-password': password },
        });

        if (!res.ok) {
          setError('שגיאה בטעינת לידים');
          return;
        }

        const data = await res.json();
        setLeads(data.leads || []);
      } catch {
        setError('שגיאה בחיבור לשרת');
      } finally {
        setLoading(false);
      }
    },
    [password]
  );

  const updateStatus = useCallback(
    async (id: string, status: LeadStatus) => {
      const res = await fetch(`/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-password': password,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      }
    },
    [password]
  );

  const updateNotes = useCallback(
    async (id: string, notes: string) => {
      await fetch(`/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-password': password,
        },
        body: JSON.stringify({ notes }),
      });
    },
    [password]
  );

  return { leads, loading, error, fetchLeads, updateStatus, updateNotes };
}
