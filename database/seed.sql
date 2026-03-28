-- Neotiv Platform Supabase Seed Data

-- Clear existing data
TRUNCATE TABLE deals, hotel_services, notifications, alarms, chat_messages, guest_sessions, rooms, room_types, users, hotels, organizations RESTART IDENTITY CASCADE;

-- 1. Organizations
INSERT INTO organizations (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'Neotiv Management Group');

-- 2. Hotels
INSERT INTO hotels (id, organization_id, name, address, timezone, logo_url, status) VALUES 
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Grand Sapphire Resort', '123 Ocean Drive, Miami, FL 33139', 'America/New_York', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'active'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'The Urban Retreat', '456 Tech Boulevard, Austin, TX 78701', 'America/Chicago', 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?w=800&q=80', 'active'),
('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Alpine Vista Lodge', '789 Mountain Way, Aspen, CO 81611', 'America/Denver', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', 'setup_pending');

-- 3. Users (Auth IDs remain NULL or generic until real auth exists)
INSERT INTO users (id, organization_id, hotel_id, email, first_name, last_name, role) VALUES 
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', NULL, 'admin@neotiv.com', 'System', 'Admin', 'super_admin'),
('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'gm@grandsapphire.com', 'Marcus', 'Chen', 'hotel_manager'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'j.doe@grandsapphire.com', 'Jane', 'Doe', 'front_office'),
('33333333-3333-3333-3333-333333333334', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'm.smith@grandsapphire.com', 'Michael', 'Smith', 'front_office');

-- 4. Room Types (Grand Sapphire)
INSERT INTO room_types (id, hotel_id, name, description, base_price, capacity) VALUES 
('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222221', 'Standard Room', 'Comfortable room with essential amenities.', 150.00, 2),
('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222221', 'Deluxe Ocean View', 'Spacious room featuring a balcony with panoramic ocean views.', 280.00, 3),
('44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222221', 'Presidential Suite', 'Luxury suite with separate living area, premium bar, and jacuzzi.', 850.00, 4);

-- 5. Rooms (Grand Sapphire)
INSERT INTO rooms (id, hotel_id, room_type_id, number, floor, status) VALUES 
('55555555-5555-5555-5555-555555555551', '22222222-2222-2222-2222-222222222221', '44444444-4444-4444-4444-444444444441', '101', 1, 'available'),
('55555555-5555-5555-5555-555555555552', '22222222-2222-2222-2222-222222222221', '44444444-4444-4444-4444-444444444441', '102', 1, 'occupied'),
('55555555-5555-5555-5555-555555555553', '22222222-2222-2222-2222-222222222221', '44444444-4444-4444-4444-444444444441', '103', 1, 'maintenance'),
('55555555-5555-5555-5555-555555555554', '22222222-2222-2222-2222-222222222221', '44444444-4444-4444-4444-444444444442', '201', 2, 'occupied'),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222221', '44444444-4444-4444-4444-444444444442', '202', 2, 'available'),
('55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222221', '44444444-4444-4444-4444-444444444443', '301', 3, 'occupied');

-- 6. Guest Sessions
INSERT INTO guest_sessions (id, room_id, session_token, guest_name, check_in, is_active, tv_background_url) VALUES 
('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555552', 'tok_1', 'Sarah Jenkins', NOW() - INTERVAL '2 days', true, 'https://images.unsplash.com/photo-1542314831-c6a4d14efa82?w=800&q=80'),
('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555554', 'tok_2', 'Alexander Mitchell', NOW() - INTERVAL '1 day', true, 'https://images.unsplash.com/photo-1498092651296-641e88c3b057?w=800&q=80'),
('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555556', 'tok_3', 'Emma Watson', NOW() - INTERVAL '4 hours', true, 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80');

-- 7. Chat Messages
INSERT INTO chat_messages (session_id, sender_role, content, read_at, created_at) VALUES 
('66666666-6666-6666-6666-666666666662', 'guest', 'Hi, can I get extra towels?', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('66666666-6666-6666-6666-666666666662', 'front_office', 'Of course! Housekeeping is on the way.', NOW(), NOW() - INTERVAL '55 minutes');

-- 8. Alarms
INSERT INTO alarms (session_id, scheduled_at, note, is_active, acknowledged) VALUES 
('66666666-6666-6666-6666-666666666662', NOW() + INTERVAL '1 day', 'Airport transfer', true, false),
('66666666-6666-6666-6666-666666666661', NOW() - INTERVAL '1 hour', 'Morning run', true, true);

-- 9. Notifications
INSERT INTO notifications (hotel_id, session_id, title, body, type, created_at) VALUES 
('22222222-2222-2222-2222-222222222221', NULL, 'Happy Hour', 'Join us at the pool bar for 2-for-1 drinks until 7 PM!', 'info', NOW() - INTERVAL '2 hours'),
('22222222-2222-2222-2222-222222222221', '66666666-6666-6666-6666-666666666662', 'Welcome Gift', 'Please enjoy the complimentary fruit basket delivered to your room.', 'success', NOW() - INTERVAL '23 hours');

-- 10. Deals
INSERT INTO deals (id, hotel_id, title, description, poster_url, valid_until) VALUES 
('77777777-7777-7777-7777-777777777771', '22222222-2222-2222-2222-222222222221', 'Signature Spa Retreat', 'Book a 90-minute massage and get a complimentary facial.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', NOW() + INTERVAL '30 days'),
('77777777-7777-7777-7777-777777777772', '22222222-2222-2222-2222-222222222221', 'Chef''s Tasting Menu', 'Experience our 5-course seasonal dinner curated by Chef Laurent.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', NOW() + INTERVAL '14 days');

-- 11. Hotel Services
-- Since ID uses DEFAULT uuid_generate_v4(), we can just specify the required columns without assigning explicit UUIDs
INSERT INTO hotel_services (hotel_id, category, name, description) VALUES 
('22222222-2222-2222-2222-222222222221', 'food', 'Room Service', 'Order from our full menu, delivered to your room 24/7'),
('22222222-2222-2222-2222-222222222221', 'spa', 'Spa & Massage', 'Book in-room or visit our wellness center'),
('22222222-2222-2222-2222-222222222221', 'transport', 'Airport Transfer', 'Private car service to/from the airport'),
('22222222-2222-2222-2222-222222222221', 'laundry', 'Laundry & Dry Clean', 'Express laundry service, 4-hour turnaround'),
('22222222-2222-2222-2222-222222222221', 'food', 'Restaurant Reservation', 'Reserve a table at any of our 3 dining venues'),
('22222222-2222-2222-2222-222222222221', 'other', 'Concierge', 'Tour bookings, tickets, and local recommendations');
