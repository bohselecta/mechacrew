-- MechaCrew Database Schema
-- Neon PostgreSQL Database Setup

-- Create mecha_sessions table
CREATE TABLE IF NOT EXISTS mecha_sessions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    components JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    created_by VARCHAR(255) DEFAULT 'guest',
    session_data JSONB DEFAULT '{}'
);

-- Create mecha_components table
CREATE TABLE IF NOT EXISTS mecha_components (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES mecha_sessions(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('head', 'torso', 'arm', 'leg', 'weapon', 'accessory')),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    position JSONB NOT NULL DEFAULT '[0, 0, 0]',
    rotation JSONB NOT NULL DEFAULT '[0, 0, 0]',
    scale JSONB NOT NULL DEFAULT '[1, 1, 1]',
    color VARCHAR(7) NOT NULL DEFAULT '#08B0D5',
    material VARCHAR(50) NOT NULL DEFAULT 'steel',
    power INTEGER DEFAULT 0 CHECK (power >= 0 AND power <= 200),
    durability INTEGER DEFAULT 100 CHECK (durability >= 0 AND durability <= 100),
    weight INTEGER DEFAULT 0 CHECK (weight >= 0 AND weight <= 100),
    created_by VARCHAR(255) DEFAULT 'guest',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create user_sessions table (for collaboration)
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES mecha_sessions(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_color VARCHAR(7) DEFAULT '#08B0D5',
    position JSONB DEFAULT '[0, 0, 0]',
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collaboration_messages table
CREATE TABLE IF NOT EXISTS collaboration_messages (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES mecha_sessions(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'chat' CHECK (message_type IN ('chat', 'action')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_generations table (for tracking AI usage)
CREATE TABLE IF NOT EXISTS ai_generations (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES mecha_sessions(id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    prompt TEXT NOT NULL,
    response JSONB NOT NULL,
    component_id VARCHAR(255),
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mecha_sessions_public ON mecha_sessions(is_public);
CREATE INDEX IF NOT EXISTS idx_mecha_sessions_created_by ON mecha_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_mecha_sessions_updated_at ON mecha_sessions(updated_at);

CREATE INDEX IF NOT EXISTS idx_mecha_components_session_id ON mecha_components(session_id);
CREATE INDEX IF NOT EXISTS idx_mecha_components_type ON mecha_components(type);
CREATE INDEX IF NOT EXISTS idx_mecha_components_created_by ON mecha_components(created_by);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_collaboration_messages_session_id ON collaboration_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_created_at ON collaboration_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_generations_session_id ON ai_generations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_mecha_sessions_updated_at 
    BEFORE UPDATE ON mecha_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some demo data
INSERT INTO mecha_sessions (id, name, description, components, is_public, created_by) VALUES
('demo-session-1', 'Alpha Mecha Prototype', 'First collaborative mecha build', '[]', true, 'system'),
('demo-session-2', 'Battle Ready Gundam', 'Heavily armed combat mecha', '[]', true, 'system'),
('demo-session-3', 'Stealth Assassin', 'High-speed reconnaissance mecha', '[]', true, 'system')
ON CONFLICT (id) DO NOTHING;

-- Create a view for session statistics
CREATE OR REPLACE VIEW session_stats AS
SELECT 
    s.id,
    s.name,
    s.description,
    s.created_at,
    s.updated_at,
    s.is_public,
    s.created_by,
    COUNT(DISTINCT c.id) as component_count,
    COUNT(DISTINCT u.id) as active_users,
    COALESCE(SUM(c.power), 0) as total_power,
    COALESCE(SUM(c.weight), 0) as total_weight,
    COALESCE(AVG(c.durability), 0) as avg_durability
FROM mecha_sessions s
LEFT JOIN mecha_components c ON s.id = c.session_id
LEFT JOIN user_sessions u ON s.id = u.session_id AND u.is_active = true
GROUP BY s.id, s.name, s.description, s.created_at, s.updated_at, s.is_public, s.created_by;
