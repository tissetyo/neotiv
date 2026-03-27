-- Neotiv Platform Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Hotels
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    logo_url TEXT,
    status VARCHAR(50) DEFAULT 'setup_pending', -- active, setup_pending
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Users (Staff) - links to auth.users theoretically, but keeping it standalone for now for ease of seeding
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID, -- References auth.users(id) in a real setup
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES hotels(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- super_admin, hotel_manager, front_office
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Room Types
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Rooms
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    room_type_id UUID REFERENCES room_types(id) ON DELETE RESTRICT NOT NULL,
    number VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'available', -- available, occupied, maintenance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hotel_id, number)
);

-- 6. Guest Sessions
CREATE TABLE guest_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    check_out TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    tv_background_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Chat Messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES guest_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_role VARCHAR(50) NOT NULL, -- guest, front_office
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Alarms
CREATE TABLE alarms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES guest_sessions(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    note TEXT,
    is_active BOOLEAN DEFAULT true,
    acknowledged BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES guest_sessions(id) ON DELETE CASCADE, -- null means broadcast to hotel
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, warning, success
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Deals
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to update room status on session active toggle (simplified logic)
CREATE OR REPLACE FUNCTION update_room_status_on_session()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = true THEN
        UPDATE rooms SET status = 'occupied' WHERE id = NEW.room_id;
    ELSIF NEW.is_active = false THEN
        UPDATE rooms SET status = 'available' WHERE id = NEW.room_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_session_status
AFTER INSERT OR UPDATE OF is_active ON guest_sessions
FOR EACH ROW
EXECUTE FUNCTION update_room_status_on_session();


-- ENABLE ROW LEVEL SECURITY
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarms ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- For Phase 5 Demo Purposes: Allow ALL operations to anonymous/authenticated users so frontend works immediately.
-- In a production environment, strict policies should be bound to auth.uid() and role tables.
CREATE POLICY "Allow all operations for organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow all operations for hotels" ON hotels FOR ALL USING (true);
CREATE POLICY "Allow all operations for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for room_types" ON room_types FOR ALL USING (true);
CREATE POLICY "Allow all operations for rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations for guest_sessions" ON guest_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations for chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations for alarms" ON alarms FOR ALL USING (true);
CREATE POLICY "Allow all operations for notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations for deals" ON deals FOR ALL USING (true);

-- ENABLE REALTIME
-- This tells Supabase to broadcast changes for these tables over WebSockets
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table alarms;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table rooms;
