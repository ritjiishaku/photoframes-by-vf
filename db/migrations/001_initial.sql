-- Analytics events — PRD Section 13
-- Primary conversion tracking for WhatsApp clicks, page views, etc.
CREATE TABLE IF NOT EXISTS analytics_events (
  id             SERIAL PRIMARY KEY,
  event_type     VARCHAR(64)  NOT NULL
                 CHECK (event_type IN (
                   'whatsapp_click', 'product_view', 'category_click',
                   'hero_cta', 'instagram_click', 'scroll_depth'
                 )),
  product_slug   VARCHAR(255),
  category_slug  VARCHAR(255),
  inquiry_type   VARCHAR(32)
                 CHECK (inquiry_type IN (
                   'product_specific', 'general', 'custom_order', 'corporate'
                 )),
  traffic_source VARCHAR(64),
  scroll_depth   SMALLINT     CHECK (scroll_depth IN (25, 50, 75, 100)),
  session_id     VARCHAR(64),
  user_agent     TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_product    ON analytics_events(product_slug)
  WHERE product_slug IS NOT NULL;

-- Admin change log — PRD Section 16
-- Tracks all content changes made by admin via Sanity
CREATE TABLE IF NOT EXISTS admin_change_log (
  id          SERIAL PRIMARY KEY,
  section     VARCHAR(64)  NOT NULL
              CHECK (section IN (
                'hero', 'product', 'category', 'testimonial',
                'contact_info', 'about', 'seo'
              )),
  field_name  VARCHAR(128),
  changed_by  VARCHAR(64)  DEFAULT 'admin',
  changed_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note        TEXT
);

CREATE INDEX IF NOT EXISTS idx_change_log_section    ON admin_change_log(section);
CREATE INDEX IF NOT EXISTS idx_change_log_changed_at ON admin_change_log(changed_at);
