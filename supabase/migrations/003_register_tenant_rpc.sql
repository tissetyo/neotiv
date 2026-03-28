-- ============================================================
-- MIGRATION: 003_register_tenant_rpc.sql
-- DESCRIPTION: Atomic registration function for new tenants
-- ============================================================

-- Function to handle atomic tenant creation, bypassing RLS using SECURITY DEFINER
CREATE OR REPLACE FUNCTION register_new_tenant(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_org_name text,
  p_hotel_name text,
  p_hotel_slug text,
  p_hotel_address text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Essential: runs as db owner to bypass RLS during registration
SET search_path = public
AS $$
DECLARE
  v_user_uuid uuid;
  v_org_id uuid;
  v_hotel_id uuid;
  v_org_slug text;
BEGIN
  -- 1. Ensure the user is actually authenticated via Supabase Auth
  v_user_uuid := auth.uid();
  IF v_user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 2. Verify hotel slug is unique
  IF EXISTS (SELECT 1 FROM hotels WHERE slug = p_hotel_slug) THEN
    RAISE EXCEPTION 'Dashboard URL is already taken.';
  END IF;

  -- 3. Create Organization
  -- Generate a random 4-char suffix for the org slug
  v_org_slug := lower(regexp_replace(p_org_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(md5(random()::text) from 1 for 4);
  
  INSERT INTO organizations (name, slug)
  VALUES (p_org_name, v_org_slug)
  RETURNING id INTO v_org_id;

  -- 4. Create Hotel
  INSERT INTO hotels (organization_id, name, slug, address, status)
  VALUES (v_org_id, p_hotel_name, p_hotel_slug, p_hotel_address, 'active')
  RETURNING id INTO v_hotel_id;

  -- 5. Create super_admin User Profile
  -- Wait, the user profile requires the role to be 'super_admin' or 'hotel_manager'
  INSERT INTO users (auth_id, email, first_name, last_name, role, organization_id, hotel_id)
  VALUES (v_user_uuid, p_email, p_first_name, p_last_name, 'super_admin', v_org_id, v_hotel_id);

  -- Return success object with the new hotel slug
  RETURN json_build_object(
    'success', true,
    'hotelId', v_hotel_id,
    'hotelSlug', p_hotel_slug
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Registration failed: %', SQLERRM;
END;
$$;
