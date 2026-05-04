export type LeadStatus = 'חדש' | 'בטיפול' | 'הומר' | 'אבוד';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  event_count?: number;
}

export interface Session {
  id: string;
  session_id: string;
  started_at: string;
  last_seen: string;
  page_source?: string;
  device_type?: string;
  browser?: string;
  country?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  is_active: boolean;
  current_section?: string;
}

export interface AnalyticsEvent {
  id: string;
  session_id: string;
  event_type: string;
  section?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface SectionStats {
  section: string;
  views: number;
  avg_time: number;
  scroll_depth: number;
  bounce_rate: number;
}

export interface LiveVisitor {
  session_id: string;
  started_at: string;
  last_seen: string;
  device_type?: string;
  browser?: string;
  country?: string;
  current_section?: string;
  time_on_site: number;
}

export interface CrmStats {
  total_leads: number;
  new_today: number;
  converted: number;
  in_progress: number;
  section_stats: SectionStats[];
  funnel: {
    visitors: number;
    viewed_form: number;
    registered: number;
  };
}

export interface TrackEvent {
  event_type: string;
  section?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}
