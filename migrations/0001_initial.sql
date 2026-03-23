-- ActivityPub tables
CREATE TABLE IF NOT EXISTS followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_id TEXT NOT NULL UNIQUE,
    inbox TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    ap_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published DATETIME NOT NULL,
    updated DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    actor_id TEXT NOT NULL,
    ap_id TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    actor_id TEXT NOT NULL,
    ap_id TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Fedify storage tables
CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS federation_cache (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_followers_actor ON followers(actor_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_ap_id ON posts(ap_id);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_actor ON likes(actor_id);
CREATE INDEX idx_shares_post ON shares(post_id);
CREATE INDEX idx_shares_actor ON shares(actor_id);
CREATE INDEX idx_kv_expires ON kv_store(expires_at);
CREATE INDEX idx_federation_cache_expires ON federation_cache(expires_at);