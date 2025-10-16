-- ============================================================
-- Initial CMS Database Migration (PostgreSQL)
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Inactive' CHECK (status IN ('Active', 'Inactive')),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);

-- ============================================================
-- SITES
-- ============================================================
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(191) NOT NULL UNIQUE,
    logo VARCHAR(255),
    icon VARCHAR(255),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'disabled' CHECK (status IN ('enabled', 'disabled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sites_user ON sites (user_id);

-- ============================================================
-- COMPONENT GROUPS
-- ============================================================
CREATE TABLE component_groups (
    id SERIAL PRIMARY KEY,
    "group" VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- COMPONENTS
-- ============================================================
CREATE TABLE components (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES component_groups(id) ON DELETE CASCADE,
    default_content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_components_group ON components (group_id);

-- ============================================================
-- SECTIONS
-- ============================================================
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    component_id INT NOT NULL REFERENCES components(id) ON DELETE CASCADE,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sections_component ON sections (component_id);
CREATE INDEX idx_sections_content_jsonb ON sections USING GIN (content jsonb_path_ops);

-- ============================================================
-- SITE LAYOUTS
-- ============================================================
CREATE TABLE site_layouts (
    id SERIAL PRIMARY KEY,
    site_id INT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    column_count INT DEFAULT 1,
    navbar INT REFERENCES sections(id),
    footer INT REFERENCES sections(id)
);

CREATE INDEX idx_layouts_site ON site_layouts (site_id);

-- ============================================================
-- PAGES
-- ============================================================
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    site_id INT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    slug VARCHAR(255) NOT NULL,
    label VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'disabled' CHECK (status IN ('enabled', 'disabled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_page_slug_per_site UNIQUE (site_id, slug)
);

CREATE INDEX idx_pages_site ON pages (site_id);
CREATE INDEX idx_pages_user ON pages (user_id);

-- ============================================================
-- PAGE SECTIONS
-- ============================================================
CREATE TABLE page_sections (
    id SERIAL PRIMARY KEY,
    page_id INT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    "order" INT DEFAULT 1
);

CREATE INDEX idx_page_sections_page ON page_sections (page_id);
CREATE INDEX idx_page_sections_section ON page_sections (section_id);

-- ============================================================
-- MEDIA
-- ============================================================
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    site_id INT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL CHECK (size >= 0),
    width INT,
    height INT,
    duration FLOAT,
    alt_text VARCHAR(255),
    caption VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_site ON media (site_id);
CREATE INDEX idx_media_user ON media (user_id);
CREATE INDEX idx_media_filename ON media (file_name);
CREATE INDEX idx_media_tags_gin ON media USING GIN (tags);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables that have updated_at
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at' AND table_schema = 'cms'
    LOOP
        EXECUTE format('CREATE TRIGGER set_updated_at_%I
                        BEFORE UPDATE ON %I
                        FOR EACH ROW
                        EXECUTE FUNCTION update_updated_at_column();',
                        r.table_name, r.table_name);
    END LOOP;
END $$;

