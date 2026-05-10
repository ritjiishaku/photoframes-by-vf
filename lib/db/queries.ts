import { getDb } from './client';

export interface AnalyticsEvent {
  event_type: string;
  product_slug?: string | null;
  category_slug?: string | null;
  inquiry_type?: string | null;
  traffic_source?: string | null;
  scroll_depth?: number | null;
  session_id?: string | null;
  user_agent?: string | null;
}

export async function insertAnalyticsEvent(
  event: AnalyticsEvent,
): Promise<void> {
  try {
    const sql = getDb();
    if (!sql) return;
    await sql`
      INSERT INTO analytics_events (
        event_type, product_slug, category_slug, inquiry_type,
        traffic_source, scroll_depth, session_id, user_agent
      ) VALUES (
        ${event.event_type},
        ${event.product_slug ?? null},
        ${event.category_slug ?? null},
        ${event.inquiry_type ?? null},
        ${event.traffic_source ?? null},
        ${event.scroll_depth ?? null},
        ${event.session_id ?? null},
        ${event.user_agent ?? null}
      )
    `;
  } catch (error) {
    console.error('[db] insertAnalyticsEvent error:', error);
  }
}

export interface AdminChangeLog {
  section: string;
  field_name?: string | null;
  changed_by?: string | null;
  note?: string | null;
}

export async function logAdminChange(log: AdminChangeLog): Promise<void> {
  try {
    const sql = getDb();
    if (!sql) return;
    await sql`
      INSERT INTO admin_change_log (section, field_name, changed_by, note)
      VALUES (
        ${log.section},
        ${log.field_name ?? null},
        ${log.changed_by ?? 'admin'},
        ${log.note ?? null}
      )
    `;
  } catch (error) {
    console.error('[db] logAdminChange error:', error);
  }
}
