'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LiveVisitor } from '@/types';

export function useLiveVisitors(password: string, intervalMs = 10000) {
  const [visitors, setVisitors] = useState<LiveVisitor[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/crm/live', {
        headers: { 'x-crm-password': password },
      });
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors || []);
        setCount(data.count || 0);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, intervalMs);
    return () => clearInterval(interval);
  }, [fetchVisitors, intervalMs]);

  return { visitors, count, loading, refresh: fetchVisitors };
}
