-- ============================================================
-- Initial CMS Database Migration
-- ============================================================

-- Use UTF8MB4 for full Unicode support (e.g., emojis)
CREATE DATABASE IF NOT EXISTS cms DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cms;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    status ENUM('Active', 'Inactive') DEFAULT 'Inactive',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SITES
-- ============================================================
CREATE TABLE IF NOT EXISTS sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(191) NOT NULL UNIQUE,
    logo VARCHAR(255),
    icon VARCHAR(255),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM('enabled', 'disabled') DEFAULT 'disabled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sites_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SITE LAYOUTS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_layouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_id INT NOT NULL,
    column_count INT DEFAULT 1,
    navbar INT,
    footer INT,
    CONSTRAINT fk_layouts_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    CONSTRAINT fk_layouts_navbar FOREIGN KEY (navbar) REFERENCES sections(id),
    CONSTRAINT fk_layouts_footer FOREIGN KEY (footer) REFERENCES sections(id),
    INDEX idx_layouts_site (site_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- COMPONENT GROUPS
-- ============================================================
CREATE TABLE IF NOT EXISTS component_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `group` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- COMPONENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    default_content JSON,
    CONSTRAINT fk_components_group FOREIGN KEY (group_id) REFERENCES component_groups(id) ON DELETE CASCADE,
    INDEX idx_components_group (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    component_id INT NOT NULL,
    content JSON,
    CONSTRAINT fk_sections_component FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
    INDEX idx_sections_component (component_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    site_id INT NOT NULL,
    slug VARCHAR(255) NOT NULL,
    label VARCHAR(100) NOT NULL,
    status ENUM('enabled', 'disabled') DEFAULT 'disabled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pages_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    UNIQUE KEY uq_page_slug_site (site_id, slug),
    INDEX idx_pages_site (site_id),
    INDEX idx_pages_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PAGE SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS page_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    section_id INT NOT NULL,
    `order` INT DEFAULT 1,
    CONSTRAINT fk_page_sections_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    CONSTRAINT fk_page_sections_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    INDEX idx_page_sections_page (page_id),
    INDEX idx_page_sections_section (section_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_id INT NOT NULL,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    size BIGINT UNSIGNED NOT NULL,
    width INT,
    height INT,
    duration FLOAT,
    alt_text VARCHAR(255),
    caption VARCHAR(255),
    tags JSON,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    CONSTRAINT fk_media_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_media_site (site_id),
    INDEX idx_media_user (user_id),
    INDEX idx_media_filename (file_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Index Recommendations
-- ============================================================
-- 1. Email and domain already indexed for uniqueness.
-- 2. site_id and user_id are indexed for quick joins.
-- 3. JSON fields (default_content, content, tags) can use MySQL 8 JSON indexing later if needed.
