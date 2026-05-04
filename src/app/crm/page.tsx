'use client';

import { useState, useEffect, useCallback } from 'react';
import LeadsTable from '@/components/crm/LeadsTable';
import StatsCards from '@/components/crm/StatsCards';
import Button from '@/components/ui/Button';
import { useCrmAuth } from '@/contexts/CrmAuth';
import type { Lead, LeadStatus } from '@/types';
import { Search, Download } from 'lucide-react';

const STATUS_FILTERS = ['הכל', 'חדש', 'בטיפול', 'הומר', 'אבוד'];

export default function CrmPage() {
  const { password } = useCrmAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('הכל');

  const fetchData = useCallback(async (searchVal: string, statusVal: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusVal !== 'הכל') params.set('status', statusVal);
    if (searchVal) params.set('search', searchVal);

    const [leadsRes, statsRes] = await Promise.all([
      fetch(`/api/crm/leads?${params}`, { headers: { 'x-crm-password': password } }),
      fetch('/api/crm/stats', { headers: { 'x-crm-password': password } }),
    ]);

    if (leadsRes.ok) setLeads((await leadsRes.json()).leads || []);
    if (statsRes.ok) setStats(await statsRes.json());
    setLoading(false);
  }, [password]);

  useEffect(() => {
    if (password) fetchData('', 'הכל');
  }, [password, fetchData]);

  useEffect(() => {
    if (!password) return;
    const t = setTimeout(() => fetchData(search, statusFilter), 300);
    return () => clearTimeout(t);
  }, [search, statusFilter, password, fetchData]);

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    await fetch(`/api/crm/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-crm-password': password },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleNotesUpdate = async (id: string, notes: string) => {
    await fetch(`/api/crm/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-crm-password': password },
      body: JSON.stringify({ notes }),
    });
  };

  const exportToCSV = () => {
    const headers = ['שם', 'אימייל', 'טלפון', 'סטטוס', 'מקור', 'תאריך'];
    const rows = leads.map((l) => [l.name, l.email, l.phone || '', l.status, l.utm_source || 'ישיר', l.created_at]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `leads-${new Date().toISOString().split('T')[0]}.csv` });
    a.click();
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">ניהול לידים</h2>
        <p className="text-slate-500 text-sm mt-1">
          {leads.length} לידים {statusFilter !== 'הכל' ? `• סטטוס: ${statusFilter}` : ''}
        </p>
      </div>

      <StatsCards stats={stats as Parameters<typeof StatsCards>[0]['stats']} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="חפש לפי שם, אימייל או טלפון..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                statusFilter === f ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2 flex-shrink-0">
          <Download className="w-4 h-4" /> ייצוא לאקסל
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />)}</div>
      ) : (
        <LeadsTable leads={leads} onStatusChange={handleStatusChange} onNotesUpdate={handleNotesUpdate} />
      )}
    </div>
  );
}
