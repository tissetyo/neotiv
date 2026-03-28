-- Neotiv Platform Supabase Seed Data

-- Clear existing data
TRUNCATE TABLE deals, hotel_services, notifications, alarms, chat_messages, guest_sessions, rooms, room_types, users, hotels, organizations RESTART IDENTITY CASCADE;

-- 1. Organizations
INSERT INTO organizations (id, name) VALUES 
('org-00000000-0000-0000-0000-000000000001', 'Neotiv Management Group');

-- 2. Hotels
INSERT INTO hotels (id, organization_id, name, address, timezone, logo_url, status) VALUES 
('h-grand-sapphire-0000-0000-000000000000', 'org-00000000-0000-0000-0000-000000000001', 'Grand Sapphire Resort', '123 Ocean Drive, Miami, FL 33139', 'America/New_York', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'active'),
('h-urban-retreat-0000-0000-000000000000', 'org-00000000-0000-0000-0000-000000000001', 'The Urban Retreat', '456 Tech Boulevard, Austin, TX 78701', 'America/Chicago', 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?w=800&q=80', 'active'),
('h-alpine-lodge-0000-0000-000000000000', 'org-00000000-0000-0000-0000-000000000001', 'Alpine Vista Lodge', '789 Mountain Way, Aspen, CO 81611', 'America/Denver', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', 'setup_pending');

-- 3. Users
INSERT INTO users (id, organization_id, hotel_id, email, first_name, last_name, role) VALUES 
('usr-admin-0000-0000-0000-000000000001', 'org-00000000-0000-0000-0000-000000000001', NULL, 'admin@neotiv.com', 'System', 'Admin', 'super_admin'),
('usr-gm-0000-0000-0000-00000000000000', 'org-00000000-0000-0000-0000-000000000001', 'h-grand-sapphire-0000-0000-000000000000', 'gm@grandsapphire.com', 'Marcus', 'Chen', 'hotel_manager'),
('usr-fo-0000-0000-0000-00000000000001', 'org-00000000-0000-0000-0000-000000000001', 'h-grand-sapphire-0000-0000-000000000000', 'j.doe@grandsapphire.com', 'Jane', 'Doe', 'front_office'),
('usr-fo-0000-0000-0000-00000000000002', 'org-00000000-0000-0000-0000-000000000001', 'h-grand-sapphire-0000-0000-000000000000', 'm.smith@grandsapphire.com', 'Michael', 'Smith', 'front_office');

-- 4. Room Types (Grand Sapphire)
INSERT INTO room_types (id, hotel_id, name, description, base_price, capacity) VALUES 
('rt-std-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'Standard Room', 'Comfortable room with essential amenities.', 150.00, 2),
('rt-dlx-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'Deluxe Ocean View', 'Spacious room featuring a balcony with panoramic ocean views.', 280.00, 3),
('rt-ste-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'Presidential Suite', 'Luxury suite with separate living area, premium bar, and jacuzzi.', 850.00, 4);

-- 5. Rooms (Grand Sapphire)
INSERT INTO rooms (id, hotel_id, room_type_id, number, floor, status) VALUES 
('rm-101-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'rt-std-0000-0000-0000-00000000000000', '101', 1, 'available'),
('rm-102-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'rt-std-0000-0000-0000-00000000000000', '102', 1, 'occupied'),
('rm-103-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'rt-std-0000-0000-0000-00000000000000', '103', 1, 'maintenance'),
('rm-201-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'rt-dlx-0000-0000-0000-00000000000000', '201', 2, 'occupied'),
('rm-202-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'rt-dlx-0000-0000-0000-00000000000000', '202', 2, 'available'),
('rm-301-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'rt-ste-0000-0000-0000-00000000000000', '301', 3, 'occupied');

-- 6. Guest Sessions
INSERT INTO guest_sessions (id, room_id, session_token, guest_name, check_in, is_active, tv_background_url) VALUES 
('sess-102-0000-0000-0000-000000000000', 'rm-102-0000-0000-0000-00000000000000', 'tok_1', 'Sarah Jenkins', NOW() - INTERVAL '2 days', true, 'https://images.unsplash.com/photo-1542314831-c6a4d14efa82?w=800&q=80'),
('sess-201-0000-0000-0000-000000000000', 'rm-201-0000-0000-0000-00000000000000', 'tok_2', 'Alexander Mitchell', NOW() - INTERVAL '1 day', true, 'https://images.unsplash.com/photo-1498092651296-641e88c3b057?w=800&q=80'),
('sess-301-0000-0000-0000-000000000000', 'rm-301-0000-0000-0000-00000000000000', 'tok_3', 'Emma Watson', NOW() - INTERVAL '4 hours', true, 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80');

-- 7. Chat Messages
INSERT INTO chat_messages (session_id, sender_role, content, read_at, created_at) VALUES 
('sess-201-0000-0000-0000-000000000000', 'guest', 'Hi, can I get extra towels?', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('sess-201-0000-0000-0000-000000000000', 'front_office', 'Of course! Housekeeping is on the way.', NOW(), NOW() - INTERVAL '55 minutes');

-- 8. Alarms
INSERT INTO alarms (session_id, scheduled_at, note, is_active, acknowledged) VALUES 
('sess-201-0000-0000-0000-000000000000', NOW() + INTERVAL '1 day', 'Airport transfer', true, false),
('sess-102-0000-0000-0000-000000000000', NOW() - INTERVAL '1 hour', 'Morning run', true, true);

-- 9. Notifications
INSERT INTO notifications (hotel_id, session_id, title, body, type, created_at) VALUES 
('h-grand-sapphire-0000-0000-000000000000', NULL, 'Happy Hour', 'Join us at the pool bar for 2-for-1 drinks until 7 PM!', 'info', NOW() - INTERVAL '2 hours'),
('h-grand-sapphire-0000-0000-000000000000', 'sess-201-0000-0000-0000-000000000000', 'Welcome Gift', 'Please enjoy the complimentary fruit basket delivered to your room.', 'success', NOW() - INTERVAL '23 hours');

-- 10. Deals
INSERT INTO deals (id, hotel_id, title, description, poster_url, valid_until) VALUES 
('deal-1-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'Signature Spa Retreat', 'Book a 90-minute massage and get a complimentary facial.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', NOW() + INTERVAL '30 days'),
('deal-2-0000-0000-0000-00000000000000', 'h-grand-sapphire-0000-0000-000000000000', 'Chef''s Tasting Menu', 'Experience our 5-course seasonal dinner curated by Chef Laurent.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', NOW() + INTERVAL '14 days');

-- 11. Hotel Services
INSERT INTO hotel_services (hotel_id, category, name, description) VALUES 
('h-grand-sapphire-0000-0000-000000000000', 'food', 'Room Service', 'Order from our full menu, delivered to your room 24/7'),
('h-grand-sapphire-0000-0000-000000000000', 'spa', 'Spa & Massage', 'Book in-room or visit our wellness center'),
('h-grand-sapphire-0000-0000-000000000000', 'transport', 'Airport Transfer', 'Private car service to/from the airport'),
('h-grand-sapphire-0000-0000-000000000000', 'laundry', 'Laundry & Dry Clean', 'Express laundry service, 4-hour turnaround'),
('h-grand-sapphire-0000-0000-000000000000', 'food', 'Restaurant Reservation', 'Reserve a table at any of our 3 dining venues'),
('h-grand-sapphire-0000-0000-000000000000', 'other', 'Concierge', 'Tour bookings, tickets, and local recommendations');
