'use client';

import { generateSessionId, getDeviceType, getBrowser } from './utils';
import type { TrackEvent } from '@/types';

const SESSION_KEY = 'cognet_session_id';
const EVENTS_KEY = 'cognet_pending_events';
const FLUSH_INTERVAL = 30000;

let flushTimer: NodeJS.Timeout | null = null;
let sessionId: string | null = null;
let sectionTimers: Record<string, number> = {};

function getSessionId(): string {
  if (sessionId) return sessionId;
  if (typeof window === 'undefined') return '';

  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, id);
    initSession(id);
  }
  sessionId = id;
  return id;
}

async function initSession(id: string) {
  try {
    const params = new URLSearchParams(window.location.search);
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: {
          session_id: id,
          page_source: window.location.pathname,
          device_type: getDeviceType(),
          browser: getBrowser(),
          referrer: document.referrer || null,
          utm_source: params.get('utm_source'),
          utm_medium: params.get('utm_medium'),
          utm_campaign: params.get('utm_campaign'),
        },
        events: [],
      }),
    });
  } catch {}
}

function getPendingEvents(): TrackEvent[] {
  try {
    return JSON.parse(sessionStorage.getItem(EVENTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function savePendingEvents(events: TrackEvent[]) {
  sessionStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function trackEvent(event: TrackEvent) {
  if (typeof window === 'undefined') return;
  const sid = getSessionId();
  if (!sid) return;

  const events = getPendingEvents();
  events.push({ ...event, session_id: sid, created_at: new Date().toISOString() } as TrackEvent & { session_id: string; created_at: string });
  savePendingEvents(events);

  if (events.length >= 10) {
    flushEvents();
  }
}

export async function flushEvents() {
  if (typeof window === 'undefined') return;
  const events = getPendingEvents();
  if (events.length === 0) return;

  savePendingEvents([]);

  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: { session_id: getSessionId() }, events }),
    });
  } catch {
    savePendingEvents([...events, ...getPendingEvents()]);
  }
}

export function setupScrollTracking() {
  if (typeof window === 'undefined') return;

  const depths = [25, 50, 75, 100];
  const fired = new Set<number>();

  const handler = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    depths.forEach((d) => {
      if (scrollPercent >= d && !fired.has(d)) {
        fired.add(d);
        trackEvent({ event_type: 'scroll_depth', value: d });
      }
    });
  };

  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}

export function trackSectionView(section: string) {
  sectionTimers[section] = Date.now();
  trackEvent({ event_type: 'section_view', section });
}

export function trackSectionLeave(section: string) {
  if (sectionTimers[section]) {
    const timeSpent = Math.round((Date.now() - sectionTimers[section]) / 1000);
    trackEvent({ event_type: 'time_on_section', section, value: timeSpent });
    delete sectionTimers[section];
  }
}

export function trackClick(element: string, section?: string) {
  trackEvent({ event_type: 'click', section: section || element, metadata: { element } } as TrackEvent & { metadata: Record<string, unknown> });
}

export function setupAutoFlush() {
  if (typeof window === 'undefined') return;

  flushTimer = setInterval(flushEvents, FLUSH_INTERVAL);

  const handleUnload = () => {
    navigator.sendBeacon('/api/events', JSON.stringify({
      session: { session_id: getSessionId() },
      events: getPendingEvents(),
    }));
    savePendingEvents([]);
  };

  window.addEventListener('beforeunload', handleUnload);

  return () => {
    if (flushTimer) clearInterval(flushTimer);
    window.removeEventListener('beforeunload', handleUnload);
  };
}
