'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAnalytics(password: string) {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/crm/stats', {
        headers: { 'x-crm-password': password },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (password) fetchStats();
  }, [fetchStats, password]);

  return { stats, loading, refresh: fetchStats };
}
